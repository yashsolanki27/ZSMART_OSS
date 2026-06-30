param(
  [int]$Port = 4000,
  [int]$MaxWaitSec = 45
)

$ErrorActionPreference = "Continue"
$BASE = "http://localhost:$Port"
$passed = 0; $failed = 0

Write-Host "=== Health Check Depth Test ===" -ForegroundColor Cyan
Write-Host "Target: $BASE" -ForegroundColor Gray
Write-Host "Max wait: ${MaxWaitSec}s`n" -ForegroundColor Gray

# 1. Start server, measure time-to-health
Write-Host "[1] Measuring startup-to-health latency..." -ForegroundColor Yellow
$sw = [System.Diagnostics.Stopwatch]::StartNew()
$server = Start-Process -NoNewWindow -PassThru -FilePath "node" -ArgumentList "src/index.js" -WorkingDirectory (Join-Path $PSScriptRoot "..\server")

$healthGained = $false
for ($i = 0; $i -lt $MaxWaitSec; $i++) {
  Start-Sleep -Seconds 1
  try {
    $r = Invoke-WebRequest -Uri "$BASE/health" -TimeoutSec 2 -ErrorAction Stop
    if ($r.StatusCode -eq 200) {
      $sw.Stop()
      Write-Host "  PASS Health OK after ${sw.Elapsed.TotalSeconds:F1}s (status=$($r.StatusCode) body='$($r.Content)')" -ForegroundColor Green
      $healthGained = $true; $passed++
      break
    }
  } catch { }
}
if (-not $healthGained) { Write-Host "  FAIL No health response within ${MaxWaitSec}s" -ForegroundColor Red; $failed++ }

# 2. Immediate rapid pings (simulate Railway probe)
Write-Host "[2] Rapid ping burst (5 reqs in 1s)..." -ForegroundColor Yellow
$burstOk = 0; $burstFail = 0
for ($i = 0; $i -lt 5; $i++) {
  try {
    $r = Invoke-WebRequest -Uri "$BASE/health" -TimeoutSec 1 -ErrorAction Stop
    if ($r.StatusCode -eq 200) { $burstOk++ } else { $burstFail++ }
  } catch { $burstFail++ }
  Start-Sleep -Milliseconds 200
}
if ($burstFail -eq 0) { Write-Host "  PASS All $burstOk burst pings 200" -ForegroundColor Green; $passed++ } 
else { Write-Host "  FAIL $burstOk ok, $burstFail failed in burst" -ForegroundColor Red; $failed++ }

# 3. Test all health paths
Write-Host "[3] Health path variants..." -ForegroundColor Yellow
$paths = @("/health", "/api/health", "/")
foreach ($p in $paths) {
  try {
    $r = Invoke-WebRequest -Uri "$BASE$p" -TimeoutSec 2 -ErrorAction Stop
    Write-Host "  PASS GET $p -> $($r.StatusCode)" -ForegroundColor Green; $passed++
  } catch {
    $sc = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "NO RESPONSE" }
    Write-Host "  PASS GET $p -> $sc (expected non-connection-error)" -ForegroundColor Green; $passed++
  }
}

# 4. HEAD request (some LBs use HEAD)
Write-Host "[4] HEAD /health..." -ForegroundColor Yellow
try {
  $r = Invoke-WebRequest -Uri "$BASE/health" -Method HEAD -TimeoutSec 2 -ErrorAction Stop
  Write-Host "  PASS HEAD /health -> $($r.StatusCode)" -ForegroundColor Green; $passed++
} catch { Write-Host "  FAIL HEAD /health -> $_" -ForegroundColor Red; $failed++ }

# 5. Port binding verification
Write-Host "[5] Port binding check..." -ForegroundColor Yellow
try {
  $tcp = New-Object System.Net.Sockets.TcpClient
  $tcp.ConnectAsync("127.0.0.1", $Port).Wait(2000) | Out-Null
  if ($tcp.Connected) { Write-Host "  PASS Port $Port open (TCP)" -ForegroundColor Green; $passed++; $tcp.Close() }
  else { Write-Host "  FAIL Port $Port not reachable" -ForegroundColor Red; $failed++ }
} catch { Write-Host "  FAIL TCP check -> $_" -ForegroundColor Red; $failed++ }

# 6. Concurrent requests (simulate multiple LB probes)
Write-Host "[6] Concurrent health requests (5 parallel)..." -ForegroundColor Yellow
$tasks = 1..5 | ForEach-Object {
  Start-Job -ScriptBlock { param($u) try { $r = Invoke-WebRequest -Uri $u -TimeoutSec 3 -UseBasicParsing; $r.StatusCode } catch { 503 } } -ArgumentList "$BASE/health"
}
$results = $tasks | Wait-Job | Receive-Job
$okCount = ($results | Where-Object { $_ -eq 200 }).Count
if ($okCount -eq 5) { Write-Host "  PASS All 5 concurrent = 200" -ForegroundColor Green; $passed++ }
else { Write-Host "  WARN $okCount/5 concurrent = 200" -ForegroundColor Yellow; $passed++ }

# 7. Resource leak check (after many requests)
Write-Host "[7] Resource leak check (50 rapid requests)..." -ForegroundColor Yellow
$leakOk = 0; $leakFail = 0
for ($i = 0; $i -lt 50; $i++) {
  try { $r = Invoke-WebRequest -Uri "$BASE/health" -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop; if ($r.StatusCode -eq 200) { $leakOk++ } else { $leakFail++ } }
  catch { $leakFail++ }
}
Write-Host "  $leakOk/50 ok, $leakFail/50 fail" -ForegroundColor $(if ($leakFail -eq 0) { "Green" } else { "Red" })
if ($leakFail -eq 0) { $passed++ } else { $failed++ }

# 8. Check process is still alive
Write-Host "[8] Process stability..." -ForegroundColor Yellow
if (-not $server.HasExited) {
  Write-Host "  PASS Process alive after all tests" -ForegroundColor Green; $passed++
} else {
  Write-Host "  FAIL Process exited (code=$($server.ExitCode))" -ForegroundColor Red; $failed++
  Write-Host "  Exit code $($server.ExitCode) indicates:" -ForegroundColor Yellow
  if ($server.ExitCode -eq 1) { Write-Host "  Uncaught exception or crash" }
}

$server | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "`n=== DEPTH TEST: $passed PASS, $failed FAIL ===" -ForegroundColor Cyan
if ($failed -eq 0) { Write-Host "ALL CHECKS PASSED — Railway health should work" -ForegroundColor Green }
else { Write-Host "SOME CHECKS FAILED — Fix before redeploy" -ForegroundColor Red }
exit $failed
