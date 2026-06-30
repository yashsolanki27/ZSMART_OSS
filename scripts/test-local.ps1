$ErrorActionPreference = "Stop"
$pass = 0; $fail = 0
$BASE = "http://localhost:4000"

Write-Host "=== ZSMART OSS Local Integration Test ===" -ForegroundColor Cyan

# 1. Health check
try {
  $r = Invoke-RestMethod -Uri "$BASE/health" -ErrorAction Stop
  Write-Host "PASS GET /health -> 200" -ForegroundColor Green
  $pass++
} catch { Write-Host "FAIL GET /health -> $_" -ForegroundColor Red; $fail++ }

# 2. Auth login
try {
  $login = Invoke-RestMethod -Uri "$BASE/api/auth/login" -Method POST -ContentType "application/json" -Body '{"username":"admin","password":"password"}' -ErrorAction Stop
  Write-Host "PASS POST /api/auth/login -> 200" -ForegroundColor Green
  $pass++
  $h = @{Authorization = "Bearer $($login.token)"}
} catch { Write-Host "FAIL POST /api/auth/login -> $_" -ForegroundColor Red; $fail++ }

if ($h) {
  # 3. List endpoints
  $endpoints = @(
    "/api/users", "/api/roles", "/api/workgroups",
    "/api/orders", "/api/exceptions", "/api/tasks", "/api/services",
    "/api/assurances", "/api/slas", "/api/tickets",
    "/api/mac-records", "/api/migrations",
    "/api/resource-orders", "/api/resource-tasks",
    "/api/wfm-tasks", "/api/teams",
    "/api/bsnl-requests", "/api/mpls-batches", "/api/dockets",
    "/api/alarms", "/api/incidents", "/api/audit-logs"
  )
  foreach ($ep in $endpoints) {
    try {
      $r = Invoke-RestMethod -Uri "$BASE$ep" -Headers $h -ErrorAction Stop
      $label = $ep.PadRight(30)
      Write-Host "PASS GET $label 200 (items=$($r.total))" -ForegroundColor Green
      $pass++
    } catch {
      Write-Host "FAIL GET $ep -> $_" -ForegroundColor Red
      $fail++
    }
  }

  # 4. Create a user
  try {
    $newUser = @{username="testuser"; fullName="Test User"; email="test@test.com"; password="test123"; role="VIEWER"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE/api/users" -Method POST -Headers $h -ContentType "application/json" -Body $newUser -ErrorAction Stop
    Write-Host "PASS POST /api/users -> 201" -ForegroundColor Green
    $pass++
    $userId = $r.id

    # 5. Get single user
    $r = Invoke-RestMethod -Uri "$BASE/api/users/$userId" -Headers $h -ErrorAction Stop
    Write-Host "PASS GET /api/users/$userId -> 200" -ForegroundColor Green
    $pass++

    # 6. Update user
    $update = @{fullName="Updated User"} | ConvertTo-Json
    $r = Invoke-RestMethod -Uri "$BASE/api/users/$userId" -Method PUT -Headers $h -ContentType "application/json" -Body $update -ErrorAction Stop
    Write-Host "PASS PUT /api/users/$userId -> 200" -ForegroundColor Green
    $pass++

    # 7. Delete user
    Invoke-RestMethod -Uri "$BASE/api/users/$userId" -Method DELETE -Headers $h -ErrorAction Stop
    Write-Host "PASS DELETE /api/users/$userId -> 204" -ForegroundColor Green
    $pass++

  } catch { Write-Host "FAIL User CRUD -> $_" -ForegroundColor Red; $fail++ }

  # 8. Auth profile
  try {
    $r = Invoke-RestMethod -Uri "$BASE/api/auth/profile" -Headers $h -ErrorAction Stop
    Write-Host "PASS GET /api/auth/profile -> 200" -ForegroundColor Green
    $pass++
  } catch { Write-Host "FAIL GET /api/auth/profile -> $_" -ForegroundColor Red; $fail++ }

  # 9. 404 test
  try {
    Invoke-RestMethod -Uri "$BASE/api/nonexistent" -Headers $h -ErrorAction Stop
    Write-Host "FAIL GET /api/nonexistent -> expected 404" -ForegroundColor Red
    $fail++
  } catch { if ($_.Exception.Response.StatusCode -eq 404) { Write-Host "PASS GET /api/nonexistent -> 404" -ForegroundColor Green; $pass++ } else { Write-Host "FAIL GET /api/nonexistent -> $_" -ForegroundColor Red; $fail++ } }

  # 10. Unauthorized test
  try {
    Invoke-RestMethod -Uri "$BASE/api/users" -ErrorAction Stop
    Write-Host "FAIL GET /api/users (no auth) -> expected 401" -ForegroundColor Red
    $fail++
  } catch { if ($_.Exception.Response.StatusCode -eq 401) { Write-Host "PASS GET /api/users (no auth) -> 401" -ForegroundColor Green; $pass++ } else { Write-Host "FAIL GET /api/users (no auth) -> $_" -ForegroundColor Red; $fail++ } }

  # 11. Validation — create user missing required field
  try {
    $badUser = @{username="baduser"} | ConvertTo-Json
    Invoke-RestMethod -Uri "$BASE/api/users" -Method POST -Headers $h -ContentType "application/json" -Body $badUser -ErrorAction Stop
    Write-Host "FAIL POST /api/users (missing fields) -> expected 400/500" -ForegroundColor Red
    $fail++
  } catch { $sc = $_.Exception.Response.StatusCode; if ($sc -ge 400) { Write-Host "PASS POST /api/users (missing fields) -> $sc" -ForegroundColor Green; $pass++ } else { Write-Host "FAIL POST /api/users (missing fields) -> $_" -ForegroundColor Red; $fail++ } }

  # 12. Validation — invalid token
  try {
    $badH = @{Authorization = "Bearer invalidtoken"}
    Invoke-RestMethod -Uri "$BASE/api/users" -Headers $badH -ErrorAction Stop
    Write-Host "FAIL GET /api/users (bad token) -> expected 401" -ForegroundColor Red
    $fail++
  } catch { if ($_.Exception.Response.StatusCode -eq 401) { Write-Host "PASS GET /api/users (bad token) -> 401" -ForegroundColor Green; $pass++ } else { Write-Host "FAIL GET /api/users (bad token) -> $_" -ForegroundColor Red; $fail++ } }
}

Write-Host "`n=== RESULTS: $pass PASS, $fail FAIL ===" -ForegroundColor Cyan
if ($fail -eq 0) { Write-Host "ALL TESTS PASSED" -ForegroundColor Green } else { Write-Host "SOME TESTS FAILED" -ForegroundColor Red }
exit $fail
