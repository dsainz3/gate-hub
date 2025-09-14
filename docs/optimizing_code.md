# Home Assistant Optimization Plan – gate-hub

This document outlines the current repository strengths, identified optimization opportunities, and a step-by-step plan to implement improvements.
It is designed to serve as a **living document** in your repo (`HA_Optimization_Plan.md`) and will guide you through changes, GitHub workflow, and Home Assistant updates.

---

## 📌 Current Repo Strengths

### Organization
- **Modular structure** – using `packages/` for feature-specific configs (e.g., Huskers automation).
- **File separation** – clear split of `automations.yaml`, `scripts.yaml`, `sensor.yaml`, dashboards, etc.
- **Documentation** – `README.md` is structured and easy to follow.
- **Version control** – proper Git workflow with CI/CD.

### Code Quality
- **Pre-commit hooks** – `yamllint`, `prettier`, `black`, `flake8`.
- **CI pipeline** – YAML config validation + pre-commit.
- **Custom components** – documented integrations (BLE monitor, Govee, etc.).

### Advanced Features
- **Custom dashboards** – multiple specialized dashboards (Huskers HQ, LED Test, etc.).
- **Template sensors** – advanced templating for game status/countdowns.
- **Complex automations** – Huskers game-day automations with proper state handling.

---

## 🎯 Priority Optimization Recommendations

| Priority | Impact | Effort | Items |
|----------|--------|--------|-------|
| **P0**   | High   | Low    | Database optimization, Logger config |
| **P1**   | High   | Medium | System monitoring, MQTT enhancement |
| **P2**   | Medium | Low    | Backup automation, Secrets structure |
| **P3**   | Medium | Medium | Zigbee2MQTT tuning, Template organization |
| **P4**   | Low    | Medium | System Performance dashboard, Huskers fade optimization |

---

## 🪵 Branching Strategy

We will use **Trunk-based Development** with **short-lived topic branches**.
Each PR will be small, focused, and deleted after merge.

**Branch list:**
- `chore/recorder-opts` (P0)
- `chore/logger-opts` (P0)
- `feat/system-monitoring` (P1)
- `feat/mqtt-enh` (P1)
- `chore/backup-automation` (P2)
- `chore/secrets-structure` (P2)
- `feat/zigbee2mqtt-tuning` (P3)
- `chore/templates-split` (P3)
- `feat/perf-dashboard` (P4)
- `feat/huskers-optimizations` (P4)

---

## 🤖 GitHub CI/CD Plan

### Updated Workflow (`.github/workflows/ci.yml`)
Poetry is used for dependency management:

```yaml
name: Home Assistant CI

on:
  pull_request:
    branches: [ main ]
    paths:
      - "**/*.yaml"
      - "**/*.yml"
      - ".pre-commit-config.yaml"
      - "pyproject.toml"
      - "poetry.lock"
  push:
    branches: [ main ]

jobs:
  pre-commit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install Poetry
        run: pipx install poetry
      - name: Configure Poetry
        run: poetry config virtualenvs.create false
      - name: Install dependencies
        run: poetry install --no-interaction --no-root
      - name: Run pre-commit
        run: poetry run pre-commit run --all-files

  ha-config-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create secrets stub
        run: cp secrets.example.yaml secrets.yaml || true
      - name: YAML lint
        run: poetry run yamllint -s .
      - name: HA config check
        run: |
          docker run --rm -v "$PWD":/config ghcr.io/home-assistant/home-assistant:stable \
            python -m homeassistant --script check_config --config /config
🛠 Diff-Ready Patches
Below are minimal diffs to apply per branch.

P0 – Recorder
diff
Copy
Edit
--- a/configuration.yaml
+++ b/configuration.yaml
@@
+recorder:
+  db_url: !secret db_url
+  purge_keep_days: 14
+  auto_purge: true
+  exclude:
+    domains:
+      - automation
+      - script
+      - scene
+    entity_globs:
+      - sensor.*_uptime
+      - sensor.*_last_boot
+      - binary_sensor.*_connectivity
+    entities:
+      - sensor.date
+      - sensor.time
P0 – Logger
diff
Copy
Edit
--- a/configuration.yaml
+++ b/configuration.yaml
@@
+logger:
+  default: warning
+  logs:
+    homeassistant.core: info
+    homeassistant.components.mqtt: warning
+    custom_components.ble_monitor: info
+    custom_components.govee: warning
P1 – System Monitor Sensors
diff
Copy
Edit
--- a/sensor.yaml
+++ b/sensor.yaml
@@
+- platform: systemmonitor
+  resources:
+    - type: disk_use_percent
+      arg: /
+    - type: memory_use_percent
+    - type: processor_use
+    - type: last_boot
+
+- platform: uptime
+  unit_of_measurement: hours
P1 – MQTT Performance
diff
Copy
Edit
--- a/configuration.yaml
+++ b/configuration.yaml
@@
+mqtt:
+  sensor:
+    - name: "MQTT Performance"
+      state_topic: "system/performance"
+      json_attributes_topic: "system/performance"
+      value_template: "{{ value_json.status | default('unknown') }}"
P2 – Backup Automation
diff
Copy
Edit
--- a/automations.yaml
+++ b/automations.yaml
@@
+- id: system_daily_backup
+  alias: "System: Daily Backup"
+  trigger:
+    - platform: time
+      at: "02:00:00"
+  action:
+    - service: backup.create
+      data:
+        name: "Automated Backup {{ now().strftime('%Y-%m-%d') }}"
+    - service: persistent_notification.create
+      data:
+        title: "Backup Completed"
+        message: "Daily backup completed successfully."
P2 – Example Secrets
diff
Copy
Edit
--- /dev/null
+++ b/secrets.example.yaml
@@
+db_url: "postgresql://ha_user:ha_pass@192.168.1.10/homeassistant"
+weather_api_key: "replace_me"
+govee_api_key: "replace_me"
+teamtracker_api_key: "replace_me"
+mqtt_username: "mqtt_user"
+mqtt_password: "replace_me"
+mqtt_broker: "192.168.1.11"
P3 – Zigbee2MQTT Advanced
diff
Copy
Edit
--- a/zigbee2mqtt/configuration.yaml
+++ b/zigbee2mqtt/configuration.yaml
@@
-advanced:
-  log_level: info
+advanced:
+  log_level: warn
+  last_seen: ISO_8601
+  legacy_api: false
+  debounce: 0.5
+  cache_state: true
+  availability_timeout: 60
P3 – Templates Split
diff
Copy
Edit
--- a/configuration.yaml
+++ b/configuration.yaml
@@
+template: !include_dir_merge_list templates/
File: templates/huskers.yaml

yaml
Copy
Edit
template:
  - trigger:
      - platform: state
        entity_id: sensor.huskers_next_game
    sensor:
      - name: "Huskers Game Countdown (hrs)"
        unit_of_measurement: "hours"
        state: >
          {% set gt = as_timestamp(states('sensor.huskers_next_game')) %}
          {% set nt = as_timestamp(now()) %}
          {% if gt and gt > nt %}
            {{ ((gt - nt) / 3600) | round(1) }}
          {% else %}0{% endif %}
P4 – Performance Dashboard
File: ui-lovelace/views/40_system_performance.yaml

yaml
Copy
Edit
title: System Performance
icon: mdi:chip
type: masonry
cards:
  - type: gauge
    name: CPU
    entity: sensor.processor_use
    min: 0
    max: 100
    severity: { green: 0, yellow: 60, red: 80 }
  - type: history-graph
    hours_to_show: 24
    entities:
      - sensor.memory_use_percent
      - sensor.processor_use
  - type: entities
    title: Uptime & Disk
    entities:
      - sensor.uptime
      - sensor.disk_use_percent
      - sensor.last_boot
P4 – Huskers Fade Script
diff
Copy
Edit
--- a/scripts.yaml
+++ b/scripts.yaml
@@
+util_fade_color_optimized:
+  alias: 'Util: Optimized Fade to Color'
+  mode: parallel
+  max: 20
+  fields:
+    light: {}
+    h: {}
+    s: {}
+    brightness: {}
+    transition: {}
+    predim_pct: {}
+    predim_hold: {}
+  sequence:
+    - service: light.turn_on
+      data:
+        entity_id: "{{ light }}"
+        brightness_pct: "{{ predim_pct | int(10) }}"
+        transition: 0.1
+    - delay: "{{ predim_hold | float(1) }}"
+    - service: light.turn_on
+      data:
+        entity_id: "{{ light }}"
+        hs_color: [ "{{ h | int }}", "{{ s | int }}" ]
+        brightness: "{{ brightness | int(255) }}"
+        transition: "{{ transition | float(3) }}"
🧾 Implementation Roadmap
Week 1
Branch: chore/recorder-opts, chore/logger-opts

Apply P0 patches, validate via CI and HA config check.

Week 2
Branch: feat/system-monitoring, feat/mqtt-enh

Add system sensors and MQTT performance, confirm dashboard entities.

Week 3
Branch: chore/secrets-structure, chore/backup-automation

Add secrets.example.yaml, backup automation, verify backup runs nightly.

Week 4
Branch: feat/zigbee2mqtt-tuning, chore/templates-split

Tune Z2M advanced config, move Huskers template to templates/.

Week 5
Branch: feat/perf-dashboard, feat/huskers-optimizations

Add new dashboard view and optimized fade script.

✅ Success Metrics
Startup time (before/after P0).

Database growth (recorder cleanup).

Memory & CPU usage (via new sensors).

Automation latency (logbook monitor).

System stability (fewer forced restarts).
