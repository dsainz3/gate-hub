---
title: Pre-commit Workflow
summary: Install, run, and troubleshoot the repository pre-commit hooks.
status: active
category: how-to
updated: 2025-09-28
owner: dev-experience
tags:
  - pre-commit
  - linting
  - workflow
---

# Pre-commit Workflow

Follow this guide to keep local commits aligned with CI enforcement. Hooks live in `.pre-commit-config.yaml` and run automatically after you install the git hook.

## Hook Inventory
- `yaml-format` local hook that uses `ruamel.yaml` for deterministic YAML formatting.
- `trailing-whitespace`, `end-of-file-fixer`, `mixed-line-ending`, `check-yaml` from `pre-commit-hooks` keep whitespace, line endings, and schemas consistent.
- `yamllint` enforces the style guide defined in `.yamllint.yml`.
- `ruff` (lint + autofix) and `ruff-format` maintain Python quality.
- `hass-config-check` wraps `.ci/run_hass_check.py` to mirror the Home Assistant validation performed in CI (rerun locally or via `ha core check` for deeper investigation).

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

Hooks that auto-fix files (`ruff --fix`, `yaml-format`, etc.) require you to re-stage the changes before committing.

> ✅ **Keep PRs unblocked:** Run `pre-commit run --all-files` before pushing a branch. CI executes the same hooks, so a clean local run is the fastest way to avoid “red” pull requests and reviewer churn.

## Troubleshooting
- Upgrade hooks with `pre-commit autoupdate` then re-run to repin versions.
- Delete `~/.cache/pre-commit` if caches become corrupted after updates.
- For Ruff cache issues run `ruff clean`.
- If the hook fails on `hass-config-check`, reproduce locally via `poetry run python scripts/ha_check_portable.py` or `ha core check`.

## Related Docs
- [CI Pipeline Runbook](ci.md) for the GitHub Actions mirror of these hooks.
- [Infrastructure Overview](../reference/infrastructure.md) for environment prerequisites.
