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
- [ ] Add Grafana monitoring
  - Goal: deploy Grafana dashboards for Home Assistant metrics and historical trends.
  - Considerations: select data source (InfluxDB, Prometheus), deployment method (Docker, add-on), HA auth/integration.
  - Bottom-to-top delivery plan:
    1. **Storage layer**: Stand up InfluxDB (add-on or external) with retention policies, HA backup, and `_internal` monitoring enabled; create API tokens scoped to Grafana.
    2. **Data collection**: Configure Home Assistant `recorder` to mirror entities of interest into InfluxDB (or enable the InfluxDB integration); validate measurement naming and measurement frequency.
    3. **Grafana add-on provisioning**: Install Grafana add-on, set admin/service users, enable Ingress + direct port, harden auth (OAuth via HA or strong local users).
    4. **Datasource wiring**: Add InfluxDB datasource (Flux query mode), pre-create folders for dashboards, set default timezone, enable annotations from HA events.
    5. **Dashboards**: Import baseline HA overview dashboards, then design custom boards for System Health, Home Metrics, Automations Insight, and Weather/Energy trends; add variables for areas/devices so dashboards scale.
    6. **Alerting & notifications**: Configure Grafana unified alerting with contact points (HA webhook/mobile), define CPU/memory/automation failure thresholds, and test alert delivery end-to-end.
    7. **Maintenance & docs**: Schedule backups/export dashboards & datasources, document credentials/secrets in `secrets.yaml`, and capture runbooks for dashboard edits and data source changes.
  - Repository status:
    - `configuration.yaml` now enables the InfluxDB integration with scoped include/exclude filters.
    - `packages/monitoring_stack.yaml` surfaces add-on health binary sensors and a summary sensor.
    - `docs/monitoring-stack.md` plus addon notes document setup, dashboards, and alerting steps.
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
