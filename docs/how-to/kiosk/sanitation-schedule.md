# Kiosk Sanitation Schedule

This guide documents the Gretna Sanitation integration that feeds the kiosk dashboard with trash, recycling, and yard-waste pickup dates.

## Overview

- **Script**: `/config/scripts/gretna_sanitation.py` computes weekly trash, bi-weekly recycling, and seasonal yard-waste pickups with holiday offsets.
- **Sensors**: Defined in `configuration.yaml` under the `command_line:` domain and exposed via kiosk template sensors (`packages/kiosk.yaml`).
- **Dashboard**: The kiosk dashboard renders a markdown block summarising the next trash and recycling dates.

## Command-line Sensor Setup

The command-line integration executes the schedule script twice per day and stores the JSON payload on `sensor.gretna_sanitation_schedule`.

```yaml
command_line:
  - sensor:
      name: Todo Repo Tracker
      unique_id: todo_repo_tracker
      command: "cat /config/TODO.md"
      scan_interval: 120

  - sensor:
      name: Gretna Sanitation Schedule
      unique_id: kiosk_gretna_sanitation_schedule
      command: "/config/scripts/gretna_sanitation.py"
      scan_interval: 21600
      value_template: "{{ value_json.status | default('error') }}"
      json_attributes:
        - generated_at
        - reference_date
        - trash
        - recycling
        - yard_waste
        - metadata
```

The script itself can be tested manually with:

```bash
python /config/scripts/gretna_sanitation.py --reference-date 2025-05-20
```

Use the optional `--reference-date` flag to validate holiday shifts and season boundaries.

## Kiosk Template Sensors

`packages/kiosk.yaml` exposes user-friendly entities that read from the command-line sensor:

- `sensor.kiosk_trash_pickup`
- `sensor.kiosk_recycling_pickup`
- `sensor.kiosk_yard_waste_pickup`
- `binary_sensor.kiosk_sanitation_feed_ok`
- `sensor.kiosk_yard_waste_in_season`

These provide the next pickup dates, holiday delay flags, and season windows consumed by the dashboard.

## Dashboard Markdown Card

`dashboards/kiosk-dashboard.yaml` includes a top-row markdown card titled **Sanitation Schedule**:

```yaml
- type: markdown
  content: |
    ### Sanitation Schedule
    {% set trash = states('sensor.kiosk_trash_pickup') %}
    {% set trash_day = state_attr('sensor.kiosk_trash_pickup', 'pickup_weekday') %}
    {% set recycle = states('sensor.kiosk_recycling_pickup') %}
    {% set recycle_day = state_attr('sensor.kiosk_recycling_pickup', 'pickup_weekday') %}
    - **Trash:** {% if trash not in ['unknown', 'unavailable', '', none] %}{{ trash }}{% if trash_day and trash_day not in ['unknown','unavailable'] %} ({{ trash_day }}){% endif %}{% else %}Pending…{% endif %}
    - **Recycling:** {% if recycle not in ['unknown', 'unavailable', '', none] %}{{ recycle }}{% if recycle_day and recycle_day not in ['unknown','unavailable'] %} ({{ recycle_day }}){% endif %}{% else %}Pending…{% endif %}
```

The card updates automatically once the command-line sensor populates.

## Validation Steps

1. Reload Home Assistant or the command-line integration.
2. Confirm `sensor.gretna_sanitation_schedule` reports `ok` and exposes attributes.
3. Verify kiosk sensors show actual dates instead of `unknown`.
4. Refresh the kiosk dashboard to see the Sanitation Schedule markdown card.

When adding future cards, keep this block near the top of the Snapshot view to preserve the high-level overview.
