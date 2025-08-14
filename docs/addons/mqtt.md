# Mosquitto MQTT Broker (Home Assistant) — Install & Configure
_Last updated: 2025-08-14_

## What MQTT / Mosquitto is (in one minute)
**MQTT** is a lightweight publish/subscribe messaging protocol used by smart-home devices to send and receive data. **Eclipse Mosquitto** is the most widely used, open‑source MQTT broker (server) and is recommended for Home Assistant (HA).

- Home Assistant’s MQTT integration docs (overview & discovery): https://www.home-assistant.io/integrations/mqtt/
- Mosquitto official site: https://mosquitto.org/
- Mosquitto source & public test broker: https://github.com/eclipse/mosquitto  (test broker: https://test.mosquitto.org/)

> In HAOS, the easiest path is the **Mosquitto broker add‑on**, then the **MQTT** integration.

---

## Prerequisites
- Home Assistant OS (with Supervisor)
- You’re signed in with **Advanced Mode** enabled (Profile → toggle on)
- (Optional but helpful) Studio Code Server add‑on for editing files

---

## Step 1 — Install the Mosquitto broker add‑on
1. **Settings → Add‑ons → Add‑on Store** → search **Mosquitto broker** → **Install**.
2. Open the **Configuration** tab:
   - Usually the defaults work; no YAML needed.
   - (Optional) Add a user in **Settings → People → Users** (e.g., `addons`) for MQTT auth.
3. **Start** the add‑on. You should see a green “Running” state.

> Tip: The broker runs at host `core-mosquitto` on port `1883` inside HAOS.

---

## Step 2 — Add the MQTT integration in HA
1. **Settings → Devices & Services → Add Integration → MQTT**.
2. If HA doesn’t auto‑discover the broker, fill in:
   - **Broker**: `core-mosquitto`
   - **Port**: `1883`
   - **Username/Password**: your MQTT user (e.g., `addons` / strong password)
3. After submitting, the MQTT card should show **Connected**.

### (Optional) Declare MQTT in YAML with `secrets.yaml`
Add to `/config/secrets.yaml`:
```yaml
mqtt_username: "addons"
mqtt_password: "REPLACE_ME"
```
Then add to `/config/configuration.yaml`:
```yaml
mqtt:
  broker: core-mosquitto
  port: 1883
  username: !secret mqtt_username
  password: !secret mqtt_password
```

> Don’t configure MQTT **both** via UI and YAML with different values. Pick one.

---

## Step 3 — Verify the pipeline
1. Go to **Developer Tools → MQTT** (appears only with Advanced Mode ON).
2. Under **Listen to a topic**, subscribe to `homeassistant/#`.
3. Restart an MQTT‑speaking add‑on/integration (e.g., Zigbee2MQTT or Govee2MQTT).
4. You should see a burst of retained `.../config` discovery messages and device state.

---

## Step 4 — Best‑practice hardening (quick wins)
- Use a **dedicated user** (e.g., `addons`) with a long password.
- Keep the broker **on your LAN** only (HAOS default); avoid exposing 1883 to the Internet.
- Prefer **MQTT discovery** (retained configs) to keep entities in sync.
- Back up: Add‑ons → Mosquitto → **Snapshots** (or use full HA backups).

---

## Troubleshooting
- **MQTT shows “Disconnected” in the integration**  
  Re‑enter the correct broker host (`core-mosquitto`) and credentials; confirm the Mosquitto add‑on is running.

- **No messages in Developer Tools → MQTT**  
  Ensure **Advanced Mode** is ON. Confirm something is actually publishing (restart Zigbee2MQTT, etc.).

- **Duped or missing entities**  
  Clear retained discovery topics for the device (`homeassistant/.../config`), then restart the publisher.

---

## Further reading
- Home Assistant MQTT docs: https://www.home-assistant.io/integrations/mqtt/
- Mosquitto official site: https://mosquitto.org/
- Mosquitto Docker image & config samples: https://hub.docker.com/_/eclipse-mosquitto
