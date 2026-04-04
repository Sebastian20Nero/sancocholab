param(
  [switch]$RestartStack,
  [switch]$WithPgAdmin,
  [int]$TimeoutSeconds = 120
)

$ErrorActionPreference = "Continue"
Set-StrictMode -Version Latest

function Test-DockerEngine {
  docker info > $null 2>$null
  return ($LASTEXITCODE -eq 0)
}

function Wait-Docker([int]$Timeout) {
  $start = Get-Date
  while (((Get-Date) - $start).TotalSeconds -lt $Timeout) {
    if (Test-DockerEngine) { return $true }
    Start-Sleep -Seconds 4
  }
  return $false
}

function Start-DockerDesktop {
  $path = "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  if (-not (Test-Path $path)) { throw "No se encontro Docker Desktop.exe" }
  Start-Process $path | Out-Null
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Write-Host "`n==> Verificando Docker..." -ForegroundColor Cyan
if (-not (Test-DockerEngine)) {
  Write-Host "Docker no responde. Abriendo Docker Desktop..." -ForegroundColor Yellow
  Start-DockerDesktop
  if (-not (Wait-Docker -Timeout $TimeoutSeconds)) {
    Write-Host "Reiniciando WSL..." -ForegroundColor Yellow
    wsl --shutdown
    Start-Sleep -Seconds 2
    Start-DockerDesktop
    if (-not (Wait-Docker -Timeout $TimeoutSeconds)) {
      throw "Docker Engine no inicio."
    }
  }
}

Write-Host "Docker listo." -ForegroundColor Green

if ($RestartStack) {
  Write-Host "`n==> Reiniciando stack..." -ForegroundColor Cyan
  if ($WithPgAdmin) {
    docker compose --profile tools up --build -d
  } else {
    docker compose up --build -d
  }
  docker compose ps
}
