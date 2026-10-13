# Apply GRANT fix on remote Supabase (requires login)
# Usage: $env:SUPABASE_ACCESS_TOKEN="sbp_..."; .\scripts\apply-supabase-grants.ps1

$ErrorActionPreference = "Stop"
$ProjectRef = "nuplgtibgkvjvrsfmnza"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$sqlFile = Join-Path $Root "supabase\migrations\20260330130000_grants.sql"

if (-not $env:SUPABASE_ACCESS_TOKEN) {
  Write-Host "Set SUPABASE_ACCESS_TOKEN first (supabase.com/dashboard/account/tokens)" -ForegroundColor Red
  exit 1
}

Push-Location $Root
try {
  npx supabase db push --project-ref $ProjectRef
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  Write-Host "Migrations applied. Redeploy quiz-api if needed: npx supabase functions deploy quiz-api --project-ref $ProjectRef" -ForegroundColor Green
} finally {
  Pop-Location
}
