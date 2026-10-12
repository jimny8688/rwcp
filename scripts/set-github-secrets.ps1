# Requires: gh auth login
# Reads web/.env and sets GitHub Actions secrets for Pages build

$ErrorActionPreference = "Stop"
$gh = "C:\Program Files\GitHub CLI\gh.exe"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$envFile = Join-Path $Root "web\.env"

if (-not (Test-Path $envFile)) {
  Write-Host "Missing web/.env - run npm run supabase:setup first" -ForegroundColor Red
  exit 1
}

& $gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: gh auth login -h github.com -p https -w" -ForegroundColor Red
  exit 1
}

$lines = Get-Content $envFile
$url = ($lines | Where-Object { $_ -match "^VITE_SUPABASE_URL=" }) -replace "^VITE_SUPABASE_URL=", ""
$anon = ($lines | Where-Object { $_ -match "^VITE_SUPABASE_ANON_KEY=" }) -replace "^VITE_SUPABASE_ANON_KEY=", ""

if (-not $url -or -not $anon) {
  Write-Host "web/.env missing URL or anon key" -ForegroundColor Red
  exit 1
}

Set-Location $Root
& $gh secret set VITE_SUPABASE_URL --body $url
& $gh secret set VITE_SUPABASE_ANON_KEY --body $anon
Write-Host "Secrets set for jimny8688/rwcp (current repo)." -ForegroundColor Green
Write-Host "Enable Pages: Settings -> Pages -> Source: GitHub Actions"
Write-Host "Then: gh workflow run deploy-pages.yml  OR push to main"
