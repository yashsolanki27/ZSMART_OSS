param(
  [Parameter(Mandatory = $true)]
  [string]$DatabaseUrl
)

$ErrorActionPreference = "Stop"
$serverDir = Join-Path $PSScriptRoot "..\server"

Write-Host "Deploying DB schema + seed to remote Postgres..." -ForegroundColor Cyan

# 1. Push schema to remote DB
Push-Location $serverDir
try {
  $env:DATABASE_URL = $DatabaseUrl
  npx prisma migrate deploy
  if ($LASTEXITCODE -ne 0) { throw "Migration failed" }

  node prisma/seed.js
  if ($LASTEXITCODE -ne 0) { throw "Seed failed" }

  Write-Host "`n✅ Done. DB deployed at:" -ForegroundColor Green
  Write-Host "   $DatabaseUrl" -ForegroundColor Gray
} finally {
  Pop-Location
}
