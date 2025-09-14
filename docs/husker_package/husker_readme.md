# Huskers Dashboard

This document outlines the Huskers-focused Lovelace dashboard configuration.
It is split into **three views**, each with a different purpose.

---

## 1. Husker LED – Test (`/husker-led-test`)

**Purpose:** Validation sandbox for LED MQTT and scoring test scripts.

**Includes:**
- Entity panel with:
  - `script.huskers_test_our_score`
  - `script.huskers_test_opponent_score`
  - `input_text.huskers_last_score`
  - `sensor.huskers_last_score_test`
- Markdown instructions for test usage
- Buttons to:
  - Start Husker LED Effect (`script.husker_led_start`)
  - Stop / Revert to Monthly (`script.husker_led_stop`)
- Related scripts + automation (`automation.exterior_led_monthly_effect`)
- History Graph and Logbook for last 6h activity

---

## 2. Huskers HQ (`/huskers-hq`)

**Purpose:** The main **fan view**, designed for game days and everyday monitoring.

**Key Sections:**
- **Header Quick Glance**
  Horizontal stack showing:
  - `binary_sensor.huskers_game_in_progress_tt` (Game Live)
  - `sensor.huskers_kickoff_in` (Kickoff countdown)
  - `sensor.huskers_last_score_test` (Last score)

- **Markdown Header:** GBR banner with current date/time.

- **Conditional Game Live Panel**
  When `binary_sensor.huskers_game_in_progress_tt` is `on`, shows:
  - Opponent + kickoff status
  - Last score (test)
  - Windows: `binary_sensor.huskers_pregame_window`, `binary_sensor.huskers_postgame_window`

- **Next Game / Countdown**
  Opponent, kickoff, and countdown gauge.

- **Fan Mode Controls**
  - `script.huskers_touchdown_burst`
  - `script.husker_led_start`
  - `script.husker_led_stop`
  - Last Score entities
  - `automation.huskers_update_last_score_test`

- **Team Snapshot / Controls**
  - Debug toggle and timing inputs
  - Scenes: Scarlet Theater, Cream Theater, Govee One-Click Game

- **Husker News** (`iframe: https://huskers.com/news`)
- **Logbook:** Last 6h of Husker activity

---

## 3. Huskers Controls (`/huskers-controls`)

**Purpose:** Centralized action view for **all Husker-related scenes, scripts, and automations**.

**Sections:**
- **Scenes**
  - `scene.huskers_scarlet_theater`
  - `scene.huskers_cream_theater`
  - `scene.govee_to_mqtt_one_click_default_husker_game`

- **Scripts**
  - `script.huskers_touchdown_burst`
  - `script.husker_led_start`
  - `script.husker_led_stop`
  - `script.huskers_test_our_score`
  - `script.huskers_test_opponent_score`

- **Automations**
  - Enable/disable toggles for:
    - `automation.huskers_new_item_notifier`
    - `automation.huskers_postgame_event`
    - `automation.huskers_pregame_event`
    - `automation.huskers_react_to_test_score`
    - `automation.huskers_update_last_score_test`
  - Trigger-now buttons for each of the above

---

## Usage Notes

- **HQ is the main fan-facing view.**
- **Controls is for testing and administration.**
- **LED Test is for MQTT validation and dev work.**
- Entities will evolve as game-tracking sensors are refined (next game data, score updates, etc.).

---

## Next Steps

- Integrate finalized **game tracking sensors** for live scores.
- Add **theme automation** (scarlet & cream takeover) when game starts.
- Hook LED automations into **pregame/postgame windows**.

---
