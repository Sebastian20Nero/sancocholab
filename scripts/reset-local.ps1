param(
  [switch]$HardReset,
  [switch]$WithPgAdmin
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "`n==> Reiniciando stack local..." -ForegroundColor Cyan

if ($HardReset) {
  Write-Host "   docker compose down -v --remove-orphans" -ForegroundColor DarkGray
  & powershell -NoProfile -Command "docker compose down -v --remove-orphans"
} else {
  Write-Host "   docker compose down --remove-orphans" -ForegroundColor DarkGray
  & powershell -NoProfile -Command "docker compose down --remove-orphans"
}

if ($LASTEXITCODE -ne 0) { throw "Fallo en docker compose down" }

if ($WithPgAdmin) {
  Write-Host "   docker compose --profile tools up --build -d" -ForegroundColor DarkGray
  & powershell -NoProfile -Command "docker compose --profile tools up --build -d"
} else {
  Write-Host "   docker compose up --build -d" -ForegroundColor DarkGray
  & powershell -NoProfile -Command "docker compose up --build -d"
}

if ($LASTEXITCODE -ne 0) { throw "Fallo en docker compose up" }

Write-Host "`nReset completado." -ForegroundColor Green
