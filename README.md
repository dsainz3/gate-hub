# Gate Hub · Hypermodern Home Automation Journey

<!-- Badges -->
[![CI](https://github.com/dsainz3/gate-hub/actions/workflows/ci.yml/badge.svg)](https://github.com/dsainz3/gate-hub/actions/workflows/ci.yml)
![License](https://img.shields.io/github/license/dsainz3/gate-hub)
![Last Commit](https://img.shields.io/github/last-commit/dsainz3/gate-hub)
![Repo Size](https://img.shields.io/github/repo-size/dsainz3/gate-hub)
![Open Issues](https://img.shields.io/github/issues/dsainz3/gate-hub)
![Open PRs](https://img.shields.io/github/issues-pr/dsainz3/gate-hub)
![Code Style: Ruff](https://img.shields.io/badge/code%20style-ruff-1f425f.svg)
![YAML: prettier+yamllint](https://img.shields.io/badge/yaml-prettier%20%2B%20yamllint-blue)
![Python](https://img.shields.io/badge/python-3.11-blue)

## Repository Metrics Summary

<!-- METRICS:START -->
## Repository health snapshot
_Updated 2025-10-24T06:18:41.612162+00:00Z_

- Daily commits: **1** (-87.5%)
- Weekly commits: **93** (-46.6%)
- Monthly commits: **454** (+226.6%)
- Median PR merge time: **0.00 days**
<!-- METRICS:END -->

## Repo Metrics & Devices Dashboard

The new Lovelace package at `dashboards/repo-metrics.dashboard.yaml` turns the repository
itself into a first-class “device” within Home Assistant. The dashboard is built from two
complementary intentions:

1. **Operational awareness for the home.** Core KPI chips surface lights-on counts,
   stale sensors, network latency, and firmware updates in one glance while area views
   keep lighting, climate, and safety controls organised. The layout lives entirely in
   version control so pull requests review both behaviour and presentation.
2. **Engineering telemetry for the repo.** A dedicated GitHub Metrics view displays the
   generated charts under `/local/metrics`, workflow status, and highlight sensors that
   read from `packages/repo_metrics.yaml`. Run the “Repository metrics” GitHub Action—or
   the in-dashboard “Run GitHub Metrics” chip—to regenerate the assets and refresh the
   Overview badges.

Together these views anchor the observability story: daily operations stay visible from
the Overview while long-term engineering signals live a tap away. See
`docs/repo_metrics_dashboard.md` for installation and customisation guidance.

Gate Hub is my learning lab for becoming a hypermodern development engineer. What started as a set of ad-hoc Home Assistant tweaks now operates like a product team project: infrastructure is versioned, documentation is intentional, and automations ship with CI guardrails. This repository captures the journey from the early experimentation days to the current platform and surfaces the skills I am building along the way. Wherever you see “Football Team” in the documentation, swap in your own club branding and entity IDs—the configuration remains opinionated, but every guide explains how to customise it safely.

---

## Journey Highlights

- **Market signals → daily golden cross digest:** A Yahoo Finance-driven Pyscript ranks the
  top sub-$20 equities with fresh SMA-50/200 crosses, publishes a digest sensor, and renders a
  dedicated Lovelace dashboard with Mushroom chips, Markdown tables, and 30-day spread charts.
- **Manual dashboards → reproducible platform:** Early Football Team and room dashboards lived only in the UI. They now render from YAML stored in Git (`dashboards/`), as chronicled in `docs/explanation/football-team-dashboard-history.md`.
- **Scattered toggles → unified operations console:** `dashboards/automations.dashboard.yaml` exposes every automation, last-triggered timestamp, and scene button behind an admin-only Automations sidebar entry, keeping reloads and manual triggers in one place.
- **Scripts on disk → portable tooling:** Inline fixes gave way to reusable helpers such as `scripts/ha_check_portable.py`, with the broader roadmap laid out in `docs/explanation/optimization-plan.md`.
- **Live spoilers → buffered scoreboard:** The Football Team package now copies TeamTracker scores, quarter, and clock into manual helpers with a 30-second parallel delay queue so ESPN clock ticks stop cancelling the spoiler hold for streaming viewers. See the updated guide in `docs/how-to/football-team/dashboard.md`.
- **Guesswork → disciplined workflows:** The pipeline in `.github/workflows/ci.yml`, paired with the pre-commit strategy in `docs/explanation/pre-commit-strategy.md`, keeps every change reviewable.
- **Personal notes → Divio-style documentation:** `docs/index.md` curates how-to guides, references, explanations, and archives so future contributors can find the right depth quickly.
- **Aspirations → measurable backlog:** `TODO.md` and the optimisation plan anchor next steps, from recorder tuning to system monitoring.

---

## Skills in Focus

- **Infrastructure-as-code discipline:** Modular packages (`packages/`), templated dashboards, and include-driven YAML keep the platform deterministic.
- **Automation architecture:** Complex routines such as the Football Team game-day experience blend sensors, scripts, and themes to coordinate lighting, notifications, and dashboards.
- **Developer experience & CI/CD:** Poetry-based tooling, Ruff, Prettier, Yamllint, and GitHub Actions enforce code quality. Pre-commit keeps pull requests green and reviews focused on behaviour.
- **Observability & optimisation:** Roadmapped work (system monitor sensors, MQTT performance metrics, backups) demonstrates the shift toward measurable reliability.
- **Documentation & knowledge sharing:** Every major feature has a guide—lighting stacks, agenda planner, add-ons—reflecting the documentation culture described in `docs/reference/documentation-style-guide.md`.

---

## Current System Snapshot

- **Core platform:** Home Assistant OS with supervised add-ons, developed remotely via VS Code as documented in `docs/reference/infrastructure.md`.
- **Integrations:** Zigbee2MQTT, MQTT, TP-Link Deco mesh monitoring, BLE sensors, Wunderground PWS, Govee lighting, TeamTracker sports data.
- **Experience layers:** Football Team Game Day dashboards, networking & system observability boards, kiosk interfaces, media lab controls for Plex + Fire TV, plus the Automations & Scenes console for operators.
- **Runtime extensions:** Pyscript powers the Stocks Golden Cross scanner—install the Pyscript
  integration and reload it after deploys so `pyscript.stocks_golden_cross_update` is available.
- **Themes:** Football Team palette variables live in `packages/huskers.yaml` so the Huskers package owns the entire experience. The Huskers Cream variant anchors dashboards with a cream base, black accents, and scarlet gradient shadows, and the docs call out where to adjust colours and typography for your team.

---

## Repository Map

```
.
├─ configuration.yaml          # entry point wiring includes and packages
├─ automations.yaml            # base automations outside feature packages
├─ templates.yaml              # template sensors & helpers (refactor in flight)
├─ packages/                   # feature bundles: football team, agenda, networking…
├─ dashboards/                 # YAML Lovelace dashboards and kiosk views
├─ custom_components/          # checked-in integrations (wundergroundpws, hacs validators)
├─ scripts/                    # validation helpers, entity exporters, tooling
├─ docs/                       # Divio-structured knowledge base
└─ TODO.md                     # active learning backlog
```

See `docs/reference/infrastructure.md` for the full environment outline and IDE workflow.

---

## Repository Line Counts

Line counts stay current via `scripts/update_loc_stats.py`, which skips everything under `custom_components/` to focus on the core configuration.

```bash
poetry run python scripts/update_loc_stats.py
```

<!-- LOC_COUNTS_START -->
_Last updated: 2025-10-09 14:12 UTC_

**Total lines (excluding `custom_components/`):** 62,035

### Lines by Language

| Category | Lines |
| --- | ---: |
| HTML | 36,227 |
| YAML | 13,744 |
| JavaScript | 7,257 |
| Markdown | 2,162 |
| Python | 1,427 |
| Lockfile | 1,001 |
| Other | 110 |
| TOML | 58 |
| Shell | 39 |
| SVG | 4 |
| XML | 3 |
| CSS | 2 |
| JSON | 1 |

### Lines by Extension

| Category | Lines |
| --- | ---: |
| .html | 36,227 |
| .yaml | 13,524 |
| .js | 7,257 |
| .md | 2,162 |
| .py | 1,427 |
| .lock | 1,001 |
| .yml | 220 |
| <no extension> | 91 |
| .toml | 58 |
| .sh | 39 |
| .map | 16 |
| .svg | 4 |
| .xml | 3 |
| .pub | 3 |
| .css | 2 |
| .json | 1 |
<!-- LOC_COUNTS_END -->

---

## Learning Artifacts & Key Reading

- **How-to guides (`docs/how-to/`):** Lighting stacks (`lighting/govee-lighting-stack.md`), Football Team dashboard operations (`football-team/dashboard.md`), add-on runbooks (`addons/mqtt.md`, `addons/govee2mqtt.md`), F1 dashboard instructions (`f1/index.md`), and CI/pre-commit walkthroughs (`docs/how-to/ci.md`, `docs/how-to/pre-commit.md`).
- **Reference set (`docs/reference/`):** Automation catalog, infrastructure overview, holiday logic, agenda planner, theater media package, and the documentation style guide that keeps contributions consistent.
- **Explanation papers (`docs/explanation/`):** Optimisation roadmap, Football Team dashboard history, and pre-commit strategy—each narrates why architectural decisions were made.
- **Archive (`docs/archive/ai-automation-builder.md`):** Retired experiments preserved for context.
- **Templates & ADRs (`docs/adr/_template.md`):** Structure for capturing future architectural decisions.

Use these documents as the study material for sharpening system design, tooling, and documentation habits.

---

## Automation & Tooling Workflow

- **Dev container:** Open the repo in VS Code and choose **Dev Containers: Reopen in Container** to build the image defined in `.devcontainer/`. The container mounts your SSH keys read-only and exposes helper scripts (`haos-ssh`, `haos`) pre-configured for `root@homeassistant.local:2222`. See [VS Code Dev Container Setup](docs/how-to/dev-container.md) for details.
- **Local setup:** `poetry env use 3.11`, `poetry install`, and `pre-commit install` provision the tooling stack. Pip-based installs remain an option if Poetry is unavailable.
- **Validation loop:** Run `pre-commit run --all-files`, `ha core check`, `python scripts/ha_check_portable.py`, and `pytest` before pushing to guarantee clean builds.
- **Secrets hygiene:** `.ci/fakesecrets.yaml` supplies CI with stub credentials; real values stay in `secrets.yaml` on the Home Assistant host.
- **Entity exploration:** `poetry run python scripts/export_entities.py --token-file ~/.ha_token` exports an entity index to `docs/entities.md` without leaking runtime state.

---

## Active Learning Backlog

`TODO.md` tracks the growth areas I am tackling next:
- Retire legacy helper scripts and modernise the CI config to rely on supported tooling.
- Resolve the Football Team theme header edge case and validate reload behaviour.
- Implement system monitoring sensors, MQTT performance metrics, and alerting.
- Consolidate household device automations into a reusable package.
- Expand weather dashboards with richer providers and responsive layouts.
- Externalise recorder includes and restore full F1 telemetry coverage.

Progress queues feed back into the optimisation plan so improvements build on one another rather than landing as one-off fixes.

---

## Getting Hands-On

1. **Clone into `/config`:**
   ```bash
   git clone https://github.com/dsainz3/gate-hub.git /config
   ```
2. **Provide secrets:** Copy `.ci/fakesecrets.yaml` to `secrets.yaml` (or author your own) and populate real credentials.
3. **Restore local-only snapshots:** Duplicate example runtime files (`state.example.json`, `devices.example.json`) to `.local.json` variants that stay ignored by Git.
4. **Enable tooling:** Follow the local setup commands above, then activate pre-commit hooks.

---

## Validation Checklist

```bash
ha core check                         # Home Assistant CLI validation
pre-commit run --all-files            # Formatting, linting, HA config checks
python scripts/ha_check_portable.py   # Dockerised Home Assistant validation
pytest                                # Unit tests and integration shims
```

These checks mirror the CI pipeline so every experiment stays production-ready.

---

## What Comes Next

- Continue executing the optimisation roadmap (recorder, logger, monitoring branches) to harden the platform.
- Publish new documentation as features evolve—tutorials and ADRs are the next gaps.
- Translate learnings into shareable patterns, whether that is template reorganisations, dashboard blueprints, or add-on guides.

Gate Hub remains the sandbox where I practise being a hypermodern development engineer: ship small, document decisions, automate validation, and keep the smart home dependable.
