param(
  [switch]$WithVolumes,
  [switch]$RemoveOrphans
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$cmd = "docker compose down"
if ($WithVolumes) { $cmd += " -v" }
if ($RemoveOrphans) { $cmd += " --remove-orphans" }

Write-Host "`n==> Apagando servicios..." -ForegroundColor Cyan
Write-Host "   $cmd" -ForegroundColor DarkGray
& powershell -NoProfile -Command $cmd
if ($LASTEXITCODE -ne 0) { throw "No se pudo apagar el stack" }

Write-Host "`nStack detenido." -ForegroundColor Green
