# Gate Hub Home Assistant Configuration

<!-- Badges -->
[![CI](https://github.com/dsainz3/gate-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/dsainz3/gate-hub/actions/workflows/ci.yml)
![License](https://img.shields.io/github/license/dsainz3/gate-hub)
![Last Commit](https://img.shields.io/github/last-commit/dsainz3/gate-hub)
![Repo Size](https://img.shields.io/github/repo-size/dsainz3/gate-hub)
![Open Issues](https://img.shields.io/github/issues/dsainz3/gate-hub)
![Open PRs](https://img.shields.io/github/issues-pr/dsainz3/gate-hub)
![Code Style: Ruff](https://img.shields.io/badge/code%20style-ruff-1f425f.svg)
![YAML: prettier+yamllint](https://img.shields.io/badge/yaml-prettier%20%2B%20yamllint-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)

Gate Hub contains the reproducible Home Assistant OS configuration that powers a multi-room smart home. It integrates Zigbee, MQTT, TP-Link Deco, BLE sensors, and a Nebraska Huskers game-day experience while remaining portable through automation tooling and documentation.

---

## Overview

Gate Hub keeps all Home Assistant configuration under version control so changes can be reviewed, tested, and rolled back safely. Dashboards, automations, helper entities, and custom integrations live in this repository alongside the scripts that validate them. The configuration is designed to run on HAOS but can be adapted to supervised or container installs if desired.

---

## Key Highlights

- Modular `packages/` layout keeps automations, helpers, and dashboards scoped by feature.
- Lovelace dashboards are YAML-driven and stored in the repo so UI state matches commits.
- Custom Huskers theme in `themes.yaml` exposes `--huskers-*` variables for consistent Scarlet & Cream styling across dashboards.
- Pre-commit and GitHub Actions enforce formatting, linting, and Home Assistant config checks.
- Helper scripts normalise secrets and run containerised validation for local or CI usage.
- Documentation under `docs/` captures infrastructure, add-ons, ADRs, and package notes.

---

## Primary Integrations

- Zigbee2MQTT and MQTT bridges for lighting, contact sensors, and LED effects.
- TP-Link Deco network automation, presence, and watchdog telemetry.
- BLE Monitor, Govee lighting, Wunderground PWS, TeamTracker sports feeds.
- Nebraska Huskers game-day package automating lighting, dashboards, and score effects.

---

## Repository Guide

```
.
|-- configuration.yaml         # Entry point that wires each include file and package
|-- automations.yaml           # Base automations outside of packages
|-- templates.yaml             # Template sensors, binary sensors, and helpers
|-- packages/                  # Feature-scoped bundles: Huskers, kiosk, etc.
|-- dashboards/                # YAML Lovelace dashboards served by HA
|-- custom_components/         # Checked-in custom integrations (BLE, Govee, ...)
|-- scripts/                   # Local+CI helpers, incl. ha_check_portable
|-- docs/                      # Living documentation for infra, tooling, ADRs
|-- Fix-HAConfig.ps1           # PowerShell fixer/normaliser with backup support
```

---

## Getting Started

### Clone & provide secrets

1. Clone the repository into your Home Assistant `/config` directory.
2. Copy `.ci/fakesecrets.yaml` to `secrets.yaml` (or create your own) and fill in real values.
3. Review `Fix-HAConfig.ps1` for optional one-time normalisation tasks.

### Runtime data and local copies

The repository keeps redacted JSON examples for Zigbee2MQTT and bhyve while the live files stay on your development machine. Copy an example to a personal variant and keep the real snapshot untracked:

```bash
cp custom_components/zigbee2mqtt/state.example.json custom_components/zigbee2mqtt/state.local.json
cp custom_components/bhyve/pybhyve/devices.example.json custom_components/bhyve/pybhyve/devices.local.json
```

- `state.example.json` and `coordinator_backup.example.json` document the expected shape without leaking device data.
- Add your own `state.local.json` or `devices.local.json`; Git ignores the local variants and runtime outputs such as `state.json` so HAOS deployments are never clobbered.
- The live files can remain side-by-side on your workstation for reference, but they will not be pushed to Home Assistant.

Need a dump of entity ids without staging `state.json`? Use the helper script:

```bash
poetry run python scripts/export_entities.py --token-file ~/.ha_token
```

By default the script writes `docs/entities.md`; override the path with `--output` when required.

### Local tooling

```bash
poetry env use 3.11   # ensure the Python 3.11 toolchain that matches pyproject.toml
poetry install        # install Python tooling (Ruff, pre-commit)
pre-commit install    # enable git hook
```

Prefer pip? Install the tooling directly:

```bash
pip install pre-commit ruff
```

### Validation

```bash
ha core check                         # requires the HA CLI
pre-commit run --all-files            # formatting, linting, HA config check
python scripts/ha_check_portable.py   # portable dockerised config validation
```

The portable checker mounts the repo into `ghcr.io/home-assistant/home-assistant:stable` and runs `check_config`, generating temporary secrets if none exist.

---

## Automations & Packages

- `packages/huskers/` orchestrates score tracking, lighting overrides, and dashboards for game days.
- Base automations cover lighting schedules, notifications, backups, watchdogs, and environment control.
- Templates normalise external weather data and generate helpers for dashboards and automations.

---

## Dashboards

- **Huskers Game Day:** multi-view board for live status, debug, and LED testing.
- **Rooms & Areas:** light, climate, and occupancy controls by space.
- **Networking & System:** Deco mesh insight, supervisor health, backup status.
- **Weather:** AccuWeather + Wunderground summaries, forecasts, and warnings.

Each dashboard is defined under `dashboards/` and registered in `configuration.yaml` for deterministic UI state.

---

## Tooling & CI

- `ruff` handles Python linting and formatting (both locally and in CI).
- `prettier`, `yamllint`, and `pre-commit-hooks` keep YAML and markdown tidy.
- `scripts/ha_check_portable.py` optionally runs within GitHub Actions to emulate `ha core check` without mounting secrets.
- `scripts/export_entities.py` creates an entity index without committing live Zigbee2MQTT state.
- `.github/workflows/ci.yml` runs Ruff and the non-Python pre-commit hooks on every push and PR. Additional workflows (e.g., `ha-config-check.yaml`) can be toggled on as needed.


---

## Documentation

All supporting docs live under `docs/`:

- `docs/index.md` – navigation hub for tooling, ADRs, and guides.
- `docs/ci.md` – CI pipeline reference and troubleshooting notes.
- `docs/pre-commit.md` – local hook usage and hook descriptions.
- `docs/husker_package/` – in-depth Huskers automation and dashboard guides.

---

## Roadmap

- Migrate remaining Zigbee devices into Zigbee2MQTT for unified control.
- Harmonise entity naming while keeping human-readable labels in the UI.
- Expand media stack integration (Plex, Radarr, qBittorrent) for theater automations.
- Enhance Huskers dashboards with standings, records, and auto-updating schedules.
- Add local AI/LLM helpers to scaffold automations from entity state snapshots.
- Strengthen backup, watchdog, and security alerting coverage.
- Build a kiosk package for secure shared displays with limited controls.

---

## Credits

- [Home Assistant](https://www.home-assistant.io/)
- [HACS](https://hacs.xyz/) and the custom integrations used in this repo
- Community authors of blueprints, dashboards, and scripts referenced throughout
- Nebraska Huskers fan community for inspiration and data sources

_See `docs/` for deeper dives into infrastructure, packages, and operational notes._
