# Repo Metrics & Devices Dashboard

The Repo Metrics & Devices package registers a Lovelace dashboard that pulls together
operational KPIs, lighting controls, safety alerts, network telemetry, and per-room
drill-downs. Template sensors ship alongside the UI so counts such as "lights on" and
"low batteries" stay accurate even if integrations briefly go unavailable.

## Views delivered

- **Overview** – KPI chips, a six-card indicator grid, weather and network snapshots,
  GitHub highlights, and a live calendar teaser for the next household event.
- **Lighting** – Group toggles for the most common light bundles plus dynamic lists
  for office, living spaces, bedrooms, kitchen/dining, and exterior fixtures.
- **Climate & Environment** – Temperature and humidity sensor catalogues, humidor
  health, and a 24-hour ApexCharts trend that blends outdoor, weather-station, and
  humidor readings.
- **Safety & Power** – Offline/stale device detection, low-battery surfacing, and
  update entities aggregated from every integration.
- **Network** – Speedtest snapshot, supporting helpers (status summary, last run,
  reachability), a 24-hour latency chart, and Deco/firmware entities listed via
  auto-entities.
- **Scenes & Scripts** – Quick-launch chips for Huskers shows, Kiosk power toggles,
  Plex client refresh, and curated auto-entities sections for Huskers, lighting, and
  media scripts alongside scene collections.
- **GitHub Metrics** – Workflow status messaging, highlight sensors,
  weekly contributor counts, and inline charts for commits (day/week/month),
  contributors, reverts, and CI health sourced from `/local/metrics/` assets with
  a quick link to the generated HTML summary.
- **Area drill-downs** – Office, Living Room, Kitchen, Bedroom, and Garage views use
  wildcard filters so every entity tagged with those room names (lights, sensors,
  switches, helpers) renders automatically.

## Installation

1. Copy `packages/repo_metrics_dashboard.yaml` into `/config/packages`.
2. Copy `dashboards/repo-metrics.dashboard.yaml` into `/config/dashboards` (overwrite any
   existing repo metrics dashboard).
3. Confirm `configuration.yaml` contains a `lovelace: dashboards:` entry named
   `repo-metrics-dashboard` (hyphenated slug) that points to
   `dashboards/repo-metrics.dashboard.yaml`, uses `mode: yaml`, and sets the title/icon you
   prefer (the package expects **Repo Metrics & Devices** with `mdi:view-dashboard-outline`).
4. Add a new secret named `github_repo_metrics_auth_header` to `secrets.yaml` with the
   value `Bearer <your_personal_access_token>`. The token needs `repo` and `actions:read`
   scopes so Home Assistant can dispatch the metrics workflow through the GitHub API.
   (See **Manual GitHub workflow trigger** below for details.)
5. Restart Home Assistant, then open **Settings → Dashboards** – the sidebar entry titled
   **Repo Metrics & Devices** launches the refreshed layout at `/lovelace/repo-metrics-dashboard`.

## Card dependencies

Install these HACS cards before loading the dashboard:

- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom)
- [Auto-Entities](https://github.com/thomasloven/lovelace-auto-entities)
- [ApexCharts Card](https://github.com/RomRider/apexcharts-card)

Ensure the resources are added under **Settings → Dashboards → Resources** with URLs
that match your HACS configuration (typically `/hacsfiles/...`).

## Customisation guide

- **Template sensors** – The package defines `sensor.repo_lights_on_total`,
  `sensor.repo_devices_offline_total`, `sensor.repo_stale_sensors_total`,
  `sensor.repo_low_battery_total`, `sensor.repo_updates_available_total`,
  `sensor.repo_primary_weather`, and GitHub helpers such as
  `sensor.github_repo_metrics_status` and `sensor.github_repo_metrics_weekly_commits_highlight`.
  Tweak thresholds (e.g., the 30 % battery limit) or domain lists inside the
  `template:` block.
- **Weather source** – The weather summary honours `input_text.weather_pws_entity`.
  Set that helper to your preferred `weather.` entity or leave it blank to fall back
  to the first available entity.
- **Lighting filters** – Auto-entities use wildcard matches (e.g., `light.*office*`).
  Adjust or extend the globs if you rename devices or add new fixtures.
- **Network trend** – Swap the Speedtest entities for custom latency/download sensors
  if you rely on different integrations; the ApexCharts series are defined in one
  place in the Network view.
- **Scene/script groupings** – Each auto-entities card filters by entity-id prefixes
  (`scene.huskers_*`, `script.kiosk_*`, etc.). Update the globs to mirror any naming
  conventions you introduce.
- **GitHub metrics assets** – Ensure your CI pipeline refreshes `/www/metrics` so the
  summary sensor and SVG charts stay current. The overview chips and snapshot
  cards pull from these sensors and charts, while the dedicated view surfaces
  workflow status, raw sensors, and charts but will fall back to guidance text
  until the workflow populates `summary.json`.
- **Manual workflow dispatch** – The package registers `script.trigger_github_repo_metrics_workflow`
  which calls a `rest_command` hitting the GitHub Actions API. Use it from the GitHub
  Metrics view (Run Metrics Workflow chip), Automations, or Assist. The script logs a
  confirmation to the Logbook once the API call is issued.
- **Command line sensor path** – `sensor.github_repo_metrics_summary` reads directly
  from `/config/www/metrics/summary.json`. Adjust the `command` path inside
  `packages/repo_metrics.yaml` if your Home Assistant container mounts the metrics
  directory elsewhere.

## Kiosk and TV usage

The layout already leans on Mushroom cards for clarity. For large displays, pair the
dashboard with the Huskers Cream theme (provided in `packages/huskers.yaml`) or your
preferred high-contrast theme and increase Mushroom spacing via
[`mush-spacing`](https://github.com/piitaya/lovelace-mushroom#theme-variables).

## Manual GitHub workflow trigger

- **Secret** – Define `github_repo_metrics_auth_header: "Bearer ghp_..."` in
  `secrets.yaml`. This token is only used for the dispatch call and can reuse the
  `REPO_METRICS_TOKEN` you already configured for GitHub Actions.
- **Script** – Run the "GitHub: Trigger Repo Metrics Workflow" script (available via the
  Run Metrics Workflow chip, the Scripts panel, or Assist). Home Assistant sends a
  `workflow_dispatch` request to `repo-metrics.yml` targeting the `main` branch.
- **Outcome** – GitHub spins up the existing workflow which regenerates the charts and
  HTML under `www/metrics`, commits them to the `automation/repo-metrics` branch, and
  opens/updates the PR for review. Once merged, Home Assistant will read the refreshed
  `summary.json` on its next sensor poll.
