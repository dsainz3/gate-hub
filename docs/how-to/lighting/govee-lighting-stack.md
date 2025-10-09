---
title: Govee Lighting Stack
summary: Pair the HACS Govee integration with the Govee2MQTT bridge and Mosquitto broker.
status: active
category: how-to
updated: 2025-09-28
owner: lighting-team
tags:
  - govee
  - mqtt
  - hacs
  - lighting
---

# Govee Lighting Stack

This guide documents how we run Govee lighting (and the seasonal Tree) in Home Assistant using three coordinated pieces:

- **HACS Govee integration** (`https://github.com/LaggAt/hacs-govee`) for REST polling, effect metadata, and diagnostics.
- **Govee2MQTT Supervisor add-on** for low-latency LAN control and MQTT discovery.
- **Mosquitto broker** as the shared message bus, with credentials held in `secrets.yaml`.

The combination gives us redundant control paths—cloud-backed API plus the LAN bridge—while maintaining a single entity set in Home Assistant.

## Architecture Overview

```
Govee Cloud  ──► HACS Govee Integration
                    │
LAN Devices ──► Govee2MQTT Add-on ──► Mosquitto Broker ──► Home Assistant MQTT integration
                    │                                                 │
                    └──────────────────── entity discovery & state ───┘
```

- The HACS integration supplies official entity metadata (names, effect lists, diagnostics) via REST polling every 10 seconds (`delay` in the config entry).
- Govee2MQTT publishes instant LAN state updates and commands through Mosquitto using the MQTT credentials defined in `secrets.yaml` (`mqtt_username` / `mqtt_password`).
- Home Assistant merges both sources under the `light.*` entities listed in `.storage/core.entity_registry` (see the verification section below).

## Prerequisites

- Home Assistant OS 16.x with Supervisor and Advanced Mode enabled.
- [HACS](https://hacs.xyz/docs/setup/prerequisites) installed.
- Mosquitto broker and Govee2MQTT add-ons available in the Add-on Store.
- At least one Govee lighting device on the same network.
- Govee account credentials and REST API key (create at <https://developer.govee.com/>).

> Use the existing how-to guides for baseline setup: [Mosquitto](../addons/mqtt.md) and [Govee2MQTT](../addons/govee2mqtt.md).

## Step 1 – Store MQTT Secrets

Hold broker credentials in `secrets.yaml` so both YAML and UI-based integrations refer to the same values:

```yaml
mqtt_username: mqtt
mqtt_password: REPLACE_WITH_STRONG_PASSWORD
```

These keys already exist in this repository; update the password locally if it changes. Avoid committing real secrets.

## Step 2 – Wire Mosquitto to Home Assistant

1. Install and start the **Mosquitto broker** add-on.
2. Add the MQTT integration via **Settings → Devices & Services → Add Integration → MQTT**. If auto-discovery fails, use:
   - Broker: `core-mosquitto`
   - Port: `1883`
   - Username / Password: `!secret mqtt_username` and `!secret mqtt_password`
3. (Optional) Mirror the connection in YAML:

   ```yaml
   mqtt:
     broker: core-mosquitto
     port: 1883
     username: !secret mqtt_username
     password: !secret mqtt_password
   ```

4. Subscribe to `homeassistant/#` in **Developer Tools → MQTT** to verify the broker responds.

## Step 3 – Configure the Govee2MQTT Bridge

Follow the [Govee2MQTT add-on playbook](../addons/govee2mqtt.md) with these project-specific notes:

- In the add-on configuration UI, set the MQTT section to match the secrets above:

  ```yaml
  mqtt:
    host: core-mosquitto
    port: 1883
    username: mqtt
    password: ${MQTT_PASSWORD}
  ```

  Replace `${MQTT_PASSWORD}` with the actual password—Supervisor add-ons cannot read `!secret`. Keep the value synced with `secrets.yaml` manually.
- Enable both LAN and IoT modes when you need cloud-only devices (purifiers) alongside LAN-capable lights:

  ```yaml
  enable_lan: true
  enable_iot: true
  prefer_lan: true
  ```

- Supply `govee_email`, `govee_password`, and optional `govee_api_key` directly in the add-on UI. Restart after saving and check the log for `MQTT connected` and `Home Assistant discovery queued` lines.

## Step 4 – Install the HACS Govee Integration

1. Open **HACS → Integrations → ⋮ → Custom repositories**.
2. Add `https://github.com/LaggAt/hacs-govee` with category **Integration**.
3. Back in HACS, search for **Govee**, install the integration, and restart Home Assistant when prompted.
4. Go to **Settings → Devices & Services → Add Integration → Govee** (from HACS). When the config flow prompts:
   - Enter the REST API key. Record it in a local password manager; optionally add `govee_rest_api_key: YOUR_KEY` to `secrets.yaml` for reference (not read automatically).
   - Leave the poll delay at `10` seconds unless API limits are hit.
5. Confirm the integration card shows **1 device, N entities** matching your fleet.

The configuration data is stored in `.storage/core.config_entries` under the `domain: "govee"` entry. Changing the API key later re-runs the auth step.

## Step 5 – Wire the Kiosk Dashboard

The refreshed `dashboards/kiosk-dashboard.yaml` relies entirely on stock Lovelace cards so it works out of the box on a clean Home Assistant install. Each view now uses a three-column layout:

1. **Snapshot** – left column provides sanitation, agenda, and quick tiles; the middle column hosts an “Overrides & Testing” stack with manual holiday/Huskers toggles plus a status entities card; the right column mirrors automation diagnostics.
2. **Control** – grouped light and switch controls rendered with `tile` cards.
3. **Humidor** – gauges, history charts, and control tiles for the cigar cabinet.

Example fragment:

```yaml
# Overrides stack in dashboards/kiosk-dashboard.yaml
- type: vertical-stack
  cards:
    - type: markdown
      content: "## Overrides & Testing"
    - type: grid
      columns: 2
      square: false
      cards:
        - type: tile
          entity: input_boolean.holiday_mode_manual
          name: Holiday Mode Override
          icon: mdi:calendar-star
        - type: tile
          entity: input_boolean.huskers_automations_enabled
          name: Huskers Automations Enabled
          icon: mdi:bullhorn
```

- Because only built-in cards are used, there are no Lovelace resource entries to manage for the kiosk dashboard.
- After editing the YAML, a normal browser refresh is enough—no cache purge is typically required.

## Step 6 – Verify Unified Entities

Use this `jq` command (from `/config`) to list every entity tied to the Govee config entry `01K684EHN5KW6ED0GDXBZFF0J9` plus its device metadata:

```bash
jq --slurp --arg entry "01K684EHN5KW6ED0GDXBZFF0J9" '.[0] as $entities | .[1] as $devices | ($entities.data.entities | map(select(.config_entry_id == $entry))) as $filtered | ($devices.data.devices | map({id,name,area_id,manufacturer,model})) as $devs | $filtered | map({entity_id, original_name, device: ($devs[]? | select(.id == .device_id))})' .storage/core.entity_registry .storage/core.device_registry
```

Expected highlights:

- Lights such as `light.livingroom_light` map to physical devices discovered via Govee2MQTT (`manufacturer: "Govee"`).
- Group entities (e.g., `light.mainfloor_lights`) live in `light.yaml` and combine the individual devices for kiosk control.

If entities are missing, restart the add-on and re-run the command. Clearing retained MQTT discovery topics (`homeassistant/gv2mqtt/.../config`) forces a fresh publish.

## Ongoing Maintenance

- **Monthly**: Check HACS for updates to the Govee integration and restart Home Assistant after upgrading.
- **Quarterly**: Update the Govee2MQTT add-on and confirm LAN discovery still reaches every device.
- **Secrets hygiene**: Rotate the MQTT password (`mqtt_password` in `secrets.yaml`) and update the add-on UI accordingly.
- **Backup**: Include `.storage/` and `secrets.yaml` in full supervisor snapshots before major upgrades.

## Troubleshooting

- **Entities duplicated** – Delete old `light.*` entries tied to legacy integrations, then reload MQTT discovery.
- **Color controls missing in the UI** – Tile cards expose on/off, brightness, and colour temperature by default. For RGB colour pickers, expose the entity through the standard light more-info dialog or layer in a custom card if needed.
- **MQTT auth failures** – Re-enter credentials in the add-on UI and the MQTT integration; inspect the Mosquitto log for `Connection Refused` codes.
- **API quota exceeded** – Increase the poll `delay` in the Govee integration configuration or temporarily disable the cloud path and rely on the LAN bridge.

## References

- HACS repository: <https://github.com/LaggAt/hacs-govee>
- Lovelace tile reference: <https://www.home-assistant.io/dashboards/tile/>
- Govee2MQTT project: <https://github.com/wez/govee2mqtt>
- Mosquitto add-on docs: [docs/how-to/addons/mqtt.md](../addons/mqtt.md)
- Govee2MQTT add-on guide: [docs/how-to/addons/govee2mqtt.md](../addons/govee2mqtt.md)
