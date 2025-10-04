---
title: Agenda Planner Package
summary: Overview of the agenda_planner package for creating calendar events and tasks via Home Assistant.
status: active
category: reference
updated: 2025-10-05
owner: platform-team
tags:
  - agenda
  - todo
  - home-assistant
---

# Agenda Planner

The `agenda_planner` package bundles helpers, scripts, and template sensors so family members can create calendar events and to‑do items straight from the Home Assistant UI (mobile or kiosk). It relies on native Home Assistant `calendar` and `todo` integrations, so you can point it at any configured entity.

## Entities Provided

| Domain | Entity | Purpose |
| ------ | ------ | ------- |
| `input_text` | `agenda_planner_calendar_entity` | Stores the default calendar entity ID (e.g. `calendar.household_agenda`). |
| `input_text` | `agenda_planner_event_title` / `agenda_planner_event_description` | Capture event summary and optional notes before submission. |
| `input_datetime` | `agenda_planner_event_start` / `agenda_planner_event_end` | Date/time pickers used by the event script. |
| `input_select` | `agenda_planner_event_category` | Quick category tag to include in the notification message. |
| `input_text` | `agenda_planner_task_list_entity`, `agenda_planner_task_title`, `agenda_planner_task_notes` | Manage the target todo list and task metadata. |
| `input_datetime` | `agenda_planner_task_due` | Task due date/time. |
| `input_boolean` | `agenda_planner_task_all_day` | Toggle to treat the task due date as all-day. |
| `input_select` | `agenda_planner_task_priority` | Maps to the `todo.add_item` priority field. |
| `script` | `script.agenda_planner_add_event` | Validates inputs and calls `calendar.create_event`. |
| `script` | `script.agenda_planner_add_task` | Validates inputs and calls `todo.add_item`. |
| `sensor` | `sensor.agenda_planner_summary` | Shows how many calendars/lists are available, plus the next event and open task count. |
| `sensor` | `sensor.agenda_planner_entities` | Helper sensor exposing available calendar and todo entity IDs for the scripts. |

Automations inside the package seed default start/end times on HA start, auto-extend the end time if a user picks a start in the past, and normalize the due date when the all-day toggle is enabled.

## Usage Workflow

1. Update `input_text.agenda_planner_calendar_entity` and `input_text.agenda_planner_task_list_entity` once with the entity IDs you want to target (see [Creating the calendar and list](../how-to/agenda-planner.md)).
2. Add the helpers and scripts to a Lovelace dashboard (e.g. Mushroom form cards or built-in `input` cards).
3. Users fill in the title, optionally adjust dates/times, and press the corresponding script button to create the event or task.
4. Confirmation arrives via `persistent_notification.create`; adjust the script if you prefer mobile push or another channel.

## Refresh Defaults

If the helper fields ever fall out of sync, run the `Agenda Planner – Refresh Defaults On Startup` automation manually (or restart Home Assistant) to restore time pickers and blank the text fields.

## Related Dashboard Idea

A simple Lovelace layout:

```yaml
- type: vertical-stack
  cards:
    - type: entities
      title: Quick Event
      entities:
        - input_text.agenda_planner_event_title
        - input_text.agenda_planner_event_description
        - input_datetime.agenda_planner_event_start
        - input_datetime.agenda_planner_event_end
        - input_select.agenda_planner_event_category
        - script.agenda_planner_add_event
    - type: entities
      title: Quick Task
      entities:
        - input_text.agenda_planner_task_title
        - input_text.agenda_planner_task_notes
        - input_datetime.agenda_planner_task_due
        - input_boolean.agenda_planner_task_all_day
        - input_select.agenda_planner_task_priority
        - script.agenda_planner_add_task
```

Customize the cards (Mushroom, button, or form cards) to match your dashboard styling.

## Task list limitations

The built-in Home Assistant todo list integration currently ignores priority values. The `agenda_planner_add_task` script sends the summary, description, and due date/time only; adjust the script if you migrate to a provider that supports priorities.
