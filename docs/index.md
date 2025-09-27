---
title: Documentation Index
summary: Entry point for the gate-hub knowledge base organised with the Divio documentation model.
status: active
updated: 2025-09-27
owner: ops-team
---

# Documentation Home

Welcome to the hypermodern documentation set for the gate-hub Home Assistant deployment. Content is grouped using the Divio model so readers can quickly find the right depth:

- **Tutorials** – step-by-step project onboarding (coming soon; contribute via the docs style guide).
- **How-to guides** – task-focused instructions to operate or extend the system.
- **Reference** – authoritative facts, inventories, and API/service contracts.
- **Explanation** – architectural rationale, historical context, and strategy.
- **Archive** – retired experiments kept for institutional memory.

Use the sections below or the navigation in `mkdocs.yml` (once rendered) to browse. See `README.md` in this directory for authoring conventions.

## How-to Guides
- [CI Pipeline Runbook](how-to/ci.md)
- [Pre-commit Hooks](how-to/pre-commit.md)
- [Mosquitto MQTT Add-on](how-to/addons/mqtt.md)
- [Govee2MQTT Add-on](how-to/addons/govee2mqtt.md)
- [Husker Dashboard Guide](how-to/huskers/dashboard.md)
- [Husker LED MQTT Controls](how-to/lighting/husker-led-mqtt.md)

## Reference
- [Automation Catalog](reference/automations.md)
- [Infrastructure Overview](reference/infrastructure.md)

## Explanation
- [Optimization Plan](explanation/optimization-plan.md)
- [Huskers Dashboard History](explanation/huskers-dashboard-history.md)

## Archive
- [AI Automation Builder Prototype](archive/ai-automation-builder.md)

## Architecture Decisions
- ADR template: [adr/_template.md](adr/_template.md)
- Capture decisions for significant changes. Submit a PR adding a new ADR when the decision is accepted.

## Contributing to the Docs
See [README.md](README.md) in this directory for the docs style guide, workflow, and review checklist.
