# TODO

## Active Items
- [ ] Remove obsolete HA helper scripts and associated tooling
  - Delete legacy helpers from `scripts/` and the `.ci/fakesecrets.yaml` placeholder once the workflow no longer needs them.
  - ~~Drop PowerShell utilities (`Fix-HAConfig.ps1`, `Fix-TemplatesYaml.ps1`) or relocate them to an archival location.~~ _(Completed: archived from repo October 2025)_
  - Update `.pre-commit-config.yaml` to run `hass --script check_config` via Docker or the supported runner after the local scripts are gone.
- [ ] Fix Huskers theme issue for Huskers Team Tracker dashboard
  - Background: top app bar still renders blue despite theme overrides.
  - Completed so far:
    - Split Huskers Team Tracker into Game Day and Team & Data views for better layout.
    - Converted scoreboard and markdown styling to theme CSS variables.
    - Updated the Huskers package theme block in `packages/huskers.yaml` with scarlet header, black icons, cream surfaces, and MDC overrides (`mdc-theme-primary`, `mdc-theme-on-primary`).
    - Normalized line endings and passed `yamllint` on dashboard/theme files.
    - Added repo TODO tracker with context.
  - Next steps / resume plan:
    - Reload themes in Home Assistant frontend and verify header color.
    - If header remains blue, inspect global theme precedence and confirm Huskers Cream is applied to the dashboard/user.
    - Check for per-user theme overrides.
- [ ] Add monitoring and alerting capabilities
  - Goal: Implement monitoring for Home Assistant metrics and historical trends
  - Currently: No metrics or dashboards for performance, sensor, or automation tracking
  - Future considerations:
    - Native Home Assistant history/recorder for metrics storage
    - Custom dashboards and cards for visualization
    - Automations for alerts and notifications
- [ ] Finish resolving issues with networking dashboard and cards
  - Ensure history/overview layouts are stable and charts render without config errors.
  - Verify reachability/latency sensors show consistent states (no lingering “unreachable” vs “unavailable” mismatches).
  - Add tests/checklist for future dashboard changes.
- [ ] Build household package for lights/plugs/vacuums
  - Goal: consolidate common helpers, automations, scenes, and groups into a reusable package.
  - Considerations: device coverage, naming conventions, package structure.
- [ ] On kiosk build out shortcut calls to critical network sensors
  - Add Lovelace buttons/tiles for quick access to latency, speedtest, Deco health.
  - Surface manual refresh actions (e.g., trigger speedtest) and key binary sensors.
- [ ] Add Reolink cameras
  - Integrate Reolink integration or ONVIF streams.
  - Expose cameras to dashboards and automations; confirm recording/alerts.
- [x] Enhance weather dashboard with additional data source and reorganized views
  - Goal: integrate a secondary provider (e.g., OpenWeather, AQI) and improve view layout/sections.
  - Considerations: API keys, sensor creation, updating `weather-dashboard.yaml`, ensure lint compliance.
  - Completed: Added dedicated OpenWeather view and reorganized core sections in `dashboards/weather.dashboard.yaml`.
- [x] Move recorder include list from configuration.yaml into secrets file
  - Goal: isolate recorder entity list for easier sharing and secrets management.
  - Considerations: create entry in secrets.yaml (or package), update recorder config to reference secret, ensure reload succeeds.
  - Completed: `configuration.yaml` now references `!secret recorder_include_entities` for the include list (mirrored in `secrets.example.yaml`).
- [ ] Restore F1 sensor integration coverage
  - Current dashboard and automations rely on core sensors that are not yet exposed (`sensor.f1_session_status`, `sensor.f1_track_weather`, `sensor.f1_weather`, `sensor.f1_race_lap_count`, `binary_sensor.f1_safety_car`).
  - Re-enable the F1 Sensor config entry and ensure these entities are registered so the Network/F1 dashboards stop warning.
  - Update `dashboards/f1-dashboard.yaml` once telemetry is back to include standings, weather, and race-control metrics.
- [ ] Automate dashboard screenshot refresh
  - Ensure Playwright captures run successfully in CI/Docker using `HA_BASE_URL`/`HA_TOKEN`.
  - Resolve remaining secret/env handling so the wrapper works without manual intervention.
  - Document a reliable path for capturing and committing refreshed assets.

## Completed Items
- [x] Split Huskers Team Tracker dashboard into separate Game Day and Team & Data views for clarity.

## Recent actions (cleanup)
- Audited cleanup plan and confirmed legacy helper scripts still exist (`.ci/fakesecrets.yaml`, `scripts/ha_check_portable.py`, `scripts/ha_check_portable.sh`, `scripts/hass_check.py`, `scripts/hass_check.sh`).
- PowerShell helper utilities (`Fix-HAConfig.ps1`, `Fix-TemplatesYaml.ps1`) removed from the repository and no longer tracked.
- Updated `.github/workflows/ha-config-check.yaml` to create valid empty YAML files (`{}`) for `secrets.yaml`, `automations.yaml`, `scripts.yaml`, and `customize.yaml` when missing.

## Next steps
- Create a cleanup branch once the obsolete script removal and tool updates are staged.
- Open PR: `Remove obsolete scripts, configs, and CI/test artifacts (cleanup)` once the branch is ready.
- Review dashboards and themes (Huskers) for visual regressions after cleanup work lands.
