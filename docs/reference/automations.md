---
title: Automation Catalog
summary: Authoritative list of automations with triggers, guards, and actions for the gate-hub Home Assistant deployment.
status: active
category: reference
updated: 2025-10-18
owner: automation-team
tags:
  - home-assistant
  - automations
---

# Automation Catalog

Use this catalog as the single source of truth for automation behaviour. Each entry references its source file so code owners can jump straight to definitions. When adding or modifying automations, update this page in the same pull request.

## Operations Console (`dashboards/automations.dashboard.yaml`)

Administrators can manage every automation and scene from the Automations dashboard in the sidebar (title **Automations**, `require_admin: true`). The landing view provides:

- Toggle switches mirroring each automation's enabled state, grouped by domain (Huskers game flow, lighting schedules, F1 race control, agenda planner, seasonal routines, and safety).
- Last-triggered attribute rows for rapid verification after deployments or manual test runs.
- One-tap trigger buttons for all automations, including reload/config checks and game-day lighting scripts.
- A logbook card filtered to the same entities for timeline auditing.

The second view, **Scenes**, exposes single-button access to every defined scene (Football Team snapshots, F1 cues, daypart lighting, LED holiday effects, climate and safety presets). Each button calls `scene.turn_on`, so no extra helpers are required. Update this documentation and the dashboard together if you add or rename automations or scenes.

## Lighting, LED, Safety & Climate (`automations.yaml`)

### Lighting: Evening Lights at Sunset (`automations.yaml:3`)
- **ID** `evening_lights_at_sunset`
- **Trigger**: Sun sets +5 minutes (`platform: sun`, `event: sunset`, `offset: 00:05:00`).
- **Guards**: Skips while `binary_sensor.holiday_mode_active` or `binary_sensor.huskers_lighting_hold` is `on` so holiday overrides and Husker light shows can take priority.
- **Actions**: Brings sunroom, dining room, and living room lighting to 60% with a 2 s transition.

### Lighting: Exterior Front & Garage On (Sunset) (`automations.yaml:28`)
- **ID** `exterior_front_garage_on_sunset`
- **Trigger**: Sun sets +5 minutes.
- **Guards**: Skips when either `binary_sensor.holiday_mode_active` is `on` or `binary_sensor.huskers_lighting_hold` is `on`.
- **Actions**: Turns on porch and garage fixtures at low brightness and ramps `light.permanent_outdoor_lights` to 50% when available.

### Lighting: Night Mode at Midnight (`automations.yaml:65`)
- **ID** `night_mode_at_midnight`
- **Entity** `automation.lighting_night_mode_at_midnight`
- **Trigger**: Time equals `00:00:00`.
- **Guards**: Pauses while `binary_sensor.holiday_mode_active` or `binary_sensor.huskers_lighting_hold` is `on` so holiday scenography and game mode stay in control.
- **Actions**: Activates the Night Mode scene (5 s fade) so the scene definition owns all light levels, then logs completion.

### Lighting: Early Morning Gentle Wake (3:30 AM) (`automations.yaml:105`)
- **ID** `early_morning_lights_0330`
- **Entity** `automation.early_morning_lights_03_30`
- **Trigger**: Time equals `03:30:00`.
- **Guards**: Suppressed if `binary_sensor.holiday_mode_active` or `binary_sensor.huskers_lighting_hold` is `on`.
- **Actions**: Runs the Early Morning Gentle Wake scene (3 s fade) so the scene governs both interior ambience and exterior glow before writing a logbook entry.

### Lighting: Morning Lights Off (Sunrise + 15 min) (`automations.yaml:148`)
- **ID** `interior_lights_sunrise_off`
- **Entity** `automation.interior_lights_off_15_minutes_after_sunrise`
- **Trigger**: Sunrise +15 minutes.
- **Guards**: Skips while `binary_sensor.holiday_mode_active`, `binary_sensor.huskers_light_show_active`, or `binary_sensor.huskers_lighting_hold` is `on`.
- **Actions**: Fades sunroom, living room, and dining room lights off.

### Lighting: Exterior Front & Garage Off (Sunrise) (`automations.yaml:171`)
- **ID** `exterior_lights_sunrise_off`
- **Entity** `automation.lighting_morning_lights_off_sunrise`
- **Trigger**: Sunrise +5 minutes.
- **Guards**: Skips while `binary_sensor.holiday_mode_active`, `binary_sensor.huskers_light_show_active`, or `binary_sensor.huskers_lighting_hold` is `on`.
- **Actions**: Turns off porch, garage, and permanent outdoor lights.

### LED: Monthly Effect Scheduler (`automations.yaml:205`)
- **ID** `exterior_led_monthly_effect`
- **Entity** `automation.exterior_led_monthly_effect`
- **Triggers**: Time `00:00:01` daily, Home Assistant start, and the permanent strip returning from `unknown`/`unavailable`.
- **Guards**: Skips while `binary_sensor.holiday_mode_active` is `on` and continually verifies the requested `effect` exists in `light.permanent_outdoor_lights`.
- **Actions**: Waits up to five minutes for the effect list to repopulate, retries the scene/effect application up to six times (refreshing the entity between attempts), stops once the effect is confirmed, and logs the outcome. See [Husker LED MQTT Controls](../how-to/lighting/husker-led-mqtt.md) for manual overrides.

### Climate: Humidor Temperature Control (`automations.yaml:251`)
- **ID** `humidor_plug_temp_control`
- **Entity** `automation.humidor_plug_temperature_control`
- **Triggers**: Temperature at `sensor.hygrometer_humidor_temperature` > 74°F for 2 minutes, or < 70°F for 1 minute.
- **Guards**: Skips while `binary_sensor.holiday_mode_active` is `on` and uses a template safeguard so the plug toggles only when necessary.
- **Actions**: Switches `switch.plug_humidor` on/off and logs temperature + humidity snapshots.

### Safety: Nightly Burner Plug Shutoff (`automations.yaml:296`)
- **ID** `burner_plugs_off_2300`
- **Entity** `automation.safety_turn_off_burner_plugs_at_11_00_pm`
- **Trigger**: Time equals `23:00:00`.
- **Guards**: Does not run while `binary_sensor.holiday_mode_active` is `on` to respect manual/holiday overrides.
- **Actions**: Turns off all burner plugs, pushes a persistent notification, and records a logbook entry.

## Weather Dashboard Package (`packages/weather_dashboard_package.yaml`)

### Weather: Severe Alert → Notification (`packages/weather_dashboard_package.yaml:223`)
- **ID** `weather_alert_notify`
- **Entity** `automation.weather_severe_alert_notification`
- **Trigger**: Any state change on `sensor.nws_alerts`.
- **Guards**: Requires `input_boolean.weather_notifications_enabled` to be `on`.
- **Actions**: Creates a persistent notification summarising the incoming alert.

## Football Team Package (`packages/huskers_everything.yaml`)

These automations pair with the [Football Team Dashboard Guide](../how-to/football-team/dashboard.md) and Football Team LED scripts. ESPN data is sourced via the TeamTracker integration and the REST sensors defined in `packages/huskers_everything.yaml` (including the Core API standings endpoint). When rebranding, update the helper/entity names but keep the automation logic aligned with these patterns.

### Football Team: Scoreboard Delay Buffer (`packages/huskers_everything.yaml:1690`)
- **ID** `huskers_score_delay_buffer`
- **Entity** `automation.huskers_scoreboard_delay_buffer`
- **Triggers**: Attribute changes on `sensor.husker_team` for team score, opponent score, game clock, or quarter.
- **Guards**: Spoiler delay toggle `input_boolean.huskers_use_score_delay` must be `on` and the TeamTracker sensor available.
- **Actions**: Wait 30 seconds, then copy the buffered values into the manual score/clock helpers so dashboards lag live updates.

### Football Team: Score Delay Helper Sync (`packages/huskers_everything.yaml:1738`)
- **ID** `huskers_score_delay_sync`
- **Entity** `automation.huskers_score_delay_helper_sync`
- **Triggers**: Home Assistant start or any state change on `input_boolean.huskers_use_score_delay`.
- **Guards**: TeamTracker sensor returns data (`sensor.husker_team` not `unknown`/`unavailable`).
- **Actions**: Immediately align the manual score/clock helpers with the latest TeamTracker payload so toggling the buffer produces consistent values.

### Football Team: Enable Game Mode Window (`packages/huskers_everything.yaml:997`)
- **ID** `huskers_game_mode_enable_window`
- **Entity** `automation.huskers_enable_game_mode_window`
- **Triggers**: `sensor.huskers_kickoff_in_effective` < 121 for ≥1 minute, or ESPN pregame/live binary sensors turning `on`.
- **Guards**: Game mode currently `off` and evidence of an upcoming or active game.
- **Actions**: Enables `input_boolean.huskers_game_mode` and logs kickoff timing.

### Football Team: Disable Game Mode Window (`packages/huskers_everything.yaml:1038`)
- **ID** `huskers_game_mode_disable_window`
- **Entity** `automation.huskers_disable_game_mode_window`
- **Triggers**: Postgame ESPN sensor `on` for 2 hours, or kickoff timer > 120 for ≥5 minutes.
- **Guards**: Game mode `on`, ESPN pregame and live sensors both `off`.
- **Actions**: Disables `input_boolean.huskers_game_mode` and logs the change.

### Football Team: Pregame Showtime (T-20 Minutes) (`packages/huskers_everything.yaml:1072`)
- **ID** `huskers_showtime_at_t_20`
- **Entity** `automation.huskers_pregame_showtime_t_20_minutes`
- **Trigger**: Kickoff timer between 19–21 minutes for >5 seconds.
- **Guards**: Huskers automations enabled, game mode `on`, ESPN pregame `on` (or test mode), and chase scripts idle.
- **Actions**: Launches `script.huskers_chase30_start` (dual-cream, 45 s loop; interior group at 80 % brightness, permanent LEDs pinned at 100 %) and logs the start event.

### Football Team: Touchdown Celebration (`packages/huskers_everything.yaml:1114`)
- **ID** `huskers_td_burst_on_score`
- **Trigger**: State change on `sensor.huskers_our_score_effective`.
- **Guards**: Huskers automations + game mode `on`; score must increase.
- **Actions**: Runs `script.huskers_hail_burst_8s` (scarlet reset plus cream accents at 80 %, permanent LEDs held at 100 %) and logs the score delta.

### Football Team: Postgame Cleanup (`packages/huskers_everything.yaml:1144`)
- **ID** `huskers_postgame_cleanup`
- **Trigger**: `binary_sensor.huskers_is_postgame_espn` transitions `on` → `off`.
- **Guards**: Huskers automations + game mode `on`.
- **Actions**: Stops chase scripts in parallel and records cleanup completion.
- **Notes**: The supporting status sensor stores a `status_source` attribute (`scoreboard` or `schedule`). If ESPN’s live feed disappears immediately after the game, the fallback schedule entry keeps the sensor in `Final` so this automation still fires once the postgame window expires.

### Football Team: Automation Watchdog Alert (`packages/huskers_everything.yaml:1194`)
- **ID** `huskers_automation_watchdog_alert`
- **Trigger**: `sensor.huskers_automation_status_audit` changes to `issues` after the five-minute audit runs.
- **Guards**: None; fires whenever the audit flags disabled automations or mismatched modes.
- **Actions**: Writes a Logbook entry with the audit summary so on-call staff can compare against the sensor’s trigger snapshot.
- **Notes**: The audit sensor aggregates trigger states, helper booleans, and expected modes for all football automations so the alert message always references the latest snapshot.

## Automation Watchdog Package (`packages/automation_watchdog.yaml`)

### System: Automation Watchdog Alert (`packages/automation_watchdog.yaml:293`)
- **ID** `automation_watchdog_alert`
- **Trigger**: `sensor.automation_status_audit` turns to `issues` when any automation’s enabled state diverges from the expected groups.
- **Guards**: None. The sensor filters out ignored automations and surfaces only true mismatches.
- **Actions**: Logs a summary to the Logbook with the audit’s `issues_summary` attribute for rapid troubleshooting.
- **Notes**: The paired template sensor snapshots every automation, grouping expected-off and ignored entries for manual review in the Watchdog dashboard.

### System: Specialized Mode Alert (`packages/automation_watchdog.yaml:308`)
- **ID** `specialized_mode_alert`
- **Trigger**: `sensor.specialized_mode_audit` switches to `issues` after the Huskers, F1, or Holiday mode helpers violate their expected timelines.
- **Guards**: None; this watchdog relies on the audit sensor’s built-in logic to suppress noise when helpers are disabled or idle.
- **Actions**: Emits a Logbook entry with the audit summary describing which mode is misaligned and why.
- **Notes**: The specialized audit records reasoning strings for each helper so on-call staff immediately see whether a manual override, stale ESPN data, or race hold timer is responsible.

---

**Maintenance checklist**
1. Update this catalog when automations change (preferably by re-running a documentation script or copying from diffs).
2. Verify entity names align with `configuration.yaml` includes.
3. Add links to new runbooks or dashboards that depend on the automation.
