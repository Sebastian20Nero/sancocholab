param(
  [Parameter(Mandatory = $true)]
  [string]$InputFile
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

# Restore para clonar datos entre compañeros.
# Reemplaza completamente el contenido de la BD local.
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

if (-not [System.IO.Path]::IsPathRooted($InputFile)) {
  $InputFile = Join-Path $repoRoot $InputFile
}

if (-not (Test-Path $InputFile)) {
  throw "No existe el archivo de backup: $InputFile"
}

Write-Step "Validando Docker y contenedor db"
Invoke-Cmd "docker compose ps"

Write-Host ""
$confirmation = Read-Host "Esto sobrescribira la BD local. Escribe SI para continuar"
if ($confirmation -ne "SI") {
  Write-Host "Operacion cancelada por usuario." -ForegroundColor Yellow
  exit 0
}

Write-Step "Limpiando schema public"
Invoke-Cmd "docker compose exec -T db psql -U sancocholab -d sancocholab -c `"DROP SCHEMA public CASCADE; CREATE SCHEMA public;`""

Write-Step "Restaurando dump desde: $InputFile"
Write-Host "   docker compose exec -T db psql -U sancocholab -d sancocholab < `"$InputFile`"" -ForegroundColor DarkGray
& cmd /c "docker compose exec -T db psql -U sancocholab -d sancocholab < ""$InputFile"""
if ($LASTEXITCODE -ne 0) {
  throw "No se pudo restaurar el backup SQL."
}

Write-Step "Restore completado"
Write-Host "Base local restaurada correctamente." -ForegroundColor Green
