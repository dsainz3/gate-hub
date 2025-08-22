# Huskers Home Assistant Package

This document describes the structure and purpose of the Huskers package for Home Assistant.

## Overview
The Huskers package provides input helpers, scripts, and automations to support game-day lighting, score tracking, and special effects for Nebraska Huskers events.

## Structure

- **input_number.yaml**, **input_text.yaml**, **input_boolean.yaml**: Define input helpers used for tracking scores, game status, and controlling effects.
- **scripts.yaml**: Contains scripts for starting/stopping effects, touchdown bursts, and test actions.
- **automations.yaml**: (Not shown here) Should contain automations for pregame, postgame, and score-based triggers.
- **scenes.yaml**: (Not shown here) Should define lighting scenes for Huskers events.

## Example Entities

### Input Helpers
- `input_number.huskers_our_score`: Nebraska's score
- `input_number.huskers_opponent_score`: Opponent's score
- `input_number.hail_varsity_bpm`: BPM for Hail Varsity effect
- `input_number.beats_per_color`: Beats per color for effects
- `input_text.huskers_opponent_name`: Opponent name
- `input_text.huskers_quarter`: Game quarter
- `input_text.huskers_game_clock`: Game clock
- `input_text.huskers_game_status`: Game status
- `input_text.huskers_last_score`: Last score (test)
- `input_boolean.huskers_color_show`: Toggle for Huskers color show

### Scripts
- `script.huskers_led_gameday_start`: Start game-day lighting effect
- `script.huskers_led_stop`: Stop effect and restore previous state
- `script.huskers_led_revert_monthly`: Revert to monthly effect
- `script.huskers_touchdown_burst`: Play touchdown burst effect
- `script.huskers_update_last_score_test`: Test script to update last score

## Usage
- Use the input helpers to track and control game state and effects.
- Use the scripts in automations or via dashboard buttons to trigger lighting and effects.
- Automations and scenes should reference these helpers and scripts for full functionality.

## Validation
- Run `ha core check` to validate YAML structure.
- All helpers and scripts must be defined under their correct integration key at the top level of each package file.

---

For more details, see the individual YAML files in `packages/huskers/`.
# Huskers Home Assistant Package

This package provides all logic and entities needed for the Huskers Lovelace dashboard. It is designed to work with a YAML-mode dashboard (see `lovelace/dashboard_huskers.yaml`).

## Structure

- `automations.yaml` – Huskers automations (add your game logic here)
- `scripts.yaml` – Scripts for LED effects and score updates
- `sensors.yaml` – Template sensors for game data
- `input_number.yaml` – Input numbers for scores and effect timing
- `input_text.yaml` – Input texts for opponent, quarter, status, etc.
- `input_boolean.yaml` – Input booleans for toggling effects
- `scenes.yaml` – (Optional) Scenes for lighting
- `templates.yaml` – (Optional) Additional templates

## Usage

1. **All logic is in this package folder.**
2. **All UI is in `lovelace/dashboard_huskers.yaml`** (not in packages!).
3. Reference the dashboard in your `configuration.yaml`:
   ```yaml
   lovelace:
     mode: yaml
     dashboards:
       huskers:
         mode: yaml
         filename: lovelace/dashboard_huskers.yaml
         title: Huskers
         icon: mdi:football-helmet
         show_in_sidebar: true
   ```
4. All entities referenced in the dashboard are defined in this package.

## Why this structure?
- **Packages** are for logic (entities, automations, scripts, sensors, etc.).
- **Dashboards** are for UI and must be referenced in `lovelace:`.
- This separation ensures maintainability and avoids Home Assistant config errors.

## Next Steps
- Add your automations to `automations.yaml`.
- Expand scripts, sensors, and inputs as needed for your use case.
- Edit the dashboard YAML for UI changes.
