---
title: Pre-commit Workflow
summary: Install, run, and troubleshoot the repository pre-commit hooks.
status: active
category: how-to
updated: 2025-09-27
owner: dev-experience
tags:
  - pre-commit
  - linting
  - workflow
---

# Pre-commit Workflow

Follow this guide to keep local commits aligned with CI enforcement. Hooks live in `.pre-commit-config.yaml` and run automatically after you install the git hook.

## Hook Inventory
- `prettier` (YAML only) for deterministic formatting.
- `trailing-whitespace`, `end-of-file-fixer`, `mixed-line-ending`, `check-yaml` from `pre-commit-hooks`.
- `yamllint` using the repository ruleset.
- `ruff` (lint + autofix) and `ruff-format` for Python code.
- `hass-config-check` wrapper to surface Home Assistant validation issues during CI (run manually via `ha core check` when needed).

## Setup

```bash
poetry install          # installs Ruff and pre-commit into the virtualenv
pre-commit install      # registers the git hook in .git/hooks/pre-commit
```

## Typical Commands

```bash
pre-commit run --all-files        # run everything once
SKIP=ruff,ruff-format pre-commit run --all-files   # temporary skip (remember to re-run!)
```

Hooks that auto-fix files (`ruff --fix`, `prettier`, etc.) require you to re-stage the changes before committing.

## Troubleshooting
- Upgrade hooks with `pre-commit autoupdate` then re-run to repin versions.
- Delete `~/.cache/pre-commit` if caches become corrupted after updates.
- For Ruff cache issues run `ruff clean`.
- If the hook fails on `hass-config-check`, reproduce locally via `poetry run python scripts/ha_check_portable.py` or `ha core check`.

## Related Docs
- [CI Pipeline Runbook](ci.md) for the GitHub Actions mirror of these hooks.
- [Infrastructure Overview](../reference/infrastructure.md) for environment prerequisites.
