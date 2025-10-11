---
title: Football Team LED MQTT Controls
summary: Deploy and operate the Football Team LED scripts that drive permanent outdoor lighting via MQTT. Filenames retain the original `husker` prefix for compatibility.
status: active
category: how-to
updated: 2025-10-09
owner: playbook-team
tags:
  - mqtt
  - lighting
  - scripts
---

# Football Team LED MQTT Controls

This guide explains how to deploy the Football Team LED scripts that coordinate the permanent outdoor lighting with game-day automations. The scripts live in `packages/huskers_everything.yaml` (name retained) and depend on the [Mosquitto broker](../addons/mqtt.md) being online. Update entity names and MQTT topics to match your installation before going live.

## Prerequisites
- Home Assistant in YAML mode with `homeassistant.packages: !include_dir_merge_named packages` configured.
- MQTT broker configured and reachable.
- Permanent outdoor LED strip entities exposed as `light.permanent_outdoor_lights` (or adjust the script target).

## Deployment Steps

1. **Ensure packages directory is enabled** in `configuration.yaml`:
   ```yaml
   homeassistant:
     packages: !include_dir_merge_named packages
   ```
2. **Place or update** the Football Team package in `packages/huskers_everything.yaml` (see repository for the canonical version).
3. **Reload automations and scripts** after deploying:
   - UI: **Settings → System → Automations & Scenes → Reload Automations** (and Scripts).
   - CLI: `ha core reload`.

## Available Scripts
- `script.husker_led_start` — pushes the scarlet & cream theme via MQTT.
- `script.husker_led_stop` — stops the show and re-applies the monthly effect using `automation.led_monthly_effect_scheduler`.

Use these scripts from the [Football Team dashboards](../football-team/dashboard.md)—the **Lighting & Scenes** view surfaces the key scripts and automations—or via direct service calls. During game-day shows the chase routines hold the permanent LEDs at 100 % brightness while the chase group runs at 80 %, so the strip always punches through exterior ambient light even if indoor fixtures are dimmed.

## Manual Invocation
Trigger from Developer Tools → Services:

```yaml
service: script.turn_on
data:
  entity_id: script.husker_led_start
```

To revert to the monthly effect:

```yaml
service: script.turn_on
data:
  entity_id: script.husker_led_stop
```

## Troubleshooting
- **No response from LEDs** → confirm the MQTT broker is reachable and the light entity supports effects/brightness. Check the add-on logs.
- **Effect unavailable** → verify the monthly effect exists in `light.permanent_outdoor_lights`’ `effect_list`.
- **Automation conflict** → ensure the Husker lighting hold sensors allow the automation (see [Automation Catalog](../../reference/automations.md)).

## Hardening Against Reboots

Home Assistant restarts can leave the permanent strip stuck on its last effect
until the next midnight run. Mirror the production automation so the monthly
effect reapplies as soon as the system comes back online **and** whenever the
light recovers from an MQTT outage:

```yaml
automation:
  - id: exterior_led_monthly_effect
    alias: "LED: Monthly Effect Scheduler"
    trigger:
      - platform: time
        at: "00:00:01"
      - platform: homeassistant
        event: start
      - platform: state
        entity_id: light.permanent_outdoor_lights
        from: "unavailable"
      - platform: state
        entity_id: light.permanent_outdoor_lights
        from: "unknown"
    action:
      - alias: "Wait for the strip to publish effects"
        wait_for_trigger:
          - platform: template
            value_template: >-
              {% set effects = state_attr('light.permanent_outdoor_lights', 'effect_list') or [] %}
              {{ 'LED-August' in effects }}
        timeout: "00:05:00"
        continue_on_timeout: true
      - alias: "Retry until the monthly effect sticks"
        repeat:
          count: 6
          sequence:
            - choose:
                - conditions:
                    - condition: template
                      value_template: >-
                        {% set effects = state_attr('light.permanent_outdoor_lights', 'effect_list') or [] %}
                        {{ 'LED-August' in effects }}
                  sequence:
                    - service: scene.turn_on
                      target:
                        entity_id: scene.lighting_led_effect_august
                      continue_on_error: true
                    - service: light.turn_on
                      target:
                        entity_id: light.permanent_outdoor_lights
                      data:
                        effect: LED-August
                      continue_on_error: true
                    - wait_template: "{{ state_attr('light.permanent_outdoor_lights', 'effect') == 'LED-August' }}"
                      timeout: "00:00:20"
                      continue_on_timeout: true
                    - choose:
                        - conditions:
                            - condition: template
                              value_template: "{{ state_attr('light.permanent_outdoor_lights', 'effect') == 'LED-August' }}"
                          sequence:
                            - stop: "LED monthly effect applied"
                default:
                  - service: homeassistant.update_entity
                    target:
                      entity_id: light.permanent_outdoor_lights
                    continue_on_error: true
            - delay: "00:00:10"
      - condition: template
        value_template: "{{ state_attr('light.permanent_outdoor_lights', 'effect') == 'LED-August' }}"
      - service: logbook.log
        data:
          name: "LED Monthly Effect"
          message: "Applied LED-August after restart"
```

The extra state triggers fire when the MQTT light flips from `unknown`/`unavailable`
to an actual value, so the automation self-heals after a power blip. The retry
loop keeps poking Home Assistant to refresh the effect list and re-apply the
monthly effect up to six times, logging success (or the final skip message)
after each attempt. Adjust the effect name, scene, and retry count to match your
installation.

## Automation Status Audit

The Husker package now exports `sensor.huskers_automation_status_audit`, a
triggered template that runs every five minutes (and on automation reloads) to
snapshot the state, mode, and critical triggers for every football lighting
automation. Its attributes expose a JSON payload listing each automation,
whether it is enabled, and the current value for dependencies such as kickoff
timers, ESPN live flags, and chase loop scripts. The primary state reports `ok`
when everything matches the expected configuration or `issues` if a dependency
falls out of alignment.

Pairing the sensor is `automation.huskers_automation_watchdog_alert`, which
logs a clear message to the Logbook whenever the audit surfaces a disabled
automation or an unexpected mode value. The message mirrors the
`issues_summary` attribute so you can compare the problematic entity IDs
against the live trigger snapshot without digging through YAML.

## Related Docs
- [Husker Dashboard Guide](../huskers/dashboard.md)
- [Automation Catalog](../../reference/automations.md)
- [Mosquitto MQTT Add-on](../addons/mqtt.md)
