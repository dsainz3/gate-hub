# Huskers Home Assistant Package

This package provides all logic and entities needed for the Huskers Lovelace dashboard. It is designed to work with a YAML-mode dashboard (see `lovelace/dashboard_huskers.yaml`).

## Structure

- `automations.yaml` – Huskers automations (add your game logic here)
- `scripts.yaml` – Scripts for LED effects and score updates
- `sensors.yaml` – Template sensors for game data
- `inputs.yaml` – Input helpers for scores, opponent, quarter, etc.
- `scenes.yaml` – (Optional) Scenes for lighting
- `templates.yaml` – (Optional) Additional templates

## Usage

1. **All logic is in this package folder.**
2. **All UI is in `lovelace/dashboard_huskers.yaml`** (not in packages!).
3. Reference the dashboard in your `configuration.yaml`:
   ```yaml
   lovelace:
     mode: yaml
     dashboards:
       huskers:
         mode: yaml
         filename: lovelace/dashboard_huskers.yaml
         title: Huskers
         icon: mdi:football-helmet
         show_in_sidebar: true
   ```
4. All entities referenced in the dashboard are defined in this package.

## Why this structure?
- **Packages** are for logic (entities, automations, scripts, sensors, etc.).
- **Dashboards** are for UI and must be referenced in `lovelace:`.
- This separation ensures maintainability and avoids Home Assistant config errors.

## Next Steps
- Add your automations to `automations.yaml`.
- Expand scripts, sensors, and inputs as needed for your use case.
- Edit the dashboard YAML for UI changes.
