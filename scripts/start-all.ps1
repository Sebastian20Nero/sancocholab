param(
  [switch]$WithPgAdmin,
  [switch]$ReinstallFrontendDeps,
  [switch]$NoFrontend,
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
$frontendPath = Join-Path $repoRoot "frontend"
$envFile = Join-Path $repoRoot ".env"

Set-Location $repoRoot

# Verifica que Docker responda antes de intentar build/run.
Write-Step "Validando Docker"
Invoke-Cmd "docker info > `$null"

if ($SeedOnce) {
  if (-not (Test-Path $envFile)) {
    throw "No existe .env en la raiz. Crea .env primero (desde .env.example)."
  }
  # SeedOnce: habilita seed temporalmente en este arranque.
  Write-Step "Activando PRISMA_RUN_SEED=true solo para este arranque"
  Set-SeedFlag -EnvFile $envFile -Enabled $true
}

if ($WithPgAdmin) {
  # Incluye herramientas de soporte (pgAdmin) para quienes prefieren UI.
  Write-Step "Levantando db + api + pgadmin"
  Invoke-Cmd "docker compose --profile tools up --build -d"
} else {
  # Arranque base recomendado para todo el equipo.
  Write-Step "Levantando db + api"
  Invoke-Cmd "docker compose up --build -d"
}

Write-Step "Estado de servicios Docker"
Invoke-Cmd "docker compose ps"

if ($NoFrontend) {
  Write-Step "Frontend omitido (-NoFrontend)"
  Write-Host "Backend listo en: http://localhost:3000/docs" -ForegroundColor Green
  if ($SeedOnce) {
    Write-Step "Desactivando PRISMA_RUN_SEED para proximos arranques"
    Set-SeedFlag -EnvFile $envFile -Enabled $false
    Write-Host "Seed ejecutado una sola vez. PRISMA_RUN_SEED quedo en false." -ForegroundColor Green
  }
  exit 0
}

if ($ReinstallFrontendDeps -or -not (Test-Path (Join-Path $frontendPath "node_modules"))) {
  # En equipos nuevos o tras limpieza, instala dependencias para evitar
  # errores de modulos faltantes al iniciar Angular.
  Write-Step "Instalando dependencias de frontend"
  Invoke-Cmd "Set-Location -LiteralPath '$frontendPath'; npm install"
}

# Se abre una terminal aparte para no bloquear esta consola.
# Asi el desarrollador puede seguir usando esta ventana para logs/comandos.
Write-Step "Abriendo frontend en nueva terminal"
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$frontendPath'; npm run start"
)

Write-Step "Completado"
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Green
Write-Host "API: http://localhost:3000" -ForegroundColor Green
Write-Host "Swagger: http://localhost:3000/docs" -ForegroundColor Green
if ($WithPgAdmin) {
  Write-Host "pgAdmin: http://localhost:5050" -ForegroundColor Green
}

if ($SeedOnce) {
  Write-Step "Desactivando PRISMA_RUN_SEED para proximos arranques"
  Set-SeedFlag -EnvFile $envFile -Enabled $false
  Write-Host "Seed ejecutado una sola vez. PRISMA_RUN_SEED quedo en false." -ForegroundColor Green
}
