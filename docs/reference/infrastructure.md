---
title: Infrastructure Overview
summary: Inventory of the gate-hub Home Assistant OS environment, tooling stack, and repository layout.
status: active
category: reference
updated: 2025-09-27
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

## Repository Layout

```
.
├─ configuration.yaml          # entry point (includes packages and domain files)
├─ automations.yaml            # base automations; see reference/automations.md
├─ packages/                   # feature packages (Huskers, weather dashboards, etc.)
├─ custom_components/          # custom integrations (wundergroundpws, etc.)
├─ dashboards/                 # Lovelace dashboards referenced in configuration.yaml
├─ scripts/ & scripts.yaml     # reusable automation helpers
├─ docs/                       # you are here
└─ www/                        # static assets (dashboards, themes, cards)
```

Use this structure when creating new features so includes stay predictable for CI and for the [Automation Catalog](automations.md).

## Operational Checklist

- Monitor disk usage and database growth monthly (log findings in the optimization plan).
- Keep secrets out of version control (`secrets.yaml` stays on the HA host).
- Capture breaking changes or migrations in a new ADR when decisions impact architecture.
