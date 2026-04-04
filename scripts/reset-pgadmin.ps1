param(
  [switch]$FollowLogs
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

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Step "Validando Docker"
Run-Cmd "docker info > `$null"

Write-Step "Deteniendo solo pgAdmin"
Run-Cmd "docker compose --profile tools stop pgadmin"

Write-Step "Eliminando contenedor de pgAdmin"
Run-Cmd "docker compose --profile tools rm -f pgadmin"

Write-Step "Eliminando volumen de datos de pgAdmin (resetea credenciales UI)"
$pgadminVolume = "sancocholab_pgadmin_data"
$existingVolume = docker volume ls --format "{{.Name}}" | Where-Object { $_ -eq $pgadminVolume }
if ($existingVolume) {
  Run-Cmd "docker volume rm $pgadminVolume"
} else {
  Write-Host "   Volumen $pgadminVolume no existe, continuo..." -ForegroundColor DarkYellow
}

Write-Step "Levantando pgAdmin de nuevo"
Run-Cmd "docker compose --profile tools up -d pgadmin"

Write-Host "`nListo: pgAdmin en http://127.0.0.1:5050/login" -ForegroundColor Green
Write-Host "Credenciales por defecto: admin@sancocholab.com / admin123" -ForegroundColor Green

if ($FollowLogs) {
  Write-Step "Mostrando logs de pgAdmin"
  Run-Cmd "docker compose --profile tools logs -f pgadmin"
}
