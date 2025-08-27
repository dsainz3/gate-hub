# Huskers Dashboard Modularization and Refactor

## Overview
This document explains the refactor of the Huskers Lovelace dashboard to follow Home Assistant best practices for modular, maintainable, and scalable configuration.

## Changes Made

1. **Created a new branch:**
   - `refactor/huskers-dashboard-modular` for all changes.

2. **Modularized Dashboard Views:**
   - Split the dashboard into three separate YAML files under `lovelace/`:
     - `huskers_led_test.yaml` (LED Test view)
     - `huskers_hq.yaml` (HQ/game data view)
     - `huskers_controls.yaml` (Controls view)

3. **Created a master dashboard YAML:**
   - `lovelace/huskers_dashboard.yaml` now includes all views using `!include`.
   - This file is the entry point for the dashboard in YAML mode.

4. **Best Practice Structure:**
   - All dashboard views are now easy to edit, maintain, and extend.
   - Each view is self-contained and can be versioned or reused.
   - The main dashboard file is concise and readable.

5. **How to Use:**
   - In Home Assistant, set the dashboard to YAML mode and point to `lovelace/huskers_dashboard.yaml`.
   - Edit or add views by creating new YAML files in the `lovelace/` directory and including them in the main dashboard YAML.

6. **Notes:**
   - Lint errors about missing entities/scripts are warnings that those entities must exist in your Home Assistant instance for the dashboard to function fully.
   - No changes were made to the logic or appearance of the dashboard—only the structure was improved.
7. **Added Fan Zone View:**
   - `views/50_fan_zone.yaml` introduces a playful Huskers dashboard with score gauges and quick lighting controls.
   - For UI-managed dashboards, copy the snippet from `../ui-lovelace/views/40_fan_zone.yaml` via the Raw configuration editor.

## Directory Structure Example

```
config/
  lovelace/
    huskers_dashboard.yaml
    huskers_led_test.yaml
    huskers_hq.yaml
    huskers_controls.yaml
```

---

For further modularization, you can split cards or even card groups into their own files and use `!include` as needed.
