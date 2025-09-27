---
title: Govee2MQTT Add-on
summary: Connect Govee lights and purifiers to Home Assistant using the community Govee2MQTT add-on.
status: active
category: how-to
updated: 2025-09-27
owner: lighting-team
tags:
  - govee
  - mqtt
  - addons
---

# Govee2MQTT Add-on

Use this playbook to integrate Govee lighting and air purifiers with Home Assistant via the community-driven Govee2MQTT add-on.

## Prerequisites
- Mosquitto broker installed and integrated (see [Mosquitto guide](mqtt.md)).
- Advanced Mode enabled for your Home Assistant user.
- Govee account email/password for the IOT websocket and (optionally) a Govee API key for richer metadata.

## Install and Configure

### 1. Install the add-on
1. Go to **Settings → Add-ons → Add-on Store**.
2. Search for **Govee to MQTT** and click **Install**.
3. In **Configuration**, start with LAN-only settings:
   ```yaml
   temperature_scale: F
   enable_lan: true
   enable_iot: false
   prefer_lan: true
   homeassistant_discovery: true
   retain_discovery: true
   publish_state_updates: true
   persist_state: true
   cache_ttl_seconds: 900
   log_level: info
   ```
4. Start the add-on and watch the **Log** for messages such as “Starting LAN discovery …” and “MQTT connected … Connection Accepted”.

### 2. Enable IOT for non-LAN devices (optional)
Some devices (e.g., purifiers) require the cloud websocket.

```yaml
enable_iot: true
govee_email: "you@example.com"
govee_password: "REPLACE_ME"
#govee_mfa_token: "123456"  # if MFA is enabled and supported
#govee_api_key: "gv-REPLACE_WITH_YOUR_API_KEY"
```

Restart the add-on after updating credentials. Check the log for a successful websocket connection, then restart once more while listening to `homeassistant/#` in **Developer Tools → MQTT** to confirm discovery payloads arrive.

> Supervisor add-on options cannot read `!secret`. Keep credentials in the add-on UI (they are not committed). Optionally mirror them in `secrets.yaml` for human reference only.

## Verify Entities
- Lights should appear as `light.*` entities with brightness, colour temperature, and effect lists where supported.
- Purifiers typically surface as `fan.*`, `switch.*`, and supporting `sensor.*` entities for filter life and mode.

Test from **Developer Tools → States** or call services such as `light.turn_on` and `fan.set_percentage` to confirm control.

## Optional Enhancements
- Install **Passive BLE Monitor** via HACS for BLE-only sensors, then add the integration; entities will surface automatically.
- Retain the official “Govee (cloud)” integration only if you require redundancy—avoid mixing entity sources in automations.

## Troubleshooting
- **Purifier missing** → verify `enable_iot: true`, credentials, and device support in the add-on log; power-cycle the device.
- **No effect list** → supply your `govee_api_key` so the add-on can fetch extended metadata.
- **No MQTT discovery payloads** → confirm the Mosquitto integration is connected and restart the add-on while listening on `homeassistant/#`.

## Resources
- Project docs: <https://github.com/wez/govee2mqtt>
- Govee developer portal: <https://developer.govee.com/>
- Passive BLE Monitor docs: <https://custom-components.github.io/ble_monitor/>
- Example configuration: [govee2mqtt.options.example.yaml](govee2mqtt.options.example.yaml)
