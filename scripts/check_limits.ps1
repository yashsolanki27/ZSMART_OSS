# Check model usage limits for ZSMART OSS
$logPath = "K:\GRAXCE\ZSMART_OSS\.model_usage_log.json"
$statePath = "K:\GRAXCE\ZSMART_OSS\.project_state.json"

Write-Host ""
Write-Host "===== ZSMART OSS - Model Usage Report =====" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $logPath) {
    $log = Get-Content $logPath -Encoding UTF8 | ConvertFrom-Json
    Write-Host "Date: $($log.today)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Model Usage Today:" -ForegroundColor Green
    
    $modelList = @(
        @{Key="gpt4omini"; Name="GPT-4o-mini (GitHub Models)"; Limit=150; Color="Magenta"},
        @{Key="gemini"; Name="Gemini 2.5 Flash (Google)"; Limit=1500; Color="Blue"},
        @{Key="groq"; Name="Groq (Llama 3.3)"; Limit=1000; Color="DarkYellow"},
        @{Key="openrouter"; Name="OpenRouter (free)"; Limit=50; Color="Red"}
    )
    
    foreach ($m in $modelList) {
        $used = $log.$($m.Key).used
        $limit = $m.Limit
        $remaining = $limit - $used
        $pct = [math]::Round(($used / $limit) * 100, 1)
        
        if ($remaining -le 0) { $status = "EXHAUSTED"; $scolor = "Red" }
        elseif ($remaining -le 10) { $status = "CRITICAL"; $scolor = "DarkRed" }
        elseif ($remaining -le 50) { $status = "LOW"; $scolor = "DarkYellow" }
        else { $status = "OK"; $scolor = "Green" }
        
        Write-Host ("  " + $m.Name + ": ") -NoNewline -ForegroundColor $m.Color
        Write-Host ("$used/$limit used ($pct%)") -NoNewline
        Write-Host (" [$status]") -ForegroundColor $scolor
        Write-Host ("  Remaining: $remaining calls")
        Write-Host ""
    }
} else {
    Write-Host "No usage log found." -ForegroundColor Yellow
}

if (Test-Path $statePath) {
    $state = Get-Content $statePath -Encoding UTF8 | ConvertFrom-Json
    Write-Host "Next Steps:" -ForegroundColor Green
    Write-Host ""
    
    $steps = $state.status.phase2_backend.steps
    $steps.PSObject.Properties | ForEach-Object {
        $stepName = $_.Name
        $detail = $_.Value
        if ($detail.status -eq "PENDING") {
            Write-Host ("  [PENDING] " + $stepName) -ForegroundColor DarkYellow
        } else {
            Write-Host ("  [DONE] " + $stepName) -ForegroundColor DarkGreen
        }
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
