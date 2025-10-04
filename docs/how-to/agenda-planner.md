---
title: Configure Agenda Planner Calendars & Todo Lists
summary: Step-by-step guide to create a dedicated calendar and to-do list entities for the Agenda Planner package via Home Assistant UI.
status: active
category: how-to
updated: 2025-10-05
owner: platform-team
tags:
  - agenda
  - todo
  - home-assistant
---

# Configure Agenda Planner Calendars & Todo Lists

The Agenda Planner scripts expect an existing `calendar` entity for events and a `todo` list entity for tasks. Follow the steps below using the Home Assistant UI (HAOS client or web browser).

## 1. Create a Household Calendar

1. Open **Settings → Devices & Services → + Add Integration**.
2. Search for **Local Calendar** (built-in) and click **Local Calendar**.
3. Provide a name such as `Household Agenda`. Home Assistant will create an entity like `calendar.household_agenda`.
4. Optional: add a description, set the color, and click **Submit**.
5. Confirm the entity ID and copy it; you will paste it into `input_text.agenda_planner_calendar_entity` later.

> **Tip:** If you already sync another calendar (Google, Microsoft, etc.), you can use that existing entity instead. The agenda package only needs the entity ID.

## 2. Create a Todo List

1. Navigate to **Settings → Devices & Services → + Add Integration** again.
2. Search for **Todo List** and choose **Todo list (built-in)**.
3. Enter a name such as `Household Tasks`. Home Assistant generates an entity like `todo.household_tasks`.
4. Press **Submit** to finish. Copy the entity ID for the next step.

> **Note:** Home Assistant also supports third-party todo providers (e.g., CalDAV, Microsoft To Do). Any `todo.*` entity works with the Agenda Planner scripts.

## 3. Map Entities to the Agenda Planner Helpers

1. Go to **Settings → Devices & Services → Helpers**.
2. Locate the following helpers created by `packages/agenda_planner.yaml`:
   - `Agenda Planner Calendar Entity` (`input_text.agenda_planner_calendar_entity`)
   - `Agenda Planner Task List Entity` (`input_text.agenda_planner_task_list_entity`)
3. Edit each helper and paste the entity ID from steps 1 and 2 (for example, `calendar.household_agenda` and `todo.household_tasks`). Save changes.

## 4. (Optional) Add Lovelace Controls

Use the sample card layout from [Agenda Planner Reference](../reference/agenda-planner.md#related-dashboard-idea) to drop the helpers and scripts onto a dashboard. Once the helpers hold the correct entity IDs, the buttons will create events and tasks immediately.

## 5. Test the Flow

1. Enter a sample event title, adjust the start/end, and tap **Agenda Planner – Add Calendar Event**.
2. Enter a sample task and tap **Agenda Planner – Add Task**.
3. Verify the new event appears under **Calendar**, and the task under **To-do list**.
4. Clear the sample items if desired.

You're now ready to use the Agenda Planner from any Home Assistant client.
