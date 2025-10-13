# Repository Metrics Automation Bundle

This guide summarises the assets created for the GitHub metrics automation and
Home Assistant dashboard integration.

## scripts/metrics.py

```scripts/metrics.py
# Refer to scripts/metrics.py for the full implementation.
```

- Fetches commit, pull request, and Actions data for `dsainz3/gate-hub` using
  the GitHub GraphQL and REST APIs.
- Generates charts under `/config/www/metrics/` (`/local/metrics/` in the UI),
  plus Markdown/HTML reports and `summary.html`.
- Updates the README between `<!-- METRICS:START -->` and `<!-- METRICS:END -->`
  markers so the latest summary is visible on GitHub.
- Writes a `summary.json` companion that powers the Home Assistant package
  sensors.

Run locally with (supplying `GITHUB_TOKEN` unlocks richer metrics, but the
script will fall back to unauthenticated REST requests if omitted):

```bash
GITHUB_TOKEN=ghp_example python scripts/metrics.py \
  --repo dsainz3/gate-hub \
  --output www/metrics \
  --markdown \
  --html \
  --summary-html \
  --update-readme
```

### Running directly on Home Assistant OS

You can execute the generator from the HAOS **Terminal & SSH** add-on as long
as the add-on has `python3` available:

1. Open the terminal add-on and switch into your configuration directory:
   ```bash
   cd /config
   ```
2. (First run only) ensure Python dependencies are present. The official SSH
   add-on ships with `python3`, `pip`, and a writable `/config`, so install the
   required packages once:
   ```bash
   pip3 install --user requests matplotlib markdown
   ```
3. Run the script using the same command shown above. The `/config` checkout is
   equivalent to the repository root, so invoke:
   ```bash
   GITHUB_TOKEN=<optional_personal_token> python3 scripts/metrics.py \
     --repo dsainz3/gate-hub \
     --output www/metrics \
     --markdown \
     --html \
     --summary-html \
     --update-readme
   ```

The command writes results to `/config/www/metrics/`, which surfaces in the UI
under `/local/metrics/` without additional steps. If the add-on is locked down
and cannot install Python packages, run the script inside the provided GitHub
Actions workflow instead.

### Running on Windows

The generator also works on Windows as long as Python 3.11 (or newer) is
installed. PowerShell steps:

1. Install the dependencies (first run only):
   ```powershell
   py -m pip install --user requests matplotlib markdown
   ```
2. From the repository root, execute the script. The `py` launcher selects the
   matching Python installation automatically:
   ```powershell
   $env:GITHUB_TOKEN="<optional_personal_token>"
   py scripts/metrics.py `
     --repo dsainz3/gate-hub `
     --output www/metrics `
     --markdown `
     --html `
     --summary-html `
     --update-readme
   ```

Outputs are written beneath `www\metrics\`. When served through Home Assistant
or any static host, reference them as `/local/metrics/...` in Lovelace cards.

## .github/workflows/repo-metrics.yml

```yaml
# See .github/workflows/repo-metrics.yml
```

- Executes daily at 06:00 UTC (and on manual dispatch).
- Installs Python dependencies (`requests`, `matplotlib`, `markdown`) and runs
  `scripts/metrics.py` with the options above.
- Opens a pull request on branch `automation/repo-metrics` with refreshed
  assets so that changes are reviewed before merging into `main`.

## dashboard-view.yaml → dashboards/repo-metrics.dashboard.yaml

```yaml
# See dashboards/repo-metrics.dashboard.yaml
```

- Provides a Lovelace YAML dashboard titled **Repository Metrics** with:
  - Picture cards for commit, contributor, revert, and CI charts.
  - An iframe for the full HTML report.
  - An iframe for the compact summary ticker (`summary.html`).
- Added to `configuration.yaml` so it appears in the sidebar automatically.

## packages/repo_metrics.yaml

```yaml
# See packages/repo_metrics.yaml
```

- Adds a `command_line` sensor that surfaces `summary.json` data for automations
  or badges.
- Includes a derived template sensor that exposes the latest weekly contributor
  count directly.

## Validation checklist

1. After the workflow runs, confirm the assets resolve via:
   - `https://<ha-host>/local/metrics/commits_per_week.svg`
   - `https://<ha-host>/local/metrics/metrics.html`
   - `https://<ha-host>/local/metrics/summary.html`
2. Reload the Lovelace resources to ensure the new dashboard picks up the
   latest content (`Settings → Dashboards → ⋮ → Reload Resources`).
3. If using the Git Pull add-on, run a manual sync or confirm the scheduled sync
   has pulled the updated files into `/config`.

## Troubleshooting tips

- Placeholder charts indicate the workflow ran without GitHub authentication –
  provide `REPO_METRICS_TOKEN` (or allow the default `GITHUB_TOKEN`) with
  `repo` and `actions:read` scopes to unlock commit diff statistics.
- If the dashboard still shows cached images, add a cache-busting query string
  such as `/local/metrics/commits_per_week.svg?v={{ states('sensor.date') }}` in
  the Lovelace card configuration.
- Expose the `summary.json` as a REST sensor (instead of command line) if you
  prefer asynchronous updates or want to serve it to other systems.
- For long-term storage, consider exporting metrics into InfluxDB or Grafana
  using the generated JSON output as a bridge.
