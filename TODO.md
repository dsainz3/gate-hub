# TODO

## Active Items
- [ ] Fix Huskers theme issue for Huskers Team Tracker dashboard
  - Background: top app bar still renders blue despite theme overrides.
  - Completed so far:
    - Split Huskers Team Tracker into Game Day and Team & Data views for better layout.
    - Converted scoreboard and markdown styling to theme CSS variables.
    - Updated `themes.yaml` with scarlet header, black icons, cream surfaces, and MDC overrides (`mdc-theme-primary`, `mdc-theme-on-primary`).
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
- [ ] Build household package for lights/plugs/vacuums
  - Goal: consolidate common helpers, automations, scenes, and groups into a reusable package.
  - Considerations: device coverage, naming conventions, package structure.
- [ ] Enhance weather dashboard with additional data source and reorganized views
  - Goal: integrate a secondary provider (e.g., OpenWeather, AQI) and improve view layout/sections.
  - Considerations: API keys, sensor creation, updating `weather-dashboard.yaml`, ensure lint compliance.
- [ ] Move recorder include list from configuration.yaml into secrets file
  - Goal: isolate recorder entity list for easier sharing and secrets management.
  - Considerations: create entry in secrets.yaml (or package), update recorder config to reference secret, ensure reload succeeds.
## Completed Items
- [x] Split Huskers Team Tracker dashboard into separate Game Day and Team & Data views for clarity.

## Recent actions (cleanup)
- Deleted obsolete CI and helper scripts: `.ci/fakesecrets.yaml` (if present), `scripts/ha_check_portable.py`, `scripts/ha_check_portable.sh`, `scripts/hass_check.py`, `scripts/hass_check.sh`.
- Removed PowerShell helpers: `Fix-HAConfig.ps1`, `Fix-TemplatesYaml.ps1`.
- Updated `.pre-commit-config.yaml` to run the HA config check via Docker rather than the removed local script.
- Updated `.github/workflows/ha-config-check.yaml` to create valid empty YAML files (`{}`) for `secrets.yaml`, `automations.yaml`, `scripts.yaml`, and `customize.yaml` when missing.

## Next steps
- Push cleanup branch: `cleanup/remove-obsolete-artifacts-2025-09` (already pushed).
- Open PR when ready: `Remove obsolete scripts, configs, and CI/test artifacts (cleanup)`.
- Review dashboards and themes (Huskers) visual regression after cleanup.
