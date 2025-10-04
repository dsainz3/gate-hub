---
title: Automation Catalog
summary: Authoritative list of automations with triggers, guards, and actions for the gate-hub Home Assistant deployment.
status: active
category: reference
updated: 2025-10-06
owner: automation-team
tags:
  - home-assistant
  - automations
---

# Automation Catalog

Use this catalog as the single source of truth for automation behaviour. Each entry references its source file so code owners can jump straight to definitions. When adding or modifying automations, update this page in the same pull request.

## Lighting, LED, Safety & Climate (`automations.yaml`)

### Lighting: Evening Lights at Sunset (`automations.yaml:3`)
- **ID** `evening_lights_at_sunset`
- **Trigger**: Sun sets +5 minutes (`platform: sun`, `event: sunset`, `offset: 00:05:00`).
- **Guards**: Requires `binary_sensor.holiday_mode_active` to be `off` and `binary_sensor.huskers_lighting_hold` to be `off` so holiday overrides and Husker light shows can take priority.
- **Actions**: Brings sunroom, dining room, and living room lighting to 60% with a 2 s transition.

### Lighting: Exterior Front & Garage On (Sunset) (`automations.yaml:28`)
- **ID** `exterior_front_garage_on_sunset`
- **Trigger**: Sun sets +5 minutes.
- **Guards**: Skips when either `binary_sensor.holiday_mode_active` is `on` or `binary_sensor.huskers_lighting_hold` is `on`.
- **Actions**: Turns on porch and garage fixtures at low brightness and ramps `light.permanent_outdoor_lights` to 50% when available.

### Lighting: Night Mode at Midnight (`automations.yaml:65`)
- **ID** `night_mode_at_midnight`
- **Trigger**: Time equals `00:00:00`.
- **Guards**: Pauses while `binary_sensor.holiday_mode_active` is `on` to honour holiday scenes.
- **Actions**: Powers down interior/exterior fixtures and leaves permanent LEDs glowing at 20%.

### Lighting: Early Morning Gentle Wake (3:30 AM) (`automations.yaml:105`)
- **ID** `early_morning_lights_0330`
- **Trigger**: Time equals `03:30:00`.
- **Guards**: Suppressed if `binary_sensor.holiday_mode_active` is `on`.
- **Actions**: Softly lights interior spaces (10%, warm) and exterior fixtures (10%, cool); boosts permanent LEDs to 50%.

### Lighting: Morning Lights Off (Sunrise + 15 min) (`automations.yaml:148`)
- **ID** `interior_lights_sunrise_off`
- **Trigger**: Sunrise +15 minutes.
- **Guards**: Skips while `binary_sensor.holiday_mode_active` is `on` or `binary_sensor.huskers_light_show_active` is `on`.
- **Actions**: Fades sunroom, living room, and dining room lights off.

### Lighting: Exterior Front & Garage Off (Sunrise) (`automations.yaml:171`)
- **ID** `exterior_lights_sunrise_off`
- **Trigger**: Sunrise +5 minutes.
- **Guards**: Skips while `binary_sensor.holiday_mode_active` or `binary_sensor.huskers_light_show_active` is `on`.
- **Actions**: Turns off porch, garage, and permanent outdoor lights.

### LED: Monthly Effect Scheduler (`automations.yaml:205`)
- **ID** `exterior_led_monthly_effect`
- **Triggers**: Time `00:00:01` daily and Home Assistant start.
- **Guards**: Requires `binary_sensor.holiday_mode_active` to be `off` and confirms the requested `effect` exists in `light.permanent_outdoor_lights`.
- **Actions**: Applies the month-specific effect and logs the change. See [Husker LED MQTT Controls](../how-to/lighting/husker-led-mqtt.md) for manual overrides.

### Climate: Humidor Temperature Control (`automations.yaml:251`)
- **ID** `humidor_plug_temp_control`
- **Triggers**: Temperature at `sensor.hygrometer_humidor_temperature` > 74°F for 2 minutes, or < 70°F for 1 minute.
- **Guards**: Requires `binary_sensor.holiday_mode_active` to be `off` and uses a template safeguard so the plug toggles only when necessary.
- **Actions**: Switches `switch.plug_humidor` on/off and logs temperature + humidity snapshots.

### Safety: Nightly Burner Plug Shutoff (`automations.yaml:296`)
- **ID** `burner_plugs_off_2300`
- **Trigger**: Time equals `23:00:00`.
- **Guards**: Does not run while `binary_sensor.holiday_mode_active` is `on` to respect manual/holiday overrides.
- **Actions**: Turns off all burner plugs, pushes a persistent notification, and records a logbook entry.

## Weather Dashboard Package (`packages/weather_dashboard_package.yaml`)

### Weather: Severe Alert → Notification (`packages/weather_dashboard_package.yaml:223`)
- **ID** `weather_alert_notify`
- **Trigger**: Any state change on `sensor.nws_alerts`.
- **Guards**: Requires `input_boolean.weather_notifications_enabled` to be `on`.
- **Actions**: Creates a persistent notification summarising the incoming alert.

## Huskers Package (`packages/huskers_everything.yaml`)

These automations pair with the [Husker Dashboard Guide](../how-to/huskers/dashboard.md) and Huskers LED scripts. ESPN data is sourced via the TeamTracker integration and the REST sensors defined in `packages/huskers_everything.yaml` (including the Core API standings endpoint).

### Huskers: Enable Game Mode Window (`packages/huskers_everything.yaml:997`)
- **ID** `huskers_game_mode_enable_window`
- **Triggers**: `sensor.huskers_kickoff_in_effective` < 121 for ≥1 minute, or ESPN pregame/live binary sensors turning `on`.
- **Guards**: Game mode currently `off` and evidence of an upcoming or active game.
- **Actions**: Enables `input_boolean.huskers_game_mode` and logs kickoff timing.

### Huskers: Disable Game Mode Window (`packages/huskers_everything.yaml:1038`)
- **ID** `huskers_game_mode_disable_window`
- **Triggers**: Postgame ESPN sensor `on` for 2 hours, or kickoff timer > 120 for ≥5 minutes.
- **Guards**: Game mode `on`, ESPN pregame and live sensors both `off`.
- **Actions**: Disables `input_boolean.huskers_game_mode` and logs the change.

### Huskers: Pregame Showtime (T-20 Minutes) (`packages/huskers_everything.yaml:1072`)
- **ID** `huskers_showtime_at_t_20`
- **Trigger**: Kickoff timer between 19–21 minutes for >5 seconds.
- **Guards**: Huskers automations enabled, game mode `on`, ESPN pregame `on` (or test mode), and chase scripts idle.
- **Actions**: Launches `script.huskers_chase30_start` and logs.

### Huskers: Touchdown Celebration (`packages/huskers_everything.yaml:1114`)
- **ID** `huskers_td_burst_on_score`
- **Trigger**: State change on `sensor.huskers_our_score_effective`.
- **Guards**: Huskers automations + game mode `on`; score must increase.
- **Actions**: Runs `script.huskers_hail_burst_8s` and logs the score delta.

### Huskers: Postgame Cleanup (`packages/huskers_everything.yaml:1144`)
- **ID** `huskers_postgame_cleanup`
- **Trigger**: `binary_sensor.huskers_is_postgame_espn` transitions `on` → `off`.
- **Guards**: Huskers automations + game mode `on`.
- **Actions**: Stops chase scripts in parallel and records cleanup completion.

---

**Maintenance checklist**
1. Update this catalog when automations change (preferably by re-running a documentation script or copying from diffs).
2. Verify entity names align with `configuration.yaml` includes.
3. Add links to new runbooks or dashboards that depend on the automation.
