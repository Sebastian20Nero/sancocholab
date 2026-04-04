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

function Run-Cmd([string]$Command) {
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

Write-Step "Validando Docker"
Run-Cmd "docker info > `$null"

if ($SeedOnce) {
  if (-not (Test-Path $envFile)) {
    throw "No existe .env. Crea .env desde .env.example."
  }
  Write-Step "Activando seed temporalmente (solo este arranque)"
  Set-SeedFlag -EnvFile $envFile -Enabled $true
}

if ($WithPgAdmin) {
  Write-Step "Levantando db + api + pgadmin"
  Run-Cmd "docker compose --profile tools up --build -d"
} else {
  Write-Step "Levantando db + api"
  Run-Cmd "docker compose up --build -d"
}

Write-Step "Estado de servicios"
Run-Cmd "docker compose ps"

if ($SeedOnce) {
  Write-Step "Desactivando seed para siguientes arranques"
  Set-SeedFlag -EnvFile $envFile -Enabled $false
}

if ($FollowLogs) {
  Write-Step "Mostrando logs (db/api)"
  Run-Cmd "docker compose logs -f db api"
}

Write-Host "`nListo: API en http://127.0.0.1:3000/docs" -ForegroundColor Green
if ($WithPgAdmin) {
  Write-Host "Listo: pgAdmin en http://127.0.0.1:5050/login" -ForegroundColor Green
}
