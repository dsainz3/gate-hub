---
title: Huskers Automation History
summary: Archived record of the Huskers football game-day automation flow, preserved for operators who need to reference the legacy enable/disable window or earlier lighting routines.
status: archived
category: archive
updated: 2024-05-30
owner: automation-team
---

# Huskers Automation History

This archived note captures the major iterations of the Huskers game-day automation stack. Use it to understand why the current configuration relies on manual game mode control, a single-lap chase, and a 20-minute postgame restoration instead of the older enable/disable windows.

## 2023–2024 Season (Legacy Window)

- **Automation window**: `automation.huskers_game_mode_enable_window` and `automation.huskers_game_mode_disable_window` automatically toggled `input_boolean.huskers_game_mode` around kickoff using ESPN pregame/live signals, manual overrides, and countdown windows.
- **Lighting hold**: `binary_sensor.huskers_lighting_hold` asserted whenever the countdown entered the 20-minute window, throughout the live game, and for 20 minutes after postgame, preventing evening lighting schedules from reclaiming fixtures.
- **Postgame cleanup**: `automation.huskers_postgame_cleanup` fired when ESPN dropped out of postgame, immediately stopping chase loops and restoring snapshots regardless of how long celebrations lasted.

## 2024 Refresh (Manual Control + Cool-down)

- **Manual game mode**: Operators now flip `input_boolean.huskers_game_mode` directly; the automation window was removed to avoid false positives from ESPN schedule drift and manual test scenarios.
- **Single-shot chase**: `automation.huskers_showtime_at_t_20` triggers once when the countdown hits T‑20, stops any lingering speed loop, runs `script.huskers_chase30_start`, waits 50 seconds, and calls `script.huskers_chase30_stop` so the dual-cream chase completes exactly one 45 second lap.
- **Focused lighting hold**: `binary_sensor.huskers_lighting_hold` only stays on while a show script is active, the manual color show toggle is set, or within three minutes of the last chase/burst trigger, allowing normal evening automations to resume sooner.
- **20-minute restoration**: `automation.huskers_postgame_cleanup` now waits for `binary_sensor.huskers_is_postgame_espn` to stay on for 20 minutes (or for game mode to remain off for 20 minutes), then restores the pre-chase snapshots and permanent LED effect, covering extended celebrations without manual intervention.

Keep this page around when you need to compare legacy behaviour during incident reviews or when backporting fixes to historical branches. For the active configuration, see the [Automation Catalog](../reference/automations.md) and the [Football Team LED MQTT guide](../how-to/lighting/husker-led-mqtt.md).
