# AI Automation Builder (Archived Prototype)

The AI-driven automation workflow previously described here has been removed from the active
configuration. The GitHub Actions job and generator script were experimental and were retired
while the Home Assistant configuration was simplified. This document now serves as a reference
for what existed and how to proceed without it.

## Current Status
- There is **no** `.github/workflows/ai_automation.yml` workflow in the repository.
- The supporting `tools/ai_automation/` generator script and `packages/ai/` target directory were
  deleted during the cleanup.
- No automation packages are generated automatically—new automations must be authored manually.

## Current Authoring Process
1. Draft the automation YAML by hand, following the existing patterns in `packages/`.
   - Create a new file under `packages/` (or extend an existing package) and include it via
     `!include_dir_named packages` in `configuration.yaml`.
2. Validate the change locally before opening a PR:
   - `pre-commit run --all-files` to apply formatting and run YAML checks.
   - `python scripts/ha_check_portable.py` if you want the containerised Home Assistant
     `check_config` run that mirrors CI.
3. Commit the automation, open a pull request, and merge once CI passes.
4. Reload automations from **Settings → System → Automations & Scenes → Reload Automations** (or
   restart Home Assistant) after deploying.

## Reviving the Prototype
If you would like to resurrect the AI builder, recover the workflow, script, and package directory
from an earlier backup or branch and wire them back into the repository. Expect to:
- Restore the GitHub Actions workflow under `.github/workflows/`.
- Reintroduce the Python generator and ensure its dependencies are listed in `pyproject.toml`.
- Decide where the generated YAML should land (for example, recreating a `packages/ai/` folder) and
  confirm it is included by Home Assistant.

Because the current repository snapshot no longer contains these files, coordinating with the
maintainers or consulting an older clone/backup is required to retrieve them.
