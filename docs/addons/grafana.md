# Grafana Add-on Setup

This document covers the Grafana add-on configuration used to visualize Home Assistant metrics and drive alerting.

## Prerequisites
- Grafana add-on installed from the Community Add-ons repository.
- InfluxDB add-on online with bucket and token configured.
- Secrets defined in `secrets.yaml` (keys prefixed `grafana_`).

## Initial Configuration
1. Install and start the Grafana add-on. Enable *Start on boot*, *Watchdog*, and (optionally) *Show in sidebar*.
2. Set admin credentials in the add-on options; mirror them in `secrets.yaml` (`grafana_admin_user`, `grafana_admin_password`).
3. Expose ports as needed: ingress covers HA UI access, but keep port `3000` open for direct desktop/laptop access.
4. For hardened auth, configure Grafana to use Home Assistant OAuth (`auth.anonymous` disabled, `auth.basic` optional).

## Data Source
1. Log into Grafana and add a new **InfluxDB** data source.
2. Select *Flux* query mode and provide:
   - URL: `http://a0d7b954-influxdb:8086`
   - Organization: `gate-hub`
   - Token: service token stored in `grafana_rest_authorization` (Bearer).
   - Default bucket: `homeassistant`.
3. Save & test; the status should match the `binary_sensor.monitoring_grafana_health`.

## Dashboards
Seed dashboards to validate the pipeline before custom builds:
- **Home Assistant System** (Community)
- **Z-Wave / Zigbee device health** (if applicable)
- **Energy & Climate overview** for local sensors

Clone dashboards into folders (`Home`, `Automations`, `System`) to keep revisions organized.

## Alerting
1. Switch to *Alerting > Contact points* and add Home Assistant webhook, mobile app push, or email.
2. Create rules for core metrics (CPU > 85%, memory > 80%, automations failing).
3. Link alert instances back to HA by toggling the `monitoring_stack` package helpers or including HA automation triggers.

## Backups
- Export dashboards (`JSON model`) into `docs/addons/grafana/exports/` when they stabilize.
- Include Grafana provisioning files in version control if externalizing data sources.

Refer to `docs/monitoring-stack.md` for end-to-end workflows and operational notes.
