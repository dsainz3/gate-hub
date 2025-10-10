# Kiosk Camera Overview

This guide explains the camera-focused view on the kiosk dashboard and how to operate the live tiles, telemetry, and device controls. All terminology is intentionally generic so the guidance applies to any compatible camera hardware.

## View Structure

The kiosk dashboard adds a dedicated **Cameras** view (`dashboards/kiosk.dashboard.yaml`) composed of stacked cards:

- **Live Feed Columns** – Each network camera exposes a fluent stream rendered with a `picture-glance` card for quick situational awareness.
- **Lighting and Siren Toggles** – Flood/area lights, status indicators, and audible alerts are surfaced with tile cards for one-tap control.
- **Recording & Alert Switches** – Tiles expose recording, push notifications, privacy, and motion detection switches so operators can adjust behaviour without leaving the kiosk.
- **Telemetry Tiles** – Battery percentage, charging state, signal quality, and day/night mode sensors appear as read-only tiles to monitor device health.
- **PTZ & Guard Buttons** – Button cards provide directional pan/tilt actions, zoom adjustments, guard returns, and preset positioning where supported.
- **Hub Utilities** – The aggregation hub surface exposes the status LED, hub siren, alert volumes, scene profiles, and firmware status so operators can tune behaviour without leaving the dashboard.

The layout uses responsive grid templates so the view scales from wall tablets to widescreen displays.

## Entities by Camera Role

| Camera Role           | Key Entities (examples)                                                                                                   | Notes                                                                                     |
|-----------------------|----------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| Outdoor pan-tilt      | `camera.*_fluent`, `binary_sensor.*_person`, `switch.*_record`, `light.*_floodlight`, `siren.*`, `button.*_ptz_*`           | Combines live monitoring, notification control, lighting, and pan/tilt guard presets.     |
| Battery-powered PT    | `sensor.*_battery`, `switch.*_push_notifications`, `switch.*_ir_lights`, `light.*_status_led`, `button.*_guard_set_current` | Highlights power level and signal telemetry while keeping night illumination adjustable. |
| Interior zoom         | `switch.*_privacy_mode`, `switch.*_auto_tracking`, `number.*_zoom`, `sensor.*_day_night_state`                            | Uses zoom-level sliders alongside pan/tilt buttons for precise framing.                   |
| Camera hub / bridge   | `light.*_status_led`, `siren.*`, `number.*_alarm_volume`, `number.*_message_volume`, `select.*_scene_mode`, `update.*`    | Centralised controls for the bridge hardware, including alert volumes and firmware state. |

Match entities to your environment by replacing the wildcard examples with the actual identifiers emitted by your integration.

## Operating Guidelines

1. **Live Monitoring** – Tap any camera tile to expand streaming details. Use more-info dialogs for history and snapshots.
2. **Point-in-time Control** – Tiles default to toggle actions; hold for detailed configuration when additional attributes are needed.
3. **PTZ Safeguards** – Use the stop button after any manual move to ensure the device does not drift. Guard presets return the lens to a neutral patrol position, while zoom sliders provide incremental framing without relying on unavailable hardware buttons.
4. **Alert Modes** – Update recording/notification switches in tandem to avoid silent gaps. The hub siren should be exercised sparingly and reset after testing.
5. **Health Checks** – Investigate signal telemetry that trends low; consider repositioning access points or lowering bitrate selections when needed.

## Maintenance Checklist

- Reload the dashboard after firmware updates to confirm entity IDs remain stable.
- Periodically validate that motion classifiers (person, vehicle, animal) change state during known activity.
- Review storage telemetry to make sure hub media retention aligns with policy.
- Document any additional camera roles in this guide to keep the operations team aligned.

With the kiosk camera view configured, operators gain a consistent control surface for diverse camera types without navigating individual integrations.
