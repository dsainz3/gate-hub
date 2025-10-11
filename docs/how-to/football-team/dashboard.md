---
title: Football Team Dashboard Guide
summary: Configure and operate the Football Team-focused Lovelace dashboards.
status: active
category: how-to
updated: 2025-10-10
owner: playbook-team
tags:
  - lovelace
  - football
  - dashboards
---

# Football Team Dashboard Guide

This guide documents the Football Team dashboards delivered in `dashboards/huskers-teamtracker.yaml` (filename retains the original prefix for compatibility). Pair it with the [Automation Catalog](../../reference/automations.md) and [Football Team LED MQTT controls](../lighting/husker-led-mqtt.md) when troubleshooting, and keep the [Football Team Dashboard History](../../explanation/football-team-dashboard-history.md) handy for architectural context. Wherever the UI references “Huskers,” feel free to rename entities, scenes, and themes to match your own club—just update the include files to keep YAML and docs aligned.

> **Operator tooling:** Day-to-day automation toggles and one-tap scene buttons now live on the admin-only **Automations** Lovelace dashboard (`dashboards/automations.dashboard.yaml`). Use that console for reloads, manual triggers, and the global Scenes view; the Football Team dashboards continue to surface fan-facing context.

## Prerequisites
- **Team Tracker integration** (`custom_components/teamtracker`) configured for your team (example: NCAA team id `158` for Nebraska; swap to your organisation).
- **TeamTracker Lovelace card** copied to `www/community/teamtracker-card/ha-teamtracker-card.js` and registered under `lovelace.resources`:
  ```yaml
  - url: /hacsfiles/teamtracker-card/ha-teamtracker-card.js
    type: module
  ```
- **ESPN REST sensors** from `packages/huskers_everything.yaml`, including the conference standings endpoint (`sports.core.api.espn.com/.../groups/5/standings/0`). Replace the group id if your league differs.
- Apply the `Huskers Cream` theme (defined in `themes.yaml`) so the Football Team CSS variables resolve correctly, or copy the palette and create your own theme variant (see comments in the theme file).

Reload themes after deployment via **Developer Tools → YAML → Reload themes** so the custom color variables are available.

## Views

### 1. Game Day (`/husker-game-day`)
Purpose: Fan-facing board with real-time game context.

Highlights
- **TeamTracker hero card** summarising clock, score, probability, and win/loss context.
- **Quick actions** to refresh ESPN endpoints (`sensor.husker_team`, `sensor.espn_cfb_scoreboard`, `sensor.espn_nebraska_schedule`).
- **Game mode controls** to manually start or stop `input_boolean.huskers_game_mode` without hunting through Settings.
- **Lighting macros**: launch the dual-cream 45 s chase, trigger the Hail Varsity burst, or fall back to the all-scarlet scene.
- **Game Essentials** card showing kickoff ISO, venue, TV network, betting line, and manual override flags sourced from `input_boolean.huskers_use_manual_score`/`input_boolean.huskers_use_manual_kickoff`.
- **Tailgate Countdown** markdown wrapped in `binary_sensor.huskers_tailgate_window` so it only renders 24 h before kickoff through 30 min post-game.
- **In-Game Situation** markdown gated by `binary_sensor.huskers_is_live_espn`, focused on football context (clock, down/distance, drive, timeouts, win probability).

Usage Notes
- Manual kickoffs propagate through `sensor.huskers_kickoff_in_effective`; the countdown card automatically respects `input_boolean.huskers_use_manual_kickoff` and `input_number.huskers_kickoff_in_manual`.
- `binary_sensor.huskers_tailgate_window` evaluates the kickoff timestamp, live/post-game states, and post-game runout to decide when the countdown card is shown.
- Score overrides live in `input_number.huskers_our_score_manual` and `sensor.huskers_our_score_effective` and are reflected in the TeamTracker card.
- The in-game card hides outside live phases; confirm `binary_sensor.huskers_is_live_espn` before troubleshooting missing data.

### 2. Team & Data (`/husker-team-data`)
Purpose: Operator view for stats, standings, and sensor health.

Highlights
- **Profile tables** for the Football Team and the upcoming opponent, rendered with table rows instead of unordered bullet lists for faster scanning.
- **Color swatches** convert hex strings (primary/secondary colors discovered from TeamTracker attributes) into live chips with the hex code beside a colored square.
- **Series summary** placeholder driven by `sensor.husker_team` attributes when ESPN provides historical matchup text.
- **Raw sensor reference** using entity rows for `sensor.husker_team` attributes; helps validate that the TeamTracker integration is populating data.
- **Conference standings markdown card** built from the ESPN Core API feed (`sports.core.api.espn.com/v2/.../groups/5/standings/0`). Each row displays overall and conference records in a markdown table; replace the group id to match your conference.
- **Tailgate countdown** uses the effective kickoff helper and is only visible while `binary_sensor.huskers_tailgate_window` is `on`.

Usage Notes
- When colors are missing from ESPN data, fallback Scarlet & Cream palette values populate the color chips.
- If the standings markdown shows “unavailable,” confirm that the REST sensor `sensor.espn_big_ten_teams` is returning the `standings` attribute (requires the updated package).

### 3. Lighting & Scenes (`/huskers-lighting`)
Purpose: Maintenance console for lighting automations and Husker-specific scenes.

Highlights
- Markdown intro summarising the intent and linking scenes/automations conceptually.
- **Lighting automation list** with last-triggered metadata for the baseline daily schedules and monthly LED routines.
- **Football Team scene catalog** enumerating the core presets most relevant to game-day; for the full estate of lighting presets (including F1, safety, and climate snapshots) use the Automations → Scenes view.
- **Lighting control grid** that surfaces every interior and exterior fixture touched by the Football Team shows for quick overrides.

Usage Notes
- Snapshot scenes (`scene.huskers_before_chase_snapshot`, `scene.huskers_before_burst_snapshot`) stay visible even after restarts so you can resnapshot or re-run shows without editing the dashboard.
- The scene catalog on this view is curated; add new Football Team presets here as needed and mirror them in the global Scenes view so they remain accessible from the Automations console.
- Use the automation last-triggered timestamps to confirm the daily schedule fired; if an entry stays blank, check for disabled automations in Home Assistant Settings → Automations.
- The chase scripts drive the eight fixture group at 80 % brightness while locking the permanent LEDs at 100 %; open the light more-info dialog to confirm the strip picked up `LED-Gametime` during shows.
- The `sensor.huskers_game_status_espn` tile now exposes a `status_source` attribute. If ESPN removes the live scoreboard entry immediately after the whistle, the sensor falls back to the latest completed game from the season schedule so postgame automation checks keep working. If you notice the wrong source, confirm the schedule feed still lists the most recent matchup.

## Operations Checklist
- Use **Refresh Game Data** before kickoff or when ESPN phases feel stale.
- Use **Start Game Mode**/**Stop Game Mode** from the Game Day quick actions when you need to manually override the automation window (for example, cancelling a rain delay or shutting things down early).
- Toggle `input_boolean.huskers_test_mode` to simulate game phases without waiting for live data.
- Monitor `binary_sensor.huskers_light_show_active` while running lighting scripts; the sidebar icon warns if shows fail to shut down post-game.
- Validate the Big Ten standings table weekly during the season; ESPN occasionally changes payload structure—adjust `packages/huskers_everything.yaml` accordingly.

## Troubleshooting
- If the TeamTracker card fails to load, verify the resource URL (`/hacsfiles/teamtracker-card/ha-teamtracker-card.js`) and clear the Lovelace cache (refresh with Ctrl+Shift+R).
- Missing logos or color swatches often mean ESPN returned `None`; check Home Assistant logs for REST errors and rerun the refresh buttons.
- If the countdown never shows, verify `binary_sensor.huskers_tailgate_window` (should turn on 24 h pre-kickoff) and ensure `sensor.husker_team` carries a valid `date` attribute.
- Incorrect kickoff countdown usually points to the manual override toggles—confirm `input_boolean.huskers_use_manual_kickoff` is set as expected.

## Related Documentation
- [Football Team LED MQTT Controls](../lighting/husker-led-mqtt.md)
- [Automation Catalog – Football Team Package](../../reference/automations.md#football-team-package-packageshuskers_everythingyaml)
- [Football Team Dashboard History](../../explanation/football-team-dashboard-history.md)
