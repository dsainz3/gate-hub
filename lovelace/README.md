# Huskers Team Tracker Lovelace Notes

This directory keeps legacy modular Lovelace views around for reference. The active Huskers dashboard now lives in [`dashboards/huskers-teamtracker.yaml`](../dashboards/huskers-teamtracker.yaml) and is declared from `configuration.yaml` under `lovelace.dashboards`.

## Current Architecture (2025 refresh)

- **Views**: Game Day, Team & Data, Lighting & Scenes. The YAML file defines each view inline for easier reasoning about cross-card variables.
- **Hero card**: Uses the TeamTracker custom card (`www/community/teamtracker-card/ha-teamtracker-card.js`) vendored into the repo and loaded via `lovelace.resources`.
- **Standings**: Big Ten markdown card subscribes to the ESPN Core API standings endpoint (configured in `packages/huskers_everything.yaml`).
- **Profiles**: Nebraska and opponent tables render color swatches from TeamTracker attributes with graceful fallbacks to Scarlet & Cream.
- **Scenes card**: `custom:auto-entities` hides snapshot scenes when they do not exist, keeping Lovelace error-free after restarts.

## Legacy Modular Views

The `views/*.yaml` files under this folder show an earlier modular approach that split LED Test, HQ, and Controls into separate include files. They remain for inspiration but are not referenced by the production dashboard.

To experiment with an include-based layout again, point a YAML dashboard at `lovelace/huskers_dashboard.yaml` and selectively include the desired view files.
