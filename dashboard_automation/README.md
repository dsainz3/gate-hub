# Dashboard Automation

Async tooling that monitors Lovelace dashboards, captures Browserless-powered screenshots, and regenerates Markdown documentation. The code is designed to run directly on Home Assistant OS and stores artefacts under `/config/www/dashboard_screenshots` and `/config/docs/dashboards`.

## Prerequisites

- Python 3.12 (Home Assistant OS ships the required runtime).
- Poetry 2.2+ (already vendored via `.venv/bin/poetry` in this repo).
- A Browserless Chrome instance. Start the companion container with:

```bash
docker compose -f dashboard_automation/docker-compose.browserless.yml up -d
```

## Quick Start

1. Copy `.env.example` to `.env` and populate at least `SUPERVISOR_TOKEN`. The default URL works for Supervisor-based installs.
2. Ensure `/config/www/dashboard_screenshots` and `/config/docs/dashboards` exist (they are created automatically at runtime).
3. Launch the automation service:

```bash
bash dashboard_automation/run.sh
```

The script installs dependencies (if needed) and starts the async watcher. Logs print to STDOUT; use a process supervisor for continuous operation.

## Systemd Deployment (Home Assistant OS SSH Add-on)

1. Copy `dashboard-automation.service` to `/etc/systemd/system/`.
2. Copy `.env.example` to `.env`, update secrets, and ensure it is readable by the service.
3. Reload systemd and enable the unit:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dashboard-automation.service
```

## Outputs

- **State:** `/config/dashboard_automation/.dashboard_states.json`
- **Screenshots:** `/config/www/dashboard_screenshots/<dashboard-slug>.png`
- **Docs:** `/config/docs/dashboards/<dashboard>.md`
- **Index:** `/config/docs/dashboards/index.md`

Generated docs reference screenshots via `/local/` URLs, making them immediately available through Home Assistant’s static file server.

## Development

Use Poetry to run ad-hoc commands:

```bash
cd /config/dashboard_automation
../.venv/bin/poetry run env PYTHONPATH=/config python -m dashboard_automation.app
```

The configuration loader writes a `config_snapshot.json` file for debugging. Delete it if you need to regenerate after changing environment variables.
