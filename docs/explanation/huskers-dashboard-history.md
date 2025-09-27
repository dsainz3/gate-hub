---
title: Huskers Dashboard History
summary: Rationale behind consolidating Huskers dashboards and related clean-up actions.
status: active
category: explanation
updated: 2025-09-27
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

1. **Consolidated Dashboards**
   - Kept `dashboards/huskers-teamtracker.yaml` as the primary dashboard
   - Merged useful controls from `huskers-auto.yaml` into the teamtracker dashboard
   - Removed redundant dashboard files

2. **Removed Files**
   - `dashboards/huskers-all.yaml` - Basic version, functionality covered by teamtracker
   - `dashboards/huskers-dashboard.yaml` - Older version using individual sensors
   - `dashboards/huskers-auto.yaml` - Automation controls merged into teamtracker
   - `ui-lovelace/huskers.yaml` - Legacy UI template

3. **File Structure**
   - Primary dashboard: `dashboards/huskers-teamtracker.yaml`
   - Core configuration: `packages/huskers_everything.yaml`
   - Lovelace config: `lovelace/huskers.yaml`

4. **Key Components**
   - Team Tracker card for game info display
   - Quick refresh controls for data updates
   - Light show control buttons
   - Game phase-specific automations

## References
- Main configuration is in `packages/huskers_everything.yaml`
- Dashboard layout is defined in `dashboards/huskers-teamtracker.yaml`
