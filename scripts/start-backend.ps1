param(
  [switch]$WithPgAdmin,
  [switch]$FollowLogs,
  [switch]$SeedOnce
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

function Write-Step([string]$Message) {
  Write-Host "`n==> $Message" -ForegroundColor Cyan
}

function Invoke-Cmd([string]$Command) {
  Write-Host "   $Command" -ForegroundColor DarkGray
  & powershell -NoProfile -Command $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Command failed with exit code ${LASTEXITCODE}: $Command"
  }
}

function Set-SeedFlag([string]$EnvFile, [bool]$Enabled) {
  $target = if ($Enabled) { "true" } else { "false" }
  $raw = Get-Content -LiteralPath $EnvFile -Raw

  if ($raw -match "(?m)^PRISMA_RUN_SEED\s*=") {
    $raw = [regex]::Replace($raw, "(?m)^PRISMA_RUN_SEED\s*=.*$", "PRISMA_RUN_SEED=$target")
  } else {
    if (-not $raw.EndsWith("`n")) { $raw += "`r`n" }
    $raw += "PRISMA_RUN_SEED=$target`r`n"
  }

  Set-Content -LiteralPath $EnvFile -Value $raw -Encoding UTF8
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot
$envFile = Join-Path $repoRoot ".env"

# Validamos docker primero para dar error temprano y claro
# (evita mensajes confusos cuando Docker Desktop no esta listo).
Write-Step "Validando Docker"
Invoke-Cmd "docker info > `$null"

if ($SeedOnce) {
  if (-not (Test-Path $envFile)) {
    throw "No existe .env en la raiz. Crea .env primero (desde .env.example)."
  }
  # SeedOnce: habilita seed solo para este arranque.
  Write-Step "Activando PRISMA_RUN_SEED=true solo para este arranque"
  Set-SeedFlag -EnvFile $envFile -Enabled $true
}

if ($WithPgAdmin) {
  # --profile tools levanta utilidades opcionales (pgAdmin).
  # Esto permite un stack base mas ligero para quien no necesita GUI de BD.
  Write-Step "Levantando db + api + pgadmin"
  Invoke-Cmd "docker compose --profile tools up --build -d"
} else {
  # Flujo principal del equipo: solo BD + API.
  Write-Step "Levantando db + api"
  Invoke-Cmd "docker compose up --build -d"
}

# Mostramos estado para confirmar rapidamente si algo reinicia o fallo.
Write-Step "Estado de servicios"
Invoke-Cmd "docker compose ps"

if ($FollowLogs) {
  # Logs en vivo ayudan a diagnosticar migraciones o variables faltantes.
  Write-Step "Siguiendo logs de db y api"
  Invoke-Cmd "docker compose logs -f db api"
} else {
  Write-Step "Completado"
  Write-Host "API: http://localhost:3000/docs" -ForegroundColor Green
  if ($WithPgAdmin) {
    Write-Host "pgAdmin: http://localhost:5050" -ForegroundColor Green
  }
}

if ($SeedOnce) {
  # Dejamos seed apagado para proximos arranques, evitando ejecuciones repetidas.
  Write-Step "Desactivando PRISMA_RUN_SEED para proximos arranques"
  Set-SeedFlag -EnvFile $envFile -Enabled $false
  Write-Host "Seed ejecutado una sola vez. PRISMA_RUN_SEED quedo en false." -ForegroundColor Green
}
