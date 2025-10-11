# Reolink Startup Review

This document summarizes the concrete configuration changes that now ship with the repo to reduce Reolink load during Home Assistant startup and kiosk dashboard initialization.

## Implemented changes

1. **Lazy video previews instead of auto-start streams** – The kiosk dashboard cards for the Backyard PT Ultra, Argus PT Ultra, and Garage cameras were switched to `camera_view: auto`, ensuring Home Assistant only negotiates the RTSP/RTMP session once a user opens the more-info dialog.【F:dashboards/kiosk.dashboard.yaml†L1525-L1537】【F:dashboards/kiosk.dashboard.yaml†L1643-L1655】【F:dashboards/kiosk.dashboard.yaml†L1757-L1767】

2. **On-demand accessory panels** – Each camera and the Reolink hub now exposes a dedicated toggle (`input_boolean`) that controls whether advanced tiles and PTZ buttons render. The dashboard wraps those heavy grids in `conditional` cards so the default view subscribes to far fewer entities until an operator expands a section.【F:dashboards/kiosk.dashboard.yaml†L1538-L1882】【F:dashboards/kiosk.dashboard.yaml†L1889-L1942】【F:input_boolean.yaml†L1-L15】

3. **Startup warm-up automation** – A new automation listens for `homeassistant.start`, steps through the Reolink camera entities, captures a lightweight snapshot for each, and briefly delays between calls. The same routine refreshes the motion sensors afterward so dashboards see fresh state without hammering the devices all at once.【F:automations.yaml†L554-L585】

## Operational notes

- Snapshots from the warm-up routine land under `/config/www/reolink_warmup/` and are overwritten on every restart. They can be ignored or surfaced in diagnostics if desired.【F:automations.yaml†L572-L579】
- Operators can pin the “Show advanced controls” tiles to favorites if frequent PTZ access is required; otherwise leave them off to keep kiosk load minimal.【F:dashboards/kiosk.dashboard.yaml†L1538-L1882】

## Next steps

- Observe the next few restarts for reductions in “stream timeout” warnings and faster kiosk load indicators.
- If further optimization is needed, temporarily enable debug logging for `homeassistant.components.reolink` during a restart window and correlate the timeline with automation execution.
