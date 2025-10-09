# Formula 1 Package & Dashboard

This guide walks through enabling the Nicxe F1 Sensor integration, wiring the new `packages/f1_everything.yaml` automations, and importing the Lovelace dashboard that ships with this branch.

## Prerequisites
- Home Assistant 2024.12 or later with YAML packages enabled (`homeassistant: packages: !include_dir_merge_named packages`).
- The custom integration [`Nicxe/f1_sensor`](https://github.com/Nicxe/f1_sensor) dropped into `custom_components/f1_sensor` (already present in this repo) or installed through HACS.
- An API configuration for the integration via **Settings → Devices & Services → Add Integration → F1 Sensor**. Make sure you enable at least:
  - `next_race`
  - `driver_standings`
  - `constructor_standings`
  - `weather`
  - Live options if you want track status, safety car, lap count, or weather telemetry on race day.

## Deploy the Package
1. Copy `packages/f1_everything.yaml` into the directory that Home Assistant includes for packages.
2. Restart Home Assistant so the helpers, templates, scenes, scripts, and automations register.
3. After the restart, visit **Settings → Devices & Services → Helpers** to confirm the new `F1` input booleans, numbers, and texts exist.

### Optional Tweaks
- Edit the light group at `group.f1_show_lights` if your celebratory fixtures differ from the Football Team install.
- Update the `scene.f1_*` definitions with your preferred colors and transitions.
- If you keep automations disabled outside of race weekends, flip `input_boolean.f1_automations_enabled` off; the dashboard exposes a quick toggle.

## Import the Dashboard
1. Place `dashboards/f1-dashboard.yaml` alongside your other YAML dashboards.
2. In **Settings → Dashboards**, add a new YAML dashboard that points to this file (or update an existing entry).
3. Refresh Lovelace; the new “F1 Race Center” view surfaces:
   - Countdown, local start time, and phase label built from the F1 Sensor data
   - Quick controls to refresh data and trigger the lighting scripts
   - Markdown tables for the weekend schedule plus driver/constructor top fives
   - Telemetry rows for live weather, lap count, safety car status, and the stored last flag message

## Automation Overview
- **Enable Race Mode** kicks in when the countdown drops below three hours or the session goes live. Race mode gates the show scripts and other automations.
- **Disable Race Mode** waits for wrap-up or a large countdown gap to power everything down and restore lights.
- **Lights Out Showtime** replays the classic five-light sequence five minutes before the green flag.
- **Chequered Flag Celebration** fires when the session transitions into a finished/finalised/ended state.
- **Track Status Watch** logs every change in the track status sensor and stashes a timestamped summary in `input_text.f1_last_flag_message` for dashboard display.

Tune thresholds, quiet hours, or script targets as needed; the scaffolding mirrors the Football Team package so the patterns stay familiar.
