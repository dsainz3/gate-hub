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

Hooks that auto-fix files (`ruff --fix`, `yaml-format`, etc.) require you to re-stage the changes before committing. As part of the [Pre-prod Push Checklist](pre-prod-checklist.md), run the full suite twice—once to apply fixes, stage the results, then again to confirm the tree is clean before committing or pushing.

> ✅ **Keep PRs unblocked:** Run `pre-commit run --all-files` before pushing a branch. CI executes the same hooks, so a clean local run is the fastest way to avoid “red” pull requests and reviewer churn.

## Commit Artifact Helper

When `pre-commit` finishes cleanly and your changes are staged, run:

```bash
python scripts/gen_commit_artifacts.py
```

The helper inspects the staged diff and prints:
- a conventional-style commit subject + body
- a merge/PR template
- review-ready bullet points

Filter the output with `--commit`, `--merge`, or `--comments`, or redirect everything to a file with `--output notes.txt`. Example:

```bash
python scripts/gen_commit_artifacts.py --commit
```

```text
=== Commit Message ===

docs: refresh documentation

Summary:
- touch 2 file(s) under `docs` (pre-prod-checklist.md, pre-commit.md)

Testing:
- [ ] n/a - docs-only change
```

> Tip: add `alias gca="python scripts/gen_commit_artifacts.py"` to your shell profile, or wire the command into a `pre-push` hook if you want the prompt before every push.

## Troubleshooting
- Upgrade hooks with `pre-commit autoupdate` then re-run to repin versions.
- Delete `~/.cache/pre-commit` if caches become corrupted after updates.
- For Ruff cache issues run `ruff clean`.
- If the hook fails on `hass-config-check`, reproduce locally via `poetry run python scripts/ha_check_portable.py` or `ha core check`.

## Related Docs
- [CI Pipeline Runbook](ci.md) for the GitHub Actions mirror of these hooks.
- [Infrastructure Overview](../reference/infrastructure.md) for environment prerequisites.
