param(
  [string]$OutputFile
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

# Backup para compartir datos con el equipo.
# Genera dump SQL legible y portable desde el contenedor de PostgreSQL.
$repoRoot = Split-Path -Parent $PSScriptRoot
$backupDir = Join-Path $repoRoot "backups"
Set-Location $repoRoot

if (-not (Test-Path $backupDir)) {
  New-Item -ItemType Directory -Path $backupDir | Out-Null
}

if (-not $OutputFile) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $OutputFile = Join-Path $backupDir "sancocholab-backup-$stamp.sql"
} elseif (-not [System.IO.Path]::IsPathRooted($OutputFile)) {
  $OutputFile = Join-Path $repoRoot $OutputFile
}

Write-Step "Validando Docker y contenedor db"
Invoke-Cmd "docker compose ps"

Write-Step "Generando dump SQL en: $OutputFile"
Write-Host "   docker compose exec -T db pg_dump -U sancocholab -d sancocholab > `"$OutputFile`"" -ForegroundColor DarkGray
& cmd /c "docker compose exec -T db pg_dump -U sancocholab -d sancocholab > ""$OutputFile"""
if ($LASTEXITCODE -ne 0) {
  throw "No se pudo generar el backup SQL."
}

Write-Step "Backup completado"
Write-Host "Archivo generado: $OutputFile" -ForegroundColor Green
