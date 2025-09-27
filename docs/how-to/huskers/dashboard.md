---
title: Huskers Dashboard Guide
summary: Configure and operate the Huskers-focused Lovelace dashboards.
status: active
category: how-to
updated: 2025-09-27
owner: huskers-team
tags:
  - lovelace
  - huskers
  - dashboards
---

# Huskers Dashboard Guide

This guide documents the Huskers dashboards delivered in `dashboards/huskers-teamtracker.yaml`. Pair it with the [Automation Catalog](../../reference/automations.md) and [Husker LED MQTT controls](../lighting/husker-led-mqtt.md) when troubleshooting.

## Theme Requirements
- Apply the `Huskers Cream` theme (defined in `themes.yaml`).
- Reload themes after deployment via **Developer Tools → YAML → Reload themes** so the `--huskers-*` CSS variables are available.
- Reference palette variables (e.g., `var(--huskers-scarlet)`) in custom cards to stay consistent.

## Dashboards & Views

### 1. Husker LED Test (`/husker-led-test`)
**Purpose**: Sandbox for LED MQTT validation and scoring test scripts.

**Key elements**
- Entity card exposing `script.huskers_test_our_score`, `script.huskers_test_opponent_score`, `input_text.huskers_last_score`, and `sensor.huskers_last_score_test`.
- Buttons to start/stop the Husker LED sequence (ties into `automation.exterior_led_monthly_effect`).
- History graph + logbook (last 6 hours) for quick validation of light shows.

### 2. Huskers HQ (`/huskers-hq`)
**Purpose**: Fan-facing game-day experience.

**Sections**
- **Header quick glance**: `binary_sensor.huskers_game_in_progress_tt`, `sensor.huskers_kickoff_in`, and `sensor.huskers_last_score_test`.
- **Dynamic game panel** (visible when game live): opponent, kickoff status, pre/postgame windows.
- **Countdown stack**: opponent card, kickoff time, and gauge visual.
- **Fan mode controls**: scripts for touchdown bursts and LED triggers plus score entities.
- **Team snapshot & controls**: debug toggles, timing inputs, scenes (`scene.huskers_scarlet_theater`, etc.).
- **Husker News iframe** and 6-hour logbook to track automation activity.

### 3. Huskers Controls (`/huskers-controls`)
**Purpose**: Operator cockpit for toggling scenes, scripts, and automations.

**Sections**
- **Scenes**: `scene.huskers_scarlet_theater`, `scene.huskers_cream_theater`, `scene.govee_to_mqtt_one_click_default_husker_game`.
- **Scripts**: start/stop LED, touchdown burst, test score scripts.
- **Automations**: enable switches and “run now” buttons for the Huskers automations listed in the reference catalog.

## Usage Tips
- Treat **HQ** as the default fan view; keep it presentable during game windows.
- Use **Controls** for staging, testing, and manual overrides.
- Use **LED Test** before match day to ensure MQTT connectivity and animations are ready.

## Roadmap
- Integrate live game tracking sensors once upstream data is production-ready.
- Add theme automation that flips to Huskers branding automatically when `binary_sensor.huskers_game_in_progress_tt` is `on`.
- Expand the LED section as the [Husker LED MQTT controls](../lighting/husker-led-mqtt.md) evolve.
