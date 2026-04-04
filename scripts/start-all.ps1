param(
  [switch]$WithPgAdmin,
  [switch]$SeedOnce,
  [switch]$ReinstallFrontendDeps
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$repoRoot = Split-Path -Parent $PSScriptRoot
$frontendPath = Join-Path $repoRoot "frontend"

Write-Host "`n==> Levantando backend + db..." -ForegroundColor Cyan
$backendScript = Join-Path $repoRoot "scripts\start-backend.ps1"
$backendArgs = @("-ExecutionPolicy", "Bypass", "-File", $backendScript)
if ($WithPgAdmin) { $backendArgs += "-WithPgAdmin" }
if ($SeedOnce) { $backendArgs += "-SeedOnce" }
& powershell @backendArgs
if ($LASTEXITCODE -ne 0) { throw "No se pudo levantar backend/db" }

if ($ReinstallFrontendDeps -or -not (Test-Path (Join-Path $frontendPath "node_modules"))) {
  Write-Host "`n==> Instalando dependencias frontend..." -ForegroundColor Cyan
  & powershell -NoProfile -Command "Set-Location -LiteralPath '$frontendPath'; npm install"
  if ($LASTEXITCODE -ne 0) { throw "Fallo npm install en frontend" }
}

Write-Host "`n==> Abriendo frontend en nueva terminal..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList @(
  "-NoExit",
  "-Command",
  "Set-Location -LiteralPath '$frontendPath'; npm run start"
)

Write-Host "`nListo: Frontend en http://127.0.0.1:4200" -ForegroundColor Green
