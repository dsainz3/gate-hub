---
title: Pre-commit Quality Strategy
summary: Why the team enforces local pre-commit runs to keep pull requests unblocked.
status: active
category: explanation
updated: 2025-09-28
owner: dev-experience
tags:
  - pre-commit
  - ci
  - workflow
---

# Pre-commit Strategy for Green PRs

We rely on pre-commit to stop avoidable defects before they reach CI. The hooks mirror the checks that gate every pull request. When they pass locally, the CI run stays green, reviewers stay focused on the change itself, and merges happen without churn.

## Why We Invest in Pre-commit
- **Fast feedback:** Hooks run in seconds on a developer workstation versus several minutes in GitHub Actions.
- **PR signal quality:** A green pipeline signals “ready for review”; red builds slow code review and slip our deployment cadence.
- **Consistent automation:** YAML formatting, lint rules, and Home Assistant validation stay identical everywhere because the same config powers local and remote runs.
- **Reduced merge debt:** Auto-fixes happen on the contributor’s machine, eliminating follow-up commits or forced pushes during review.

## How CI Blocks a Pull Request
Two jobs in `.github/workflows/ci.yml` must pass before a PR can merge:
- `ruff` runs the Python linter and formatter in check-only mode.
- `pre-commit` skips the Ruff hooks but executes everything else (YAML formatter, whitespace hygiene, `yamllint`, and `hass-config-check`).

If either job fails, the PR stays blocked. The quickest fix is to reproduce the failing hook locally with the same configuration.

## Definition of “Ready to Push”
Do these before opening or updating a PR:
1. Activate the project environment: `poetry install` (first time) and `poetry shell` (optional) or `poetry run`.
2. Run `pre-commit run --all-files` to exercise the full hook suite.
3. Run `ruff check .` and `ruff format --check .` if you touched Python and want to mirror the dedicated CI job.
4. Restage any files changed by auto-fixes and re-run until clean.

## Handling Hook Failures
- **Formatting rewrites:** Stage the modified files (`git add`) and retry the commit.
- **YAML schema violations:** Review the error output; run `yamllint <file>` for focused debugging.
- **Home Assistant validation:** Use `pre-commit run hass-config-check` or `poetry run python .ci/run_hass_check.py` for a single repro. When the error references missing secrets, ensure `.ci/fakesecrets.yaml` covers new keys.
- **Upstream updates:** If hooks complain about missing versions, run `pre-commit autoupdate` in a dedicated PR.

## Continuous Improvement
We track flaky or slow hooks in the docs backlog. When a hook causes repeated false positives, log an issue and discuss whether to tweak configuration or move the check to a scheduled workflow.

Future enhancements under discussion:
- Lightweight nightly run of `hass --script check_config` to catch environment drift without blocking PRs.
- Per-feature hook profiles that developers can opt into while experimenting (without weakening the default gate).

By treating pre-commit as the first line of defence, we keep pull requests reviewable, shorten feedback loops, and ensure production automation stays reliable.
