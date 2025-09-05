<#
Fix-HAConfig.ps1
- Run from the root of your Home Assistant config repo.
- Requires PowerShell 7+ recommended, but works on Windows PowerShell too.

What it does (idempotent):
  1) Ensure secrets.yaml contains: home_timezone: "America/Chicago"
  2) Remove 'server_host' from the 'http:' block in configuration.yaml
  3) Ensure a light group 'Permanent Outdoor Lights' => entity_id: light.permanent_outdoor_lights in light.yaml
  4) Append WUnderground wrapper template sensors with correct units to templates.yaml
  5) Convert all 'color_temp: <num>' lines in YAML to 'color_temp_kelvin: <calc>'
  6) De-duplicate lovelace-mushroom 'mushroom.js' resource lines in YAML (comment duplicates)
  7) Make backups of changed files in backup\<timestamp>\ (relative paths preserved)
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

# --- Repo root & backup folder
$RepoRoot = Get-Location
$Stamp = (Get-Date).ToString('yyyyMMdd-HHmmss')
$BackupRoot = Join-Path $RepoRoot "backup\$Stamp"
New-Item -ItemType Directory -Force -Path $BackupRoot | Out-Null

function Get-RelPath([string]$FullPath) {
  return (Resolve-Path -LiteralPath $FullPath).Path.Substring((Resolve-Path -LiteralPath $RepoRoot).Path.Length).TrimStart('\','/')
}
function Backup-File([string]$Path) {
  if (-not (Test-Path -LiteralPath $Path)) { return }
  $rel = Get-RelPath $Path
  $dest = Join-Path $BackupRoot $rel
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null
  Copy-Item -LiteralPath $Path -Destination $dest -Force
}

function Write-File([string]$Path, [string]$Content) {
  Backup-File $Path
  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Path) | Out-Null
  Set-Content -LiteralPath $Path -Value $Content -Encoding UTF8
}

function Replace-InFile([string]$Path, [ScriptBlock]$Transform) {
  if (-not (Test-Path -LiteralPath $Path)) { return $false }
  $text = Get-Content -LiteralPath $Path -Raw -ErrorAction Stop
  $new  = & $Transform $text
  if ($null -eq $new) { return $false }
  if ($new -ne $text) {
    Backup-File $Path
    Set-Content -LiteralPath $Path -Value $new -Encoding UTF8
    return $true
  }
  return $false
}

# -----------------------------
# 1) Ensure secrets.yaml has home_timezone
# -----------------------------
$SecretsPath = Join-Path $RepoRoot "secrets.yaml"
if (-not (Test-Path -LiteralPath $SecretsPath)) {
  Write-File $SecretsPath "home_timezone: `"America/Chicago`"`n"
  Write-Host "Created secrets.yaml with home_timezone"
} else {
  $secrets = Get-Content -LiteralPath $SecretsPath -Raw
  if ($secrets -notmatch '(?m)^\s*home_timezone\s*:') {
    Backup-File $SecretsPath
    Add-Content -LiteralPath $SecretsPath -Value "`nhome_timezone: `"America/Chicago`"`n"
    Write-Host "Added home_timezone to secrets.yaml"
  } else {
    Write-Host "secrets.yaml already has home_timezone (no change)"
  }
}

# -----------------------------
# 2) Remove 'server_host' from 'http:' block in configuration.yaml
# -----------------------------
$ConfigPath = Join-Path $RepoRoot "configuration.yaml"
if (Test-Path -LiteralPath $ConfigPath) {
  $changed = Replace-InFile $ConfigPath {
    param($txt)
    $lines = $txt -split "`r?`n"
    $out = New-Object System.Collections.Generic.List[string]
    $inHttp = $false
    foreach ($line in $lines) {
      if ($line -match '^(?<indent>\s*)http\s*:\s*$') {
        $inHttp = $true
        $out.Add($line)
        continue
      }
      if ($inHttp) {
        # if new top-level key starts (no indent) or comment-only/empty handled normally
        if ($line -match '^\S' -and $line -notmatch '^(#|---)') {
          $inHttp = $false
          # fall through to normal handling
        } else {
          # within http: block - drop 'server_host:' line(s)
          if ($line -match '^\s*server_host\s*:') {
            continue
          }
        }
      }
      $out.Add($line)
    }
    ($out -join "`r`n")
  }
  if ($changed) {
    Write-Host "Removed 'server_host' from http: in configuration.yaml"
  } else {
    Write-Host "configuration.yaml: no 'server_host' found under http: (no change)"
  }
} else {
  Write-Warning "configuration.yaml not found; skipped http: cleanup"
}

# -----------------------------
# 3) Ensure light.permanent_outdoor_lights group in light.yaml
# -----------------------------
$LightYaml = Join-Path $RepoRoot "light.yaml"
if (-not (Test-Path -LiteralPath $LightYaml)) {
  # Create file with the group
  $block = @"
# AUTO-FIX: Ensure group for Permanent Outdoor Lights
- platform: group
  name: Permanent Outdoor Lights
  unique_id: permanent_outdoor_lights_group
  entities:
    - light.garage_left
    - light.garage_center
    - light.garage_right
"@
  Write-File $LightYaml $block
  Write-Host "Created light.yaml with 'Permanent Outdoor Lights' group"
} else {
  $lightText = Get-Content -LiteralPath $LightYaml -Raw
  if ($lightText -notmatch '(?ms)^\s*-\s*platform:\s*group.*?\bname:\s*Permanent Outdoor Lights\b') {
    Backup-File $LightYaml
    Add-Content -LiteralPath $LightYaml -Value @"

# AUTO-FIX: Ensure group for Permanent Outdoor Lights
- platform: group
  name: Permanent Outdoor Lights
  unique_id: permanent_outdoor_lights_group
  entities:
    - light.garage_left
    - light.garage_center
    - light.garage_right
"@
    Write-Host "Appended 'Permanent Outdoor Lights' group to light.yaml"
  } else {
    Write-Host "light.yaml already contains 'Permanent Outdoor Lights' group (no change)"
  }
}

# -----------------------------
# 4) Append WUnderground wrapper template sensors to templates.yaml
#    (kneplatt72_* names from your logs)
# -----------------------------
$TemplatesYaml = Join-Path $RepoRoot "templates.yaml"
$SensorsBlock_ListItem = @"
  - sensor:
      - name: "Relative Humidity"
        unique_id: kneplatt72_relative_humidity_fixed
        state: "{{ states('sensor.kneplatt72_relative_humidity') }}"
        unit_of_measurement: "%"
        device_class: humidity

      - name: "Solar Radiation"
        unique_id: kneplatt72_solar_radiation_fixed
        state: "{{ states('sensor.kneplatt72_solar_radiation') }}"
        unit_of_measurement: "W/m²"
        device_class: irradiance

      - name: "Temperature"
        unique_id: kneplatt72_temperature_fixed
        state: "{{ states('sensor.kneplatt72_temperature') }}"
        unit_of_measurement: "°F"
        device_class: temperature

      - name: "Heat Index"
        unique_id: kneplatt72_heat_index_fixed
        state: "{{ states('sensor.kneplatt72_heat_index') }}"
        unit_of_measurement: "°F"
        device_class: temperature

      - name: "Wind Chill"
        unique_id: kneplatt72_wind_chill_fixed
        state: "{{ states('sensor.kneplatt72_wind_chill') }}"
        unit_of_measurement: "°F"
        device_class: temperature

      - name: "Dew Point"
        unique_id: kneplatt72_dewpoint_fixed
        state: "{{ states('sensor.kneplatt72_dewpoint') }}"
        unit_of_measurement: "°F"
        device_class: temperature

      - name: "Wind Speed"
        unique_id: kneplatt72_wind_speed_fixed
        state: "{{ states('sensor.kneplatt72_wind_speed') }}"
        unit_of_measurement: "mph"
        device_class: wind_speed

      - name: "Wind Gust"
        unique_id: kneplatt72_wind_gust_fixed
        state: "{{ states('sensor.kneplatt72_wind_gust') }}"
        unit_of_measurement: "mph"
        device_class: wind_speed
"@

if (-not (Test-Path -LiteralPath $TemplatesYaml)) {
  $fullBlock = @"
template:
$SensorsBlock_ListItem
"@
  Write-File $TemplatesYaml $fullBlock
  Write-Host "Created templates.yaml with WUnderground wrapper sensors"
} else {
  $tmpl = Get-Content -LiteralPath $TemplatesYaml -Raw
  $already = ($tmpl -match 'kneplatt72_(relative_humidity|solar_radiation|temperature|heat_index|wind_chill|dewpoint|wind_speed|wind_gust)_fixed')
  if ($tmpl -match '(?m)^\s*template\s*:') {
    if (-not $already) {
      Backup-File $TemplatesYaml
      Add-Content -LiteralPath $TemplatesYaml -Value "`n# AUTO-FIX: WUnderground wrapper sensors`n$SensorsBlock_ListItem"
      Write-Host "Appended WUnderground wrapper sensors to templates.yaml"
    } else {
      Write-Host "templates.yaml already contains wrapper sensors (no change)"
    }
  } else {
    # File exists but does not have a 'template:' root; prepend a proper root.
    if (-not $already) {
      Backup-File $TemplatesYaml
      $newContent = "template:`n$SensorsBlock_ListItem`n`n# (Existing content below)`n$tmpl"
      Set-Content -LiteralPath $TemplatesYaml -Value $newContent -Encoding UTF8
      Write-Host "Prepended 'template:' root and sensors to templates.yaml"
    } else {
      Write-Host "templates.yaml did not have 'template:' root, but wrapper sensors already present (no change)"
    }
  }
}

# -----------------------------
# 5) Convert color_temp (mireds) -> color_temp_kelvin
# -----------------------------
$YamlFiles = Get-ChildItem -Recurse -File -Include *.yaml, *.yml |
  Where-Object {
    $_.FullName -notmatch '\\\.git\\' -and
    $_.FullName -notmatch '\\\.venv\\' -and
    $_.FullName -notmatch '\\node_modules\\' -and
    $_.FullName -notmatch '\\\.storage\\'
  }

[int]$totalConv = 0
foreach ($f in $YamlFiles) {
  $changed = Replace-InFile $f.FullName {
    param($txt)
    # Only replace numeric literals on their own line to avoid templates.
    [System.Text.RegularExpressions.Regex]::Replace(
      $txt,
      '(?im)^(?<indent>\s*)color_temp:\s*(?<mired>\d+)\s*$',
      {
        param($m)
        $mired = [int]$m.Groups['mired'].Value
        if ($mired -le 0) { return $m.Value } # invalid, skip
        $kelvin = [Math]::Round(1000000.0 / [double]$mired)
        "$($m.Groups['indent'].Value)color_temp_kelvin: $kelvin"
      }
    )
  }
  if ($changed) { $totalConv++ }
}
Write-Host ("Converted color_temp->color_temp_kelvin in {0} file(s)" -f $totalConv)

# -----------------------------
# 6) De-duplicate Mushroom resource lines in YAML (YAML mode only)
#    Keeps the first 'url: /hacsfiles/lovelace-mushroom/mushroom.js' found,
#    comments out any later duplicates with '# AUTO-FIX: duplicate'.
# -----------------------------
$seen = $false
[int]$dedupCount = 0
foreach ($f in $YamlFiles) {
  $txt = Get-Content -LiteralPath $f.FullName -Raw
  # Match 'url:' lines referencing mushroom.js
  $pattern = '(?im)^(?<pre>\s*-\s*url:\s*)(?<url>.+?/lovelace-mushroom/mushroom\.js.*)$'
  if ($txt -match $pattern) {
    $new = [regex]::Replace($txt, $pattern, {
      param($m)
      if (-not $script:seen) {
        $script:seen = $true
        return $m.Value  # keep the first occurrence
      } else {
        $script:dedupCount++
        return "# AUTO-FIX: duplicate resource removed`r`n# " + $m.Value
      }
    })
    if ($new -ne $txt) {
      Backup-File $f.FullName
      Set-Content -LiteralPath $f.FullName -Value $new -Encoding UTF8
    }
  }
}
if ($dedupCount -gt 0) {
  Write-Host "Commented $dedupCount duplicate Mushroom resource line(s) in YAML"
} else {
  Write-Host "No duplicate Mushroom YAML resource lines found (or UI-managed resources)"
}

# -----------------------------
# Summary & next steps
# -----------------------------
Write-Host ""
Write-Host "All done. Backups saved to: $BackupRoot"
Write-Host ""
Write-Host "Verification checklist:"
Write-Host "  1) Home Assistant → Developer Tools → YAML:"
Write-Host "     - Reload Template Entities"
Write-Host "     - Reload Core"
Write-Host "  2) Confirm entity 'light.permanent_outdoor_lights' exists and controls the three garage lights."
Write-Host "  3) Check that no more 'color_temp' deprecation warnings appear."
Write-Host "  4) Check that WUnderground sensors no longer warn about units."
Write-Host "  5) If Mushroom error persists, you may be using UI-managed resources (.storage)."
Write-Host "     Open Settings → Dashboards → Resources and ensure mushroom.js is listed only once."
