---
title: Holiday Mode Reference
summary: Entities and configuration that control holiday-aware behaviour across lighting, climate, and safety automations.
status: active
category: reference
updated: 2025-10-07
owner: automation-team
tags:
  - home-assistant
  - holidays
---

# Holiday Mode Reference

The holiday package centralises the signal Home Assistant uses to pause daily routines while keeping Huskers game-day flows untouched. Use this page to confirm entity names, data sources, and the manual override helper.

## Calendar Source
- **Integration**: [ICS Calendar custom integration](https://github.com/franc6/ics_calendar) installed under `custom_components/ics_calendar`.
- **Entity**: `calendar.us_federal_holidays` *(managed via Settings → Devices & Services → ICS Calendar)*.
- **Feed**: Google public US holiday calendar (`https://calendar.google.com/calendar/ical/en.usa%23holiday%40group.v.calendar.google.com/public/basic.ics`).
- **Behaviour**: All-day holiday events surface as `on` during their occurrence; attributes expose `message`, `start_time`, and `end_time` consumed by the template sensors below.

## Manual Overrides
- **Helper**: `input_boolean.holiday_mode_manual` *(friendly name: Holiday Mode Override)*.
- **Use**: Toggle from any dashboard to simulate a holiday or test automation behaviour. When set to `on`, it forces Holiday Mode regardless of the calendar state.

## Derived Entities (`packages/holidays.yaml`)
- **`binary_sensor.holiday_mode_active`** – master flag the automations read. Turns `on` when either the holiday calendar is active or the manual override is enabled. Attributes include:
  - `holiday_source`: `manual`, `calendar`, or `none`.
  - `active_holiday`: Name of the active holiday or `Manual Override` when forced.
  - `active_until`: Calendar event end timestamp when available.
- **`sensor.next_us_holiday`** – friendly name and start/end timestamps for the next scheduled holiday event.

## Automation Contract
- Lighting, LED, climate, and safety routines in `automations.yaml` include a guard requiring `binary_sensor.holiday_mode_active = off` so daily schedules pause on holidays. Huskers game automations intentionally ignore this guard to keep game-day lighting intact.
- When adding new automations that should observe the holiday schedule, include:
  ```yaml
  condition:
    - condition: state
      entity_id: binary_sensor.holiday_mode_active
      state: 'off'
  ```
  Add any Husker exclusions as separate conditions.

## Operational Checklist
1. Confirm `calendar.us_federal_holidays` exists after each Home Assistant upgrade; re-add through the UI if necessary.
2. Surface `input_boolean.holiday_mode_manual`, `binary_sensor.holiday_mode_active`, and `sensor.next_us_holiday` on test dashboards for quick visibility.
3. When a new holiday calendar is needed, add it via the ICS Calendar UI flow; update this page with the new entity IDs.
