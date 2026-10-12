$ErrorActionPreference = "Stop"
$ProjectRef = "nuplgtibgkvjvrsfmnza"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Host "Missing SUPABASE_ACCESS_TOKEN. Create at https://supabase.com/dashboard/account/tokens" -ForegroundColor Red
  exit 1
}

$adminPwd = if ($env:ADMIN_PASSWORD) { $env:ADMIN_PASSWORD } else { "citysoul-admin" }
if (-not $env:ADMIN_JWT_SECRET) {
  $bytes = New-Object byte[] 32
  [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
  $env:ADMIN_JWT_SECRET = [Convert]::ToBase64String($bytes)
  Write-Host "Generated ADMIN_JWT_SECRET: $($env:ADMIN_JWT_SECRET)"
}

Write-Host "Setting secrets..." -ForegroundColor Cyan
npx supabase secrets set "ADMIN_PASSWORD=$adminPwd" --project-ref $ProjectRef
npx supabase secrets set "ADMIN_JWT_SECRET=$env:ADMIN_JWT_SECRET" --project-ref $ProjectRef

Write-Host "Deploying quiz-api..." -ForegroundColor Cyan
npx supabase functions deploy quiz-api --project-ref $ProjectRef --no-verify-jwt

Write-Host "Fetching anon key..." -ForegroundColor Cyan
$keysJson = npx supabase projects api-keys --project-ref $ProjectRef --reveal -o json 2>&1 | Out-String
$anon = $null
try {
  $keys = $keysJson | ConvertFrom-Json
  $anon = ($keys | Where-Object { $_.name -match "anon" }).api_key
  if (-not $anon) { $anon = ($keys | Select-Object -First 1).api_key }
} catch {
  Write-Host "Could not parse anon key; copy from Dashboard API settings."
}

$envFile = Join-Path $Root "web\.env"
$url = "https://${ProjectRef}.supabase.co"
$content = "VITE_SUPABASE_URL=$url`nVITE_SUPABASE_ANON_KEY=$anon`n"
Set-Content -Path $envFile -Value $content -Encoding utf8
Write-Host ("Wrote " + $envFile) -ForegroundColor Green

Write-Host "Testing health..." -ForegroundColor Cyan
$body = '{"action":"health"}'
if ($anon) {
  $resp = Invoke-RestMethod -Uri "$url/functions/v1/quiz-api" -Method POST -Headers @{
    Authorization = "Bearer $anon"
    apikey        = $anon
    "Content-Type" = "application/json"
  } -Body $body
  $resp | ConvertTo-Json
} else {
  Write-Host "Skipped health test (no anon key)."
}

Write-Host ""
Write-Host ("ADMIN_PASSWORD = " + $adminPwd) -ForegroundColor Yellow
Write-Host ("VITE_SUPABASE_URL = " + $url) -ForegroundColor Yellow
