param(
  [switch]$RemoveOrphans,
  [switch]$WithVolumes
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

# Este script apaga el stack docker de forma simple para evitar
# que los desarrolladores recuerden variantes de docker compose.
# Uso normal: apaga contenedores sin borrar datos.
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Step "Apagando stack Docker"

$cmd = "docker compose down"
if ($WithVolumes) {
  # IMPORTANTE: -v borra volumenes, incluyendo data local de PostgreSQL.
  # Usar solo cuando el equipo quiere reiniciar BD desde cero.
  $cmd += " -v"
}
if ($RemoveOrphans) {
  # Limpia contenedores antiguos que ya no existen en compose.
  $cmd += " --remove-orphans"
}

Invoke-Cmd $cmd

Write-Step "Estado final"
Invoke-Cmd "docker compose ps"

if ($WithVolumes) {
  Write-Host "Stack apagado y volumenes eliminados (BD local reiniciada)." -ForegroundColor Yellow
} else {
  Write-Host "Stack apagado. Los datos de PostgreSQL siguen guardados." -ForegroundColor Green
}
