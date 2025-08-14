# Govee in Home Assistant — Local‑First with Govee2MQTT
_Last updated: 2025-08-14_

This guide walks a beginner from zero to working **Govee lights and purifiers** in Home Assistant (HAOS) using the **Govee2MQTT** add‑on. We use **LAN** for lights where possible (fast, local), and enable **IOT (cloud websocket)** only for devices that need it (e.g., purifiers).

- Govee2MQTT project: https://github.com/wez/govee2mqtt
- Govee Developer Platform (API key & docs): https://developer.govee.com/
- (Optional) Passive BLE Monitor (BLE sensors): https://custom-components.github.io/ble_monitor/

> You don’t need the official “Govee (cloud)” HACS integration for this flow, but it can coexist if you want redundancy.

---

## Prerequisites
- HAOS with **Mosquitto broker** add‑on installed and the **MQTT** integration connected
- Your Govee account email & password (for IOT websocket; required for purifiers)
- (Optional) Your **Govee API key** (from the Govee Home app) for richer metadata/effects
- Advanced Mode enabled on your HA user

---

## Step 1 — Install the Govee2MQTT add‑on
1. **Settings → Add‑ons → Add‑on Store** → search **Govee to MQTT** → **Install**.
2. Open **Configuration** and start with LAN‑only:
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
3. **Start** the add‑on and check the **Log** for:
   - “Starting LAN discovery …”
   - “MQTT connected … Connection Accepted”

Lights that support the **Govee LAN API** should appear as MQTT devices in HA.

---

## Step 2 — Add IOT (cloud websocket) for purifiers
Some Govee devices (e.g., purifiers) need the IOT websocket to function. Enable it:

```yaml
enable_iot: true
govee_email: "you@example.com"
govee_password: "REPLACE_ME"
# If your account uses MFA and the add‑on supports it:
# govee_mfa_token: "123456"
```

(Optional but useful) Add your **Govee API key** for better metadata/effects:
```yaml
govee_api_key: "gv-REPLACE_WITH_YOUR_API_KEY"
```

**Save** and **Restart** the add‑on. In the **Log**, look for an **IOT connected/authenticated** line. Then, in **Developer Tools → MQTT**, listen to `homeassistant/#` and restart the add‑on once more to see new `/config` discovery messages. Your purifiers should now appear under **Settings → Devices & Services → MQTT → Devices**.

> Note on secrets: Supervisor add‑on options **do not** support `!secret`. Keep credentials in the add‑on UI (they are not committed to your Git repo). You *can* also store them in `/config/secrets.yaml` for reference, but the add‑on won’t read them from there.

---

## Step 3 — Verify control & typical entities
- Lights: `light.*` entities with brightness, color/temperature, and (often) effect lists
- Purifiers: `switch.*` or `fan.*` / `sensor.*` entities for power, mode, fan speed, and filter life (varies by model)

Use **Developer Tools → States** to find the entities by name and test **Service** calls (e.g., `light.turn_on`, `fan.set_percentage`).

---

## Step 4 — Optional extras
- **Passive BLE Monitor** for BLE‑only sensors: install via HACS, then “Add Integration” → Passive BLE Monitor; sensors appear automatically
- **HACS Govee (cloud) integration** can coexist, but pick **one source of truth** per device in your automations to avoid conflicts

---

## Troubleshooting
- **Purifier not appearing**  
  Double‑check `enable_iot: true` and the correct Govee email/password. Power‑cycle the device. Check the add‑on log for “unsupported device”.

- **Effects list missing**  
  Add your `govee_api_key` to help fetch metadata. Some models expose fewer effects over cloud vs. LAN.

- **No MQTT discovery messages**  
  Ensure the MQTT integration is connected; in Developer Tools → MQTT listen to `homeassistant/#` and restart the add‑on.

---

## Appendix — Quick reference
- Govee2MQTT (project & docs): https://github.com/wez/govee2mqtt
- Govee Developer Platform / API key: https://developer.govee.com/
- Passive BLE Monitor docs: https://custom-components.github.io/ble_monitor/
