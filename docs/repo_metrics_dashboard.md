# Repo Metrics & Devices Dashboard

This dashboard package ships a complete Lovelace experience focused on operational KPIs, network health, safety posture, and per-area drill-downs.

## Installation

1. Copy `packages/repo_metrics_dashboard.yaml` into your Home Assistant `/config/packages` directory.
2. Ensure `packages` support is enabled in `configuration.yaml` (this repo already includes `homeassistant: packages: !include_dir_named packages`).
3. Restart Home Assistant to load the new template sensors and Lovelace dashboard registration.
4. After restart, a new sidebar entry titled **Repo Metrics & Devices** (URL path `/repo`) will appear.

## Card Dependencies

Install the following custom cards via HACS if they are not already present:

- [Mushroom Cards](https://github.com/piitaya/lovelace-mushroom)
- [Auto-Entities](https://github.com/thomasloven/lovelace-auto-entities)
- [ApexCharts Card](https://github.com/RomRider/apexcharts-card)

Place resources under **Settings → Dashboards → Resources** matching the paths used in `configuration.yaml` (e.g., `/hacsfiles/...`).

## Customization Tips

- **Badges & chips** – Adjust or remove badges/chips by editing the `badges:` array or the `custom:mushroom-chips-card` definitions in the Overview view.
- **KPIs** – Template sensors (`sensor.repo_*`) power the KPI counts. Tune thresholds (e.g., low battery limit) directly in the template definitions.
- **Weather entity** – The dashboard automatically picks the first available `weather.` entity. Override by replacing references to `sensor.repo_primary_weather` or the `weather.forecast_home` card with your preferred entity IDs.
- **Area views** – Update the per-area auto-entities filters if you rename areas or add new rooms.
- **Network charts** – Point the ApexCharts series to your preferred latency/throughput sensors if you use alternatives to the included Speedtest sensors.

## Kiosk/TV Mode

The layout already uses Mushroom cards for clarity. For kiosk displays, enable a high-contrast theme and increase Mushroom `layout` size via [theme variables](https://github.com/piitaya/lovelace-mushroom#theme-variables).

