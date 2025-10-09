---
title: Nmap Tracker Debugging
summary: Enable verbose logging and capture diagnostics for the Home Assistant Nmap device tracker.
status: active
category: how-to
updated: 2025-02-15
owner: network-team
tags:
  - nmap
  - device-tracker
  - home-assistant
---

# Nmap Tracker Debugging

Use this runbook to turn on debug logging for the built-in Nmap tracker integration, verify that scans run on schedule, and collect evidence when discovery fails.

## Prerequisites
- Home Assistant OS or Supervised installation with access to `configuration.yaml`.
- Nmap Tracker integration already configured (UI or YAML).
- File editor, SSH, or Studio Code Server add-on for editing and log retrieval.

## Procedure

### 1. Enable debug logging for Nmap
1. Open `/config/configuration.yaml`.
2. Locate the existing `logger:` block and ensure it includes the Nmap tracker modules:

   ```yaml
   logger:
     default: warning
     logs:
       homeassistant.components.device_tracker.nmap_tracker: debug
       homeassistant.components.nmap_tracker: debug
   ```

   > These entries sit alongside other debug loggers. Keep `default: warning` so the rest of the system stays quiet.

3. Save the file and **restart Home Assistant** (Settings → System → Restart) so the new log level applies.

### 2. Confirm the integration loads
1. After the restart, open **Settings → Devices & Services → Integrations**.
2. Make sure the **Nmap Tracker** card shows as **Configured**.
3. If the integration is missing, re-add it with the correct host range (e.g., `172.16.0.1-172.16.3.254` for a `/22`) and scan interval.

### 3. Inspect the logs
1. Navigate to **Settings → System → Logs**, or download `/config/home-assistant.log` via the file editor/SSH.
2. Filter for `nmap` to see each scheduled run. Typical debug lines include:
   - The exact Nmap command Home Assistant executed.
   - Any devices discovered on the scan.
   - Warnings about hosts that timed out or could not be reached.
3. Errors like `Failed to locate nmap binary`, `Timed out waiting for results`, or permission issues point to OS-level problems (missing Nmap package, firewall rules, or VLAN isolation). Resolve those, then rerun the scan.

### 4. Trigger an on-demand refresh (optional)
1. Go to **Developer Tools → Services**.
2. Call `homeassistant.update_entity` with the target `device_tracker.*` entity to force an immediate scan between scheduled runs.
3. Check the log again for a fresh Nmap command invocation.

## Expected results
- Debug entries appear for every scheduled or manual scan.
- The integration logs at least one discovered device when the network range is reachable.
- Any failures surface as explicit debug or error messages you can attach to support requests.

## Next steps
- Use the device tracker entities in dashboards once they report devices.
- Disable the debug log entries (comment them out) after troubleshooting to reduce log churn.
- For router-based fallbacks, review the TP-Link router and Deco how-to guides in this documentation set.
