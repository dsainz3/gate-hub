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

## Related Docs
- [Husker Dashboard Guide](../huskers/dashboard.md)
- [Automation Catalog](../../reference/automations.md)
- [Mosquitto MQTT Add-on](../addons/mqtt.md)
