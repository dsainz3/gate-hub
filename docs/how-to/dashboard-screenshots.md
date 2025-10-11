---
title: Automated Dashboard Screenshots
---

Capturing fresh dashboard screenshots for MkDocs manually is tedious and error prone. This guide describes a repeatable Playwright-based workflow that authenticates to Home Assistant, renders each dashboard at a known resolution, and stores PNG assets under `docs/assets/screenshots/` for inclusion in documentation.

## Prerequisites

1. Install the Python dependencies and Playwright browser binaries:

   ```bash
   poetry install
   poetry run playwright install chromium
   ```

2. Create a long-lived access token for an account with read access to the dashboards that will be captured. Store the token securely (for example, in `~/.bashrc` or a secrets manager) and export it before running the script:

   ```bash
   export HA_TOKEN="<token>"
   export HA_BASE_URL="https://homeassistant.example.com"
   ```

3. Copy `docs/how-to/dashboard-screenshot-plan.example.yaml` to a working configuration file and customise it to match your dashboards (see `docs/how-to/dashboard-screenshot-plan.yaml` for the live plan tracked in this repo):

   ```bash
   cp docs/how-to/dashboard-screenshot-plan.example.yaml docs/how-to/dashboard-screenshot-plan.yaml
   ```

   Each entry provides the Lovelace path, viewport, and wait strategy for a dashboard. The example shows two dashboards captured at different resolutions.
   - `sources` lists the YAML (or include) files that should trigger a fresh capture when they change.
   - `markdown` defines where the per-dashboard tracker will be written (defaults to `docs/reference/dashboard-snapshots/<slug>.md` when omitted).
   - `title` lets you override the human-friendly heading used in the generated Markdown.

## Running the capture script

Run the capture tool with Poetry so that the dependencies resolve correctly:

```bash
poetry run python scripts/capture_dashboard_screenshots.py \
  --config docs/how-to/dashboard-screenshot-plan.yaml \
  --output-dir docs/assets/screenshots \
  --markdown-dir docs/reference/dashboard-snapshots
```

* `--config` points to the YAML plan created in the previous step.
* `--output-dir` determines where the PNG files are written (the directory is created if required).
* `--markdown-dir` controls where the generated Markdown trackers live (created automatically).
* The script reads `HA_BASE_URL`/`HA_TOKEN` (or the legacy `HASS_BASE_URL`/`HASS_LONG_LIVED_TOKEN`) from the environment when the corresponding CLI flags are omitted. You can also pass `--base-url` and `--token` explicitly.
* Pass `--force` to bypass change detection and refresh every dashboard regardless of source file timestamps.

Behind the scenes the script uses the token to authenticate, reuses the generated storage state for each dashboard, and saves one screenshot per entry. Sensitive values are only read from the environment/CLI and tokens are redacted from log output so they never land in terminal history. A `--headful` switch is available for debugging flows locally and `--slow-mo` delays actions when diagnosing rendering issues.

Alternatively, use the convenience wrapper that keeps credentials in `secrets.yaml`:

```bash
poetry run python scripts/run_dashboard_captures.py \
  --plan docs/how-to/dashboard-screenshot-plan.yaml \
  --output-dir docs/assets/screenshots \
  --markdown-dir docs/reference/dashboard-snapshots
```

Add the following entries to your secrets file (placeholders are provided in `secrets.example.yaml`):

```yaml
dashboard_capture_base_url: https://homeassistant.example.com
dashboard_capture_token: YOUR_LONG_LIVED_TOKEN
```

The wrapper reads those keys, forwards them to `capture_dashboard_screenshots.py`, and supports the same switches (`--headful`, `--slow-mo`, `--force`, and `--log-level`).
If you prefer to keep credentials out of the secrets file, set `HA_BASE_URL` and `HA_TOKEN` (or the legacy `HASS_*` equivalents) in the environment instead—the wrapper falls back to those variables automatically.

### Change detection and Markdown trackers

On each run the tool compares the mtime of every file listed under `sources` with the existing screenshot. When a source is newer (or the PNG is missing) a new capture is taken; otherwise the dashboard is skipped. Every captured dashboard is paired with a Markdown summary that records the screenshot path, SHA-256 hash, and last updated timestamp—ideal for MkDocs changelogs or PR diffs. The Markdown location defaults to `docs/reference/dashboard-snapshots/` but can be overridden per entry or via `--markdown-dir`.

## Security considerations

* Treat the Home Assistant token like any other credential—store it in your shell profile or a secrets manager and avoid pasting it into shared terminals.
* The script only prints a shortened, redacted representation of the token in debug logs to help correlate runs without leaking secrets.
* When finished capturing screenshots, unexport the token or close the terminal session if you are on a shared workstation.

## Adding screenshots to the docs

1. Reference the generated PNGs from the relevant MkDocs page using the relative path (for example, `![Default dashboard](../assets/screenshots/default-dashboard.png)`).
2. Commit the updated screenshots alongside documentation changes so reviewers can see the rendered UI in context.
3. Repeat the script whenever the UI changes; only the dashboards listed in the YAML plan are refreshed.

## Maintenance tips

* When a dashboard layout changes, adjust the `wait_selector` or `wait_ms` fields to ensure elements load before the capture.
* Use dedicated tokens for automation so they can be revoked without disrupting human operators.
* Consider storing the screenshot plan in version control to provide a single source of truth for documentation assets.
