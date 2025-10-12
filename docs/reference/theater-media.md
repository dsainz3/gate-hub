---
title: Basement Theater Media Package
summary: Reference for the Fire TV + Plex helpers, scripts, and dashboard view defined in packages/theater_media.yaml.
status: active
category: reference
updated: 2025-10-10
owner: media-team
tags:
  - home-assistant
  - plex
  - fire-tv
---

# Basement Theater Media Package

The `packages/theater_media.yaml` bundle standardises how the basement theater Fire TV and Plex server are controlled and monitored. Use this page to confirm entity names, dependencies, and dashboard wiring when maintaining the Plex integration or adding new media clients.

## Dependencies
- **Integrations**:
  - [Android TV Remote](https://www.home-assistant.io/integrations/androidtv/) configured for the basement Fire TV (`media_player.basement_fire_tv`, `remote.basement_fire_tv`).
  - [Plex](https://www.home-assistant.io/integrations/plex/) integration exposing the server sensors (`sensor.plex`, `button.plex_scan_clients`, `update.plex_update`) and the Android TV client entity (`media_player.plex_plex_for_android_tv_aftgazl`).
- **Core configuration**: `media_source:` must be present in `configuration.yaml` so the Lovelace media browser card can enumerate the Plex library.
- **Devices**: Ensure ADB debugging remains enabled on the Fire TV so `androidtv.adb_command` calls succeed.

## Helpers and Scripts

| Entity | Type | Purpose |
| --- | --- | --- |
| `script.basement_fire_tv_launch_plex` | script | Powers on the Fire TV if needed, returns to the home screen, and launches the Plex client via an ADB intent. |
| `script.basement_fire_tv_play_pause` | script | Sends a play/pause toggle to the Fire TV media player. |
| `script.basement_fire_tv_home` | script | Issues a `HOME` remote command for quick navigation. |
| `script.basement_fire_tv_power_off` | script | Turns the Fire TV off through `media_player.turn_off`. |
| `script.plex_refresh_clients` | script | Presses `button.plex_scan_clients` to refresh the Plex device roster. |
| `sensor.basement_theater_media_status` | template sensor | Normalised status for the Fire TV including app name, media metadata, and last-changed timestamp. |
| `sensor.plex_server_sessions` | template sensor | Exposes the active Plex session count with friendly text, players list, and last update timestamp. |
| `binary_sensor.basement_theater_active` | template binary sensor | Turns `on` when either the Fire TV is active (`on`/`playing`/`paused`) or Plex reports one or more active sessions. |
| `group.theater_media_entities` | group | Roll-up of the entities above for debugging and auto-entities cards. |

Friendly names and icons for the player, remote, and scripts are defined in the `homeassistant.customize` block at the top of the package.

## Dashboard Wiring

The Support · Test Resources dashboard now follows the 2025 design profile showcased in the new Home Assistant dashboard preview, backed by the gold-accented **Support Test Gold** theme with a black application banner and black-trimmed cards to keep captures consistent with the refreshed palette. The **Plex · Theater** view (`dashboards/_support/test_resources.dashboard.yaml`) now rotates through a richer assortment of modern cards:

1. **Playback Overview** – A `custom:swipe-card` carousel combines Mushroom and Mini Media Player cards with a styled picture entity so testers can swipe between transport, metadata, and artwork contexts.
2. **Engagement Metrics** – ApexCharts and history graphs chart Plex session density alongside the Fire TV activity sensor, with an auto-entities Mushroom card surfacing the heartbeat sensors that power the analytics.
3. **Client Controls** – Mixed Mushroom template and `custom:button-card` actions provide one-tap access to Fire TV scripts, Plex client scans, and the server update entity, complete with styled hold actions for advanced flows.
4. **Library & Notes** – A `custom:tabbed-card` exposes the Plex media browser, a dynamically generated watch list tab, and embedded support notes so testers can document findings without leaving the dashboard.

Keep the Fire TV online (launch the Plex app at least once) before loading the view so the client entity appears and the media browser renders without configuration errors.

## Operational Checklist
1. After updating the package, reload Home Assistant packages or restart Core so template sensors and scripts are registered.
2. Confirm `media_source` stays enabled in `configuration.yaml` after merges; the HA config check will fail if it is removed.
3. Validate the Support · Test Resources dashboard reloads without missing-entity warnings. Use the `group.theater_media_entities` group in Developer Tools → States when troubleshooting.
4. When adding new Fire TV/Plex clients, clone this package, adjust entity IDs, and document the new view in the same style.
