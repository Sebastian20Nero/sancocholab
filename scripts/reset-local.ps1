param(
  [switch]$HardReset,
  [switch]$FollowLogs
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

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

# Validacion temprana: evita ejecutar flujo de reset si Docker no esta listo.
Write-Step "Validando Docker"
Invoke-Cmd "docker info > `$null"

if ($HardReset) {
  # Modo destructivo para desarrollo: elimina volumenes y datos locales.
  # Util cuando hay inconsistencias de migraciones o datos corruptos.
  Write-Step "Bajando contenedores y borrando volumenes"
  Invoke-Cmd "docker compose down -v --remove-orphans"
} else {
  # Modo seguro: reinicia servicios sin perder datos de PostgreSQL.
  Write-Step "Bajando contenedores"
  Invoke-Cmd "docker compose down --remove-orphans"
}

# Reconstruye y levanta stack para garantizar que codigo y Dockerfile actual
# queden aplicados tras cambios del repositorio.
Write-Step "Levantando stack (build incluido)"
Invoke-Cmd "docker compose up --build -d"

Write-Step "Estado de servicios"
Invoke-Cmd "docker compose ps"

if ($FollowLogs) {
  Write-Step "Siguiendo logs de db y api"
  Invoke-Cmd "docker compose logs -f db api"
} else {
  Write-Step "Completado"
  Write-Host "Tip: para ver logs usa -> docker compose logs -f db api" -ForegroundColor Green
}
