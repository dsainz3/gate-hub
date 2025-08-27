# UI Lovelace Dashboard

This directory contains a copy-and-paste friendly view for Home Assistant dashboards managed through the UI.

## Huskers Fan Zone View

To add the Huskers Fan Zone to a UI dashboard:

1. Place `www/huskers_logo.svg` in your Home Assistant `config/www` folder.
2. In Home Assistant, open your dashboard, choose **Edit Dashboard**, then select **Raw configuration editor**.
3. Append the following snippet under your `views:` list or use it as the entire dashboard configuration:

```yaml
views:
  - title: Huskers – Fan Zone
    path: huskers-fan-zone
    icon: mdi:stadium-variant
    badges: []
    cards:
      - type: markdown
        content: |
          # Go Big Red!
          Welcome to the **Huskers Fan Zone**. Cheer on Nebraska and control game-day lighting.
      - type: picture
        image: /local/huskers_logo.svg
        tap_action:
          action: none
      - type: grid
        columns: 2
        square: false
        cards:
          - type: gauge
            entity: sensor.huskers_our_score
            min: 0
            max: 100
            name: Nebraska
          - type: gauge
            entity: sensor.huskers_opponent_score
            min: 0
            max: 100
            name: Opponent
      - type: entities
        title: Game Info
        state_color: true
        entities:
          - entity: sensor.huskers_game_status
            name: Status
          - entity: sensor.huskers_quarter
            name: Quarter
          - entity: sensor.huskers_game_clock
            name: Clock
          - entity: sensor.huskers_next_game_start
            name: Next Game
      - type: grid
        columns: 3
        square: false
        cards:
          - type: button
            name: Start Show
            icon: mdi:play
            tap_action:
              action: call-service
              service: script.turn_on
              target:
                entity_id: script.huskers_theater_show_start
          - type: button
            name: Touchdown Burst
            icon: mdi:firework
            tap_action:
              action: call-service
              service: script.turn_on
              target:
                entity_id: script.huskers_touchdown_burst
          - type: button
            name: Stop Show
            icon: mdi:stop
            tap_action:
              action: call-service
              service: script.turn_on
              target:
                entity_id: script.huskers_theater_show_stop
```

The snippet above mirrors the contents of `views/40_fan_zone.yaml`, making it easy to import into a UI-managed dashboard.
