---
title: Huskers Dashboard Guide
summary: Configure and operate the Huskers-focused Lovelace dashboards.
status: active
category: how-to
updated: 2025-10-06
owner: huskers-team
tags:
  - lovelace
  - huskers
  - dashboards
---

# Huskers Dashboard Guide

This guide documents the Huskers dashboards delivered in `dashboards/huskers-teamtracker.yaml`. Pair it with the [Automation Catalog](../../reference/automations.md) and [Husker LED MQTT controls](../lighting/husker-led-mqtt.md) when troubleshooting, and keep the [Huskers Dashboard History](../../explanation/huskers-dashboard-history.md) handy for architectural context.

## Prerequisites
- **Team Tracker integration** (`custom_components/teamtracker`) configured for Nebraska (team id `158`).
- **TeamTracker Lovelace card** copied to `www/community/teamtracker-card/ha-teamtracker-card.js` and registered under `lovelace.resources`:
  ```yaml
  - url: /hacsfiles/teamtracker-card/ha-teamtracker-card.js
    type: module
  ```
- **ESPN REST sensors** from `packages/huskers_everything.yaml`, including the Big Ten standings endpoint (`sports.core.api.espn.com/.../groups/5/standings/0`).
- Apply the `Huskers Cream` theme (defined in `themes.yaml`) so custom CSS vars (e.g., `--huskers-scoreboard-border`) resolve correctly.

Reload themes after deployment via **Developer Tools → YAML → Reload themes** so the custom color variables are available.

## Views

### 1. Game Day (`/husker-game-day`)
Purpose: Fan-facing board with real-time game context.

Highlights
- **TeamTracker hero card** summarising clock, score, probability, and win/loss context.
- **Quick actions** to refresh ESPN endpoints (`sensor.husker_team`, `sensor.espn_cfb_scoreboard`, `sensor.espn_nebraska_schedule`).
- **Lighting macros**: start 30 s chase, trigger Hail Varsity burst, revert to the all-scarlet scene.
- **Markdown scoreboard** styled with Huskers palette variables; uses `sensor.husker_team` attributes for opponent logos, win probability, possession, and status text.
- **Game Essentials** card showing kickoff ISO, venue, TV network, betting line, and manual override flags sourced from `input_boolean.huskers_use_manual_score`/`input_boolean.huskers_use_manual_kickoff`.
- **Situation + Hype**: down-and-distance, last play, baseball-style metrics (used for baseball/volleyball seasons) and `sensor.huskers_hype_message` for dynamic rally text.

Usage Notes
- Manual kickoffs propagate through `sensor.huskers_kickoff_in_effective`; the countdown card automatically respects `input_boolean.huskers_use_manual_kickoff` and `input_number.huskers_kickoff_in_manual`.
- Score overrides live in `input_number.huskers_our_score_manual` and `sensor.huskers_our_score_effective` and are reflected in both the TeamTracker card and the markdown scoreboard.

### 2. Team & Data (`/husker-team-data`)
Purpose: Operator view for stats, standings, and sensor health.

Highlights
- **Profile tables** for Nebraska and the upcoming opponent, rendered with table rows instead of unordered bullet lists for faster scanning.
- **Color swatches** convert hex strings (primary/secondary colors discovered from TeamTracker attributes) into live chips with the hex code beside a colored square.
- **Series summary** placeholder driven by `sensor.husker_team` attributes when ESPN provides historical matchup text.
- **Raw sensor reference** using entity rows for `sensor.husker_team` attributes; helps validate that the TeamTracker integration is populating data.
- **Big Ten standings markdown card** built from the new ESPN Core API feed (`sports.core.api.espn.com/v2/.../groups/5/standings/0`). Each row displays overall and conference records in a markdown table.
- **Tailgate countdown** uses the effective kickoff helper to stay aligned with manual overrides.

Usage Notes
- When colors are missing from ESPN data, fallback Scarlet & Cream palette values populate the color chips.
- If the standings markdown shows “unavailable,” confirm that the REST sensor `sensor.espn_big_ten_teams` is returning the `standings` attribute (requires the updated package).

### 3. Lighting & Scenes (`/huskers-lighting`)
Purpose: Maintenance console for lighting automations and Husker-specific scenes.

Highlights
- Markdown intro summarising the intent and linking scenes/automations conceptually.
- **Lighting automation list** for baseline daily lighting schedules (sunrise/sunset, monthly patterns).
- **Dynamic scene list** using `custom:auto-entities` so transient snapshot scenes (e.g., `scene.huskers_before_chase`) only appear when available.

Usage Notes
- Because snapshot scenes (`scene.huskers_before_chase`, `scene.huskers_before_burst`) only exist while a show is running, the auto-entities card hides them after restarts to avoid “entity not available.”

## Operations Checklist
- Use **Refresh Game Data** before kickoff or when ESPN phases feel stale.
- Toggle `input_boolean.huskers_test_mode` to simulate game phases without waiting for live data.
- Monitor `binary_sensor.huskers_light_show_active` while running lighting scripts; the sidebar icon warns if shows fail to shut down post-game.
- Validate the Big Ten standings table weekly during the season; ESPN occasionally changes payload structure—adjust `packages/huskers_everything.yaml` accordingly.

## Troubleshooting
- If the TeamTracker card fails to load, verify the resource URL (`/hacsfiles/teamtracker-card/ha-teamtracker-card.js`) and clear the Lovelace cache (refresh with Ctrl+Shift+R).
- Missing logos or color swatches often mean ESPN returned `None`; check Home Assistant logs for REST errors and rerun the refresh buttons.
- Incorrect kickoff countdown usually points to the manual override toggles—confirm `input_boolean.huskers_use_manual_kickoff` is set as expected.

## Related Documentation
- [Husker LED MQTT Controls](../lighting/husker-led-mqtt.md)
- [Automation Catalog – Huskers Package](../../reference/automations.md#huskers-package-packageshuskers_everythingyaml)
- [Huskers Dashboard History](../../explanation/huskers-dashboard-history.md)
