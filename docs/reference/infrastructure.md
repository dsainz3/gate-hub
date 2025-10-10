---
title: Infrastructure Overview
summary: Inventory of the gate-hub Home Assistant OS environment, tooling stack, and repository layout.
status: active
category: reference
updated: 2025-10-05
owner: platform-team
tags:
  - infrastructure
  - home-assistant
  - tooling
---

# Infrastructure Overview

This page documents the baseline platform for gate-hub. Pair it with the [CI runbook](../how-to/ci.md) and [pre-commit workflow](../how-to/pre-commit.md) for day-to-day operations.

## VS Code Workspace

Connect from the desktop VS Code client via the **Remote - SSH** extension to the Home Assistant SSH add-on (`root@homeassistant.local:22`). The workspace opens directly under `/config`. A minimal `.code-workspace` snippet:

```json
{
  "name": "haos-workspace",
  "extensions": [
    "ms-python.python",
    "esbenp.prettier-vscode"
  ],
  "settings": {
    "editor.tabSize": 2,
    "files.trimTrailingWhitespace": true
  }
}
```

## Home Assistant OS

- Recorded version: `2025.9.4` (verify via **Settings → System → About** or `ha os info`).
- Supervisor and add-on updates run weekly via the UI; log upgrade notes in the ops journal.
- Keep snapshots on external storage (NAS or cloud) before major upgrades.

## Git Integration

Clone directly into `/config` on the HA host:

```bash
cd /config
git clone https://github.com/dsainz3/gate-hub.git .
```

Store GitHub credentials in `~/.netrc` for non-interactive access:

```text
machine github.com
  login dsainz3
  password <TOKEN>
```

Protect the file with `chmod 600 ~/.netrc`. Rotate tokens quarterly or when offboarding.

## Python Tooling

We manage dependencies with [Poetry](https://python-poetry.org/):

```bash
poetry install
```

Use the virtual environment for checks and scripts:

```bash
poetry run pre-commit run --all-files
poetry run python scripts/ha_check_portable.py
```

See the [pre-commit how-to](../how-to/pre-commit.md) for hook details.


## Network Monitoring Integrations

- [TP-Link Router custom component](https://community.home-assistant.io/t/custom-component-tp-link-router-integration-supports-also-mercusys-router/638647) is installed via HACS to expose Deco node health, client rosters, and router controls.
- [TP-Link Deco custom integration](https://github.com/amosyuen/ha-tplink-deco) is configured alongside it for expanded mesh telemetry and device tracking.
- `packages/network_monitor.yaml` aggregates the speedtest entities plus Deco throughput into summary sensors and rolling statistics windows (1h/24h/7d/30d). The “internet online” helper now prefers `binary_sensor.internet_reachability_2` so the dashboards stay green even if the legacy reachability sensor is sleepy.
- The performance summary comparisons were relaxed to look only at the most recent hour (`*_1h_avg` statistics) before flagging a metric as degraded. This dramatically reduces false positives while you experiment with sensor fixes or baseline changes.
- The `dashboards/network-dashboard.yaml` Lovelace view surfaces the Deco health, throughput trends, and ping comparisons (current vs averages) alongside auto-entities blocks for live Deco nodes and any `sensor.ping_*` entities.

## Agenda & Tasks

- `packages/agenda_planner.yaml` centralizes helpers and scripts for adding events (`calendar.create_event`) and tasks (`todo.add_item`) from the UI. The Kiosk snapshot view now includes a dedicated agenda column using this package.
- `docs/reference/agenda-planner.md` documents setup, dashboards, and entity usage.

## Media & Theater

- `packages/theater_media.yaml` encapsulates the basement Fire TV + Plex helper scripts, template sensors, and entity group used by the Support · Test Resources dashboard.
- The Plex · Theater view (`dashboards/_support/test_resources.dashboard.yaml`) surfaces the controls alongside a Lovelace media browser card. Ensure `media_source:` stays declared in `configuration.yaml` so the browser renders.
- Reference details live in [Basement Theater Media Package](theater-media.md).

## Repository Layout

```
.
├─ configuration.yaml          # entry point (includes packages and domain files)
├─ automations.yaml            # base automations; see reference/automations.md
├─ packages/                   # feature packages (Football Team, weather dashboards, etc.)
├─ custom_components/          # custom integrations (wundergroundpws, etc.)
├─ dashboards/                 # Lovelace dashboards referenced in configuration.yaml
├─ scripts/ & scripts.yaml     # reusable automation helpers
├─ docs/                       # you are here
└─ www/                        # static assets (dashboards, themes, cards)
   └─ community/teamtracker-card/ha-teamtracker-card.js   # vendored TeamTracker Lovelace card
```

Use this structure when creating new features so includes stay predictable for CI and for the [Automation Catalog](automations.md).

## Operational Checklist

- Monitor disk usage and database growth monthly (log findings in the optimization plan).
- Keep secrets out of version control (`secrets.yaml` stays on the HA host).
- Capture breaking changes or migrations in a new ADR when decisions impact architecture.
