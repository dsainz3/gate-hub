---
title: Huskers Dashboard History
summary: Rationale behind consolidating Huskers dashboards and related clean-up actions.
status: active
category: explanation
updated: 2025-10-09
owner: huskers-team
tags:
  - huskers
  - dashboards
  - history
---

# Huskers Dashboard Cleanup

## Overview

This document summarizes the cleanup of redundant Husker dashboard configurations to improve maintainability and reduce confusion.

## Changes Made

1. **Consolidated Dashboards (2024)**
   - Kept `dashboards/huskers-teamtracker.yaml` as the primary dashboard
   - Merged useful controls from `huskers-auto.yaml` into the teamtracker dashboard
   - Removed redundant dashboard files

2. **Removed Files**
   - `dashboards/huskers-all.yaml` – Basic version, functionality covered by teamtracker
   - `dashboards/huskers-dashboard.yaml` – Older version using individual sensors
   - `dashboards/huskers-auto.yaml` – Automation controls merged into teamtracker
   - `ui-lovelace/huskers.yaml` – Legacy UI template

3. **File Structure**
   - Primary dashboard: `dashboards/huskers-teamtracker.yaml`
   - Core configuration: `packages/huskers_everything.yaml`
   - Lovelace include set: `lovelace/huskers.yaml`

4. **2025 Enhancements**
   - Split dashboard into **Game Day**, **Team & Data**, and **Lighting & Scenes** views for clearer separation of duties.
   - Adopted the TeamTracker custom card and vendored resource (`www/community/teamtracker-card/ha-teamtracker-card.js`) for the hero game panel.
   - Replaced legacy Big Ten standings scrape with ESPN’s Core API (`sports.core.api.espn.com/v2/.../groups/5/standings/0`) and rendered it as a markdown table.
- Rebuilt team/opponent profiles as table-based cards with live color swatches derived from TeamTracker attributes.
- Switched scene listings to `custom:auto-entities` so snapshot scenes appear only while active, reducing Lovelace errors after restarts.
- Countdown cards now rely on `sensor.huskers_kickoff_in_effective`, respecting manual overrides from `input_boolean.huskers_use_manual_kickoff`.
- Removed the bespoke markdown scoreboard in favor of the TeamTracker hero card plus a lean pregame stack.
- Introduced `binary_sensor.huskers_tailgate_window` to gate the countdown (24 h pre-kickoff through 30 min post-game) and trimmed the in-game markdown to football-specific data shown only during live play.

5. **Key Components (current)**
   - TeamTracker card for game info display
   - Quick refresh controls for data updates
   - Lighting macros (chase, burst, restore) tied into Huskers scripts
   - Big Ten standings + matchup metadata sourced from updated ESPN feeds

## References
- Main configuration is in `packages/huskers_everything.yaml`
- Dashboard layout is defined in `dashboards/huskers-teamtracker.yaml`
