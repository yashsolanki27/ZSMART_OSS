param(
  [string]$Url = "https://zsmart-oss-api.up.railway.app"
)

$ErrorActionPreference = "Stop"
Write-Host "=== Pre-Deploy Network Health Validator ===" -ForegroundColor Cyan
Write-Host "Target: $Url`n" -ForegroundColor Gray

$tests = @(
  @{ Name = "Health endpoint (/health)"; Path = "/health" },
  @{ Name = "API health (/api/health)"; Path = "/api/health" },
  @{ Name = "Root (/)"; Path = "/" }
)

$allPassed = $true

foreach ($test in $tests) {
  $uri = "$Url$($test.Path)"
  try {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $res = Invoke-WebRequest -Uri $uri -TimeoutSec 10 -ErrorAction Stop
    $sw.Stop()
    $body = $res.Content | ConvertFrom-Json -ErrorAction SilentlyContinue
    $status = if ($res.StatusCode -eq 200) { "PASS" } else { "FAIL" }
    if ($status -eq "FAIL") { $allPassed = $false }
    Write-Host "$status`t$($test.Name)" -NoNewline
    Write-Host "`t${sw.ElapsedMilliseconds}ms`t$($res.StatusCode)" -ForegroundColor Gray
    if ($body -and $body.status) {
      Write-Host "      status=$($body.status)" -ForegroundColor DarkGray
    }
  } catch {
    $allPassed = $false
    Write-Host "FAIL`t$($test.Name)`tERROR: $_" -ForegroundColor Red
  }
}

Write-Host ""
if ($allPassed) {
  Write-Host "=== ALL CHECKS PASSED ===" -ForegroundColor Green
} else {
  Write-Host "=== SOME CHECKS FAILED ===" -ForegroundColor Red
}

if (-not $allPassed) {
  Write-Host ""
  Write-Host "Troubleshooting:" -ForegroundColor Yellow
  Write-Host "  1. Is the Railway service running? Check dashboard"
  Write-Host "  2. Check logs: railway logs"
  Write-Host "  3. Verify PORT env var matches EXPOSE in Dockerfile"
  Write-Host "  4. Run locally: docker compose up && curl http://localhost:4000/health"
}
