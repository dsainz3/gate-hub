---
title: Pre-prod Push Checklist
summary: Workflow for validating changes locally before pushing, merging, and deploying to production Home Assistant.
status: active
category: how-to
updated: 2025-10-12
owner: platform-team
tags:
  - workflow
  - release
  - pre-commit
---

# Pre-prod Push Checklist

Follow this playbook before you push a branch, open a pull request, or deploy to the production Home Assistant instance. It keeps pre-commit happy, protects the main branch, and documents the production release flow.

## 1. Prep the Working Tree
- Sync the latest `main` (or release branch) and rebase your feature branch if it has diverged.
- Review `git status` to confirm only the intended files are staged/modified.
- Ensure secrets-free copies of configuration files are up to date (`.ci/fakesecrets.yaml`, redacted runtime snapshots, etc.).

## 2. Local Quality Gate
1. Run `pre-commit run --all-files` **once** to let hooks auto-fix formatters and surface violations.
2. Stage the changes made by auto-fixers (`git add …`), then run `pre-commit run --all-files` **again** to confirm the tree is clean.
3. If you touched Python:
   ```bash
   ruff check .
   ruff format --check .
   ```
4. If you touched Home Assistant YAML, run a config check:
   ```bash
   poetry run python scripts/ha_check_portable.py  # or `ha core check`
   ```
5. Only after all checks pass should you stage remaining edits and continue.

## 3. Commit & Push Discipline
- Use focused commits with descriptive messages (e.g., `docs: add pre-prod push checklist`).
- Never commit with failing pre-commit hooks; rerun step 2 if you amend.
- Push the branch and open a pull request; assign reviewers and link the relevant issue/task.

## 4. PR Gate & Production Deployment
1. Wait for CI to finish (`CI`, `pre-commit` workflows).
2. Reviewers confirm:
   - Documentation updated when behaviour changes.
   - Tests are added/updated.
   - Secrets/config changes follow the redaction policy.
3. Once approved, merge via the fast-forward or squash strategy required by the repo.
4. Tag the release or note the commit hash when promoting to production.
5. Deploy to Home Assistant:
   - Pull the latest `main` on the HA host (`git pull` in `/config`).
   - Run the config check (`ha core check`).
   - Restart Home Assistant or reload areas touched (automations/dashboards/themes).

## 5. Post-deploy Verification
- Confirm key dashboards load, automations fire, and any migrations (templates, helpers) succeeded.
- Update runbooks or ADRs if the deployment introduced new operational steps.
- Close the issue/task linked to the change and capture release notes if needed.

> Tip: keep this checklist open while working; ticking each step avoids late churn when production fixes are urgent.
