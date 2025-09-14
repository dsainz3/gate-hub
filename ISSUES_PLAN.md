# GitHub Issues Plan – HA Optimizations

This file contains ready-to-paste GitHub Issue descriptions for each optimization branch.
Each issue should be opened in GitHub with the noted **branch**, **labels**, and **milestone**.

---

## Issue: P0 – Recorder Optimization
**Branch:** `chore/recorder-opts`
**Labels:** `priority:P0`, `area:recorder`
**Milestone:** P0 – Core Performance

### Summary
Implement recorder database optimization with PostgreSQL, reduced purge days, and excluded entities.

### Tasks
- [ ] Add `recorder:` block to `configuration.yaml`
- [ ] Use `db_url: !secret db_url`
- [ ] Set `purge_keep_days: 14`
- [ ] Exclude noisy sensors (`uptime`, `last_boot`, `connectivity`)
- [ ] Validate with `poetry run pre-commit` and HA config check

### Acceptance Criteria
- [ ] CI passes
- [ ] HA config check passes
- [ ] Database size growth reduced
- [ ] Manual validation confirms logs are clean

---

## Issue: P0 – Logger Optimization
**Branch:** `chore/logger-opts`
**Labels:** `priority:P0`, `area:logger`
**Milestone:** P0 – Core Performance

### Summary
Add logger configuration to reduce log noise and improve debugging clarity.

### Tasks
- [ ] Add `logger:` block to `configuration.yaml`
- [ ] Default level = `warning`
- [ ] Lower specific integrations (core=info, ble_monitor=info, govee=warning, mqtt=warning)
- [ ] Validate with `poetry run pre-commit`

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Logs reduced to manageable volume

---

## Issue: P1 – System Monitoring Sensors
**Branch:** `feat/system-monitoring`
**Labels:** `priority:P1`, `area:monitoring`
**Milestone:** P1 – Monitoring & MQTT

### Summary
Add system monitoring sensors (CPU, memory, disk, uptime) to track HAOS performance.

### Tasks
- [ ] Add `systemmonitor` block to `sensor.yaml`
- [ ] Add `uptime` sensor
- [ ] Commit changes on new branch
- [ ] Validate with `poetry run pre-commit` and HA config check

### Acceptance Criteria
- [ ] CI passes
- [ ] Sensors available in HA
- [ ] CPU/memory metrics visible in Developer Tools

---

## Issue: P1 – MQTT Performance Sensor
**Branch:** `feat/mqtt-enh`
**Labels:** `priority:P1`, `area:mqtt`
**Milestone:** P1 – Monitoring & MQTT

### Summary
Add a lightweight MQTT performance sensor to monitor broker/system status.

### Tasks
- [ ] Add `mqtt.sensor` block in `configuration.yaml`
- [ ] Configure to listen on `system/performance`
- [ ] Validate config
- [ ] Publish test messages to confirm sensor updates

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Sensor shows status when MQTT message is published

---

## Issue: P2 – Backup Automation
**Branch:** `chore/backup-automation`
**Labels:** `priority:P2`, `area:backup`
**Milestone:** P2 – Backup & Secrets

### Summary
Automate daily full backups at 2 AM with notifications.

### Tasks
- [ ] Add automation to `automations.yaml`
- [ ] Schedule trigger at `02:00:00`
- [ ] Use `backup.create` service
- [ ] Notify via persistent_notification (extend later to mobile app)

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Backup appears in Supervisor Backups
- [ ] Notification triggered after backup

---

## Issue: P2 – Secrets Example Stub
**Branch:** `chore/secrets-structure`
**Labels:** `priority:P2`, `area:secrets`
**Milestone:** P2 – Backup & Secrets

### Summary
Provide a `secrets.example.yaml` file for CI parseability and onboarding.

### Tasks
- [ ] Create `secrets.example.yaml`
- [ ] Include placeholders for `db_url`, API keys, MQTT creds
- [ ] Ensure CI copies to `secrets.yaml` during checks
- [ ] Validate CI run

### Acceptance Criteria
- [ ] CI passes with stub
- [ ] No sensitive values committed
- [ ] Onboarding doc updated if needed

---

## Issue: P3 – Zigbee2MQTT Advanced Tuning
**Branch:** `feat/zigbee2mqtt-tuning`
**Labels:** `priority:P3`, `area:zigbee`
**Milestone:** P3 – Zigbee & Templates

### Summary
Tune Zigbee2MQTT advanced config for better performance and stability.

### Tasks
- [ ] Update `zigbee2mqtt/configuration.yaml`
- [ ] Set log_level=warn, last_seen=ISO_8601, debounce=0.5, cache_state=true
- [ ] Adjust frontend port if necessary
- [ ] Confirm Zigbee channel avoids Wi-Fi overlap

### Acceptance Criteria
- [ ] CI passes
- [ ] Z2M restarts successfully
- [ ] Devices report state normally
- [ ] Reduced log noise

---

## Issue: P3 – Template Split (Huskers Countdown)
**Branch:** `chore/templates-split`
**Labels:** `priority:P3`, `area:templates`
**Milestone:** P3 – Zigbee & Templates

### Summary
Move heavy Huskers countdown template to `templates/huskers.yaml`.

### Tasks
- [ ] Add `template: !include_dir_merge_list templates/` in `configuration.yaml`
- [ ] Create `templates/huskers.yaml`
- [ ] Move Huskers countdown template sensor
- [ ] Validate template loads correctly

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Huskers countdown sensor still updates correctly

---

## Issue: P4 – System Performance Dashboard
**Branch:** `feat/perf-dashboard`
**Labels:** `priority:P4`, `area:dashboard`
**Milestone:** P4 – Dashboards & Huskers

### Summary
Add a new Lovelace dashboard view to display system performance.

### Tasks
- [ ] Create `ui-lovelace/views/40_system_performance.yaml`
- [ ] Add gauge (CPU), history-graph (memory, CPU), entities (uptime, disk)
- [ ] Commit and test
- [ ] Validate view loads in HA

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Dashboard view visible
- [ ] Sensors show correct data

---

## Issue: P4 – Huskers Optimized Fade Script
**Branch:** `feat/huskers-optimizations`
**Labels:** `priority:P4`, `area:husker`
**Milestone:** P4 – Dashboards & Huskers

### Summary
Add optimized fade-to-color script for Huskers effects.

### Tasks
- [ ] Add `util_fade_color_optimized` script in `scripts.yaml`
- [ ] Configure parallel mode, max=20
- [ ] Support pre-dim hold + transition
- [ ] Test with porch lights

### Acceptance Criteria
- [ ] CI passes
- [ ] Config check passes
- [ ] Script runs without error
- [ ] Smooth transition observed in lights
