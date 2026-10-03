param(
  [string]$ProjectUrl = "https://the-celebration-132.vercel.app/"
)

$ErrorActionPreference = "Stop"
Set-Location -LiteralPath $PSScriptRoot

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  Vercel One-Time Setup" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

$loggedIn = $false
try {
  $who = vercel whoami 2>$null
  if ($LASTEXITCODE -eq 0 -and $who) { $loggedIn = $true }
} catch { }

if (-not $loggedIn) {
  Write-Host "Step 1/3 - Logging in to Vercel (a browser will open)..." -ForegroundColor Yellow
  Write-Host ""
  vercel login
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Login failed. Try one of these instead:" -ForegroundColor Red
    Write-Host "  vercel login --github" -ForegroundColor White
    Write-Host "  vercel login --gitlab" -ForegroundColor White
    Write-Host "  vercel login youremail@gmail.com" -ForegroundColor White
    exit 1
  }
  Write-Host ""
  Write-Host "Login OK." -ForegroundColor Green
} else {
  Write-Host "Step 1/3 - Already logged in." -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2/3 - Linking this folder to your project..." -ForegroundColor Yellow
Write-Host "  (If a list appears, choose the existing 'the-celebration-132' project." -ForegroundColor DarkGray
Write-Host "   If asked 'Create a new project?', say Yes - it will reuse the same name.)" -ForegroundColor DarkGray
Write-Host ""
vercel link
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "Link failed. Alternative one-liner:" -ForegroundColor Red
  Write-Host "  vercel link $ProjectUrl" -ForegroundColor White
  exit 1
}

Write-Host ""
Write-Host "Step 3/3 - First production deploy..." -ForegroundColor Cyan
Write-Host ""
vercel --prod --yes

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "  SETUP COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "  From now on, after every code change run:" -ForegroundColor White
Write-Host "    .\deploy.ps1" -ForegroundColor White
Write-Host ""
Write-Host "  Your live URL never changes - only its content updates." -ForegroundColor DarkGray
Write-Host "==============================================" -ForegroundColor Green