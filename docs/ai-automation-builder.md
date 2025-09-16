# AI Automation Builder (GitHub Actions)

This adds a no-Docker workflow that turns a prompt into a Home Assistant **package** YAML and opens a PR.

## Prereq
- Repo secret **OPENAI_API_KEY** (`Settings → Secrets and variables → Actions → New repository secret`).

## Files
- `.github/workflows/ai_automation.yml` — workflow to run from the Actions tab
- `tools/ai_automation/generate.py` — generator script (OpenAI + YAML validation)
- `packages/ai/.gitkeep` — ensures the target directory exists

## Usage
1. Push these files to your repo (or merge this PR).
2. GitHub → **Actions → AI - Generate Automation PR → Run workflow**
   - **prompt**: Describe the automation in plain English.
   - **file_slug**: Optional base name, e.g. `front_door_evening`.
   - **outdir**: Leave as `packages/ai` (packages are auto-loaded if your `configuration.yaml` includes `homeassistant: packages: !include_dir_named packages`).
   - **model**: Default `gpt-4o-mini`.
3. The workflow creates `packages/ai/<slug>-<timestamp>.yaml`, commits it to a branch `ai/auto-<slug>`, and opens a PR.
4. Merge, then **Server Controls → Reload Automations** (or restart).

## Tips
- The script outputs **pure YAML** and validates it. Placeholders are marked with `# TODO`.
- You can set `dry_run: true` to only test generation without opening a PR.
