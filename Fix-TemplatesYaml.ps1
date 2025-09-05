# Fix-TemplatesYaml.ps1
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$path = Join-Path $PWD 'templates.yaml'
if (-not (Test-Path $path)) {
  throw "File not found: $path"
}

$backupDir = Join-Path $PWD ('backup\{0:yyyyMMdd-HHmmss}' -f (Get-Date))
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
Copy-Item $path (Join-Path $backupDir 'templates.yaml') -Force

# Read whole file and split into lines (operator form of -split needs parens)
$raw   = Get-Content -Path $path -Raw -Encoding UTF8
$lines = ($raw) -split "`r?`n"

# 1) Remove a leading "template:" if present at the very top
if ($lines.Count -gt 0 -and $lines[0] -match '^\s*template:\s*$') {
  $lines = $lines[1..($lines.Count-1)]
}

# 2) Drop helper comment lines we previously injected
$lines = $lines | Where-Object {
  $_ -notmatch '^\s*#\s*\(Existing content below\)' -and
  $_ -notmatch '^\s*#\s*/config/templates\.yaml'    -and
  $_ -notmatch '^\s*#\s*=+'
}

# 3) Ensure top-level list items begin at column 1 (e.g., "- sensor:")
$fixed = foreach ($ln in $lines) {
  if ($ln -match '^\s{2,}-\s') {
    $ln = $ln -replace '^\s{2,}(-\s)','$1'
  }
  $ln
}

# 4) Normalize newlines, ensure a single trailing newline, and save
$fixedText = ($fixed -join "`n").TrimEnd() + "`n"
Set-Content -Path $path -Value $fixedText -Encoding UTF8 -NoNewline

Write-Host "templates.yaml fixed and backed up to $backupDir" -ForegroundColor Green
