---
title: Mosquitto MQTT Add-on
summary: Install, configure, and verify the Mosquitto broker for Home Assistant OS.
status: active
category: how-to
updated: 2025-09-27
owner: integrations-team
tags:
  - mqtt
  - addons
  - home-assistant
---

# Mosquitto MQTT Add-on

This guide walks through installing the official Mosquitto broker add-on, wiring it to Home Assistant, and validating end-to-end messaging.

## Prerequisites
- Home Assistant OS with Supervisor and Advanced Mode enabled.
- Optional: Studio Code Server add-on for editing files.
- Decide on a dedicated MQTT user/password (store credentials in `secrets.yaml`, not in git).

## Procedure

### 1. Install the add-on
1. Open **Settings → Add-ons → Add-on Store**.
2. Search for **Mosquitto broker** and click **Install**.
3. (Optional) Review the **Configuration** tab. Defaults suit most deployments.
4. Start the add-on and confirm the status turns to **Running**.

### 2. Create an MQTT user (optional but recommended)
1. Navigate to **Settings → People → Users**.
2. Add a service account such as `addons` with a strong password.

### 3. Configure the MQTT integration
1. Go to **Settings → Devices & Services → Add Integration → MQTT**.
2. If the broker is not auto-discovered, set:
   - **Broker**: `core-mosquitto`
   - **Port**: `1883`
   - **Username/Password**: your MQTT user
3. Submit and verify the card shows **Connected**.

### 4. Optional YAML declaration
Store credentials in `secrets.yaml`:

```yaml
mqtt_username: addons
mqtt_password: REPLACE_ME
```

Then append to `configuration.yaml` if you prefer YAML-managed integrations:

```yaml
mqtt:
  broker: core-mosquitto
  port: 1883
  username: !secret mqtt_username
  password: !secret mqtt_password
```

Avoid configuring MQTT via both UI and YAML unless the values match.

## Verification
1. Open **Developer Tools → MQTT** (requires Advanced Mode).
2. Subscribe to `homeassistant/#`.
3. Restart an MQTT client (e.g., Zigbee2MQTT). You should see retained discovery messages and state updates.

## Hardening & Operations
- Keep port `1883` limited to the LAN; do not expose it publicly.
- Use dedicated credentials per client where feasible.
- Take snapshots before major configuration changes (`Settings → System → Backups`).
- Document retention topics or custom ACLs in an ADR if you deviate from defaults.

## Troubleshooting
- **Integration shows “Disconnected”** — re-enter broker host `core-mosquitto`, confirm the add-on is running, and validate credentials.
- **No messages** — ensure a publisher is online, confirm Advanced Mode, and re-check the MQTT listen tool.
- **Duplicate entities** — clear retained discovery topics for the device (`homeassistant/.../config`) and restart the publisher.

## Related Resources
- Home Assistant MQTT docs: <https://www.home-assistant.io/integrations/mqtt/>
- Eclipse Mosquitto: <https://mosquitto.org/>
- Public test broker: <https://test.mosquitto.org/>
- For Govee devices, continue with the [Govee2MQTT guide](govee2mqtt.md).
