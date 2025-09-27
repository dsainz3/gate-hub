---
title: CI Pipeline Runbook
summary: Operate, troubleshoot, and reproduce the gate-hub GitHub Actions workflows.
status: active
category: how-to
updated: 2025-09-27
owner: platform-team
tags:
  - ci
  - github-actions
  - home-assistant
---

# CI Pipeline Runbook

Use this guide when diagnosing pipeline failures or validating changes locally. The workflows live in `.github/workflows/` and mirror the tooling described in the [Infrastructure Overview](../reference/infrastructure.md).

## Prerequisites
- Python 3.11 installed locally (or use `poetry run`).
- Access to the repository with the full Git history.
- Docker available for reproducing the Home Assistant config check (optional but recommended).

## Workflow Inventory

| Workflow | Trigger | Purpose |
| --- | --- | --- |
| `ci.yml` | Push & PR | Runs Ruff lint/format checks and the pre-commit suite.
| `ha-config-check.yaml` | Manual, schedule, or PR label | Executes `hass --script check_config` inside the official container using fakesecrets.

## Local Parity

Run the linting and formatting jobs exactly as CI:

```bash
ruff check .
ruff format --check .
pre-commit run --all-files
```

For configuration validation without pushing a branch:

```bash
poetry run python scripts/ha_check_portable.py
# or via HA CLI on the host
ha core check
```

## ha-config-check Internals

1. Checkout repository and restore caches.
2. Copy `.ci/fakesecrets.yaml` to `secrets.yaml` (if present) to avoid leaking real credentials.
3. Run `hass --script check_config` inside the official `homeassistant/home-assistant` image.
4. Upload logs and the `configuration.yaml` snapshot as workflow artefacts for debugging.

Retain `fakesecrets.yaml` in sync with required keys; reference the template when adding new secrets.

## Troubleshooting Cheatsheet

- **Ruff cache mismatch** → run `ruff clean` locally and retry.
- **Stale pre-commit hooks** → delete `~/.cache/pre-commit` or pass `PRE_COMMIT_ALLOW_NO_CONFIG=1` once.
- **Missing secrets in HA check** → add placeholders to `.ci/fakesecrets.yaml` and regenerate.
- **Workflow stuck in queued** → confirm GitHub Actions concurrency limits; cancel redundant runs.

## Escalation
- For CI infra issues (runner outages, permission problems) open a GitHub issue labelled `ci` and notify the platform team in chat.
- Add an ADR when changing workflow topology or introducing new validation stages.
