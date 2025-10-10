---
title: Documentation Index
summary: Entry point for the gate-hub knowledge base organised with the Divio documentation model.
status: active
updated: 2025-10-10
owner: ops-team
---

# Documentation Home

Welcome to the hypermodern documentation set for the gate-hub Home Assistant deployment. Content is grouped using the Divio model so readers can quickly find the right depth:

Latest highlights:
- Snapshot view now includes a dedicated agenda column showing the household calendar.
- Agenda Planner package + kiosk view enable event/task entry from HA tablets.
- Support · Test Resources dashboard adds a Plex · Theater lab with direct Fire TV controls and the HA Media Browser.
- Admin-only Automations dashboard now inventories every automation, last-triggered timestamp, and scene button, with a companion Scenes view for one-tap presets.


- **Tutorials** – step-by-step project onboarding (coming soon; contribute via the docs style guide).
- **How-to guides** – task-focused instructions to operate or extend the system.
- **Reference** – authoritative facts, inventories, and API/service contracts.
- **Explanation** – architectural rationale, historical context, and strategy.
- **Archive** – retired experiments kept for institutional memory.

Use the sections below or the navigation in `mkdocs.yml` (once rendered) to browse. See the [Documentation Style Guide](reference/documentation-style-guide.md) for authoring conventions.

## How-to Guides
- [CI Pipeline Runbook](how-to/ci.md)
- [Pre-commit Hooks](how-to/pre-commit.md)
- [Mosquitto MQTT Add-on](how-to/addons/mqtt.md)
- [Govee2MQTT Add-on](how-to/addons/govee2mqtt.md)
- [Football Team Dashboard Guide](how-to/football-team/dashboard.md) *(TeamTracker card, tailgate window, conference standings, lighting macros)*
- [Football Team LED MQTT Controls](how-to/lighting/husker-led-mqtt.md)
- [Govee Lighting Stack](how-to/lighting/govee-lighting-stack.md)
- [F1 Package & Dashboard](how-to/f1/index.md)
- [Pre-prod Push Checklist](how-to/pre-prod-checklist.md)
- [Kiosk Camera Overview](how-to/kiosk/camera-overview.md)

## Reference
- [Automation Catalog](reference/automations.md)
- [Holiday Mode Reference](reference/holidays.md)
- [Basement Theater Media Package](reference/theater-media.md)
- [Infrastructure Overview](reference/infrastructure.md)
- [Agenda Planner Package](reference/agenda-planner.md)
- [Configure Agenda Planner Calendars & Todo Lists](how-to/agenda-planner.md)

## Explanation
- [Optimization Plan](explanation/optimization-plan.md)
- [Football Team Dashboard History](explanation/football-team-dashboard-history.md)
- [Pre-commit Quality Strategy](explanation/pre-commit-strategy.md)

## Archive
- [AI Automation Builder Prototype](archive/ai-automation-builder.md)

## Architecture Decisions
- ADR template: [adr/_template.md](adr/_template.md)
- Capture decisions for significant changes. Submit a PR adding a new ADR when the decision is accepted.

## Contributing to the Docs
See the [Documentation Style Guide](reference/documentation-style-guide.md) for the docs workflow and review checklist.
