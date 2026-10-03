param(
  [switch]$Open
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

if (-not (Test-Path -LiteralPath ".vercel\project.json")) {
  Write-Host ""
  Write-Host "Project is not linked to Vercel yet. Running first-time setup..." -ForegroundColor Yellow
  Write-Host "A browser will open so you can log in / pick the project." -ForegroundColor Yellow
  Write-Host ""
  vercel link
  if ($LASTEXITCODE -ne 0) { Write-Host "vercel link failed." -ForegroundColor Red; exit 1 }
}

Write-Host ""
Write-Host "Deploying to production..." -ForegroundColor Cyan
Write-Host ""

$output = vercel --prod --yes 2>&1 | Tee-Object -Variable deployLog
$exit = $LASTEXITCODE

Write-Host ""
if ($exit -ne 0) {
  Write-Host "DEPLOY FAILED. See the log above." -ForegroundColor Red
  exit $exit
}

$urlLine = $deployLog | Where-Object { $_ -match "https://[^\s]+\.vercel\.app" } | Select-Object -Last 1
$prodUrl = if ($urlLine) { ([regex]::Match(($urlLine -join " "), "https://[^\s]+\.vercel\.app")).Value } else { $null }

if ($prodUrl) {
  Set-Content -LiteralPath "PRODUCTION_URL.txt" -Value $prodUrl -Encoding ascii
  Write-Host "==================================================" -ForegroundColor Green
  Write-Host "  DEPLOYED SUCCESSFULLY" -ForegroundColor Green
  Write-Host "  Live URL: $prodUrl" -ForegroundColor White
  Write-Host "==================================================" -ForegroundColor Green
  if ($Open) { Start-Process $prodUrl }
} else {
  Write-Host "Deployed. (Production URL was not detected in output - check the log above.)" -ForegroundColor Green
}