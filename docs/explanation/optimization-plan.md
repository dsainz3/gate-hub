---
title: Optimization Plan
summary: Strategy and roadmap for evolving the gate-hub Home Assistant deployment.
status: active
category: explanation
updated: 2025-09-27
owner: platform-team
tags:
  - roadmap
  - optimization
  - home-assistant
---

# Home Assistant Optimization Plan – gate-hub

This document outlines the current repository strengths, identified optimization opportunities, and a step-by-step plan to implement improvements.
It is designed to serve as a **living document** in your repo (`HA_Optimization_Plan.md`) and will guide you through changes, GitHub workflow, and Home Assistant updates.

---

## 📌 Current Repo Strengths

### Organization
- **Modular structure** – using `packages/` for feature-specific configs (e.g., the Football Team automation bundle).
- **File separation** – clear split of `automations.yaml`, `scripts.yaml`, `sensor.yaml`, dashboards, etc.
- **Documentation** – `README.md` is structured and easy to follow.
- **Version control** – proper Git workflow with CI/CD.

### Code Quality
- **Pre-commit hooks** – `ruff`, `prettier`, `yamllint`, plus helpers for whitespace and HA config checks.
- **CI pipeline** – YAML config validation + pre-commit.
- **Custom components** – documented integrations (BLE monitor, Govee, etc.).

### Advanced Features
- **Custom dashboards** – multiple specialised dashboards (Football Team HQ, LED test lab, etc.).
- **Template sensors** – advanced templating for game status/countdowns.
- **Complex automations** – Football Team game-day automations with proper state handling.

---

## 🎯 Priority Optimization Recommendations

| Priority | Impact | Effort | Items |
|----------|--------|--------|-------|
| **P0**   | High   | Low    | Database optimization, Logger config |
| **P1**   | High   | Medium | System monitoring, MQTT enhancement |
| **P2**   | Medium | Low    | Backup automation, Secrets structure |
| **P3**   | Medium | Medium | Zigbee2MQTT tuning, Template organization |
| **P4**   | Low    | Medium | System Performance dashboard, Football Team fade optimisation |

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
- `feat/football-team-optimizations` (P4)

---

## 🤖 GitHub CI/CD Plan

### Current Workflows
- **`.github/workflows/ci.yml`** runs two jobs:
  - **`ruff`** installs Python 3.11 with pip caching enabled, restores a dedicated Ruff cache, installs Ruff via pip, and runs both `ruff check` and `ruff format --check` against the repository.
  - **`precommit`** also uses Python 3.11 with pip caching and a pre-commit cache, installs `pre-commit`, skips Ruff hooks (handled earlier), and executes the remaining hooks for YAML formatting, whitespace hygiene, and the Home Assistant config check wrapper.
- **`.github/workflows/ha-config-check.yaml`** focuses on validating the Home Assistant configuration: it checks out the repository, sets up Python 3.11 with pip caching, installs `homeassistant` and `pytest`, prepares a temporary `secrets.yaml` from `.ci/fakesecrets.yaml`, runs `hass --script check_config`, optionally executes pytest-based integration checks, uploads log artifacts, and cleans up generated files.
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
P2 – Secrets Hygiene
- Keep `.ci/fakesecrets.yaml` aligned with the keys required by CI and local development.
- Store real secrets only in `secrets.yaml` on your Home Assistant host; avoid adding template files to version control.
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
P3 – Template Organization
- Review `templates.yaml` and determine whether high-traffic sensors (e.g., Football Team game countdown) should move into dedicated include files.
- If you adopt `!include_dir_merge_list` patterns, create the backing directories as part of the same change so CI and runtime both load the templates correctly.
P4 – Performance Dashboard
- Add a dedicated "System Performance" view under `ui-lovelace/` (create the file if it does not exist) highlighting CPU, memory, uptime, and disk usage from the sensors added in P1.
- Combine gauges, history graphs, and entity cards to track trends and expose key metrics at a glance.
P4 – Football Team Fade Script
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

Tune Z2M advanced config, move Football Team template to templates/.

Week 5
Branch: feat/perf-dashboard, feat/huskers-optimizations

Add new dashboard view and optimized fade script.

✅ Success Metrics
Startup time (before/after P0).

Database growth (recorder cleanup).

Memory & CPU usage (via new sensors).

Automation latency (logbook monitor).

System stability (fewer forced restarts).
