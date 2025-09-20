# Monitoring Stack Runbook

This runbook describes the Grafana monitoring stack in Home Assistant for visualization and alerting.

---

## 1. Architecture Overview
- **Data**: Home Assistant's built-in recorder stores history and statistics
- **Visualization**: Grafana add-on provides dashboards, alerting, and ad-hoc analysis
- **Health Signals**: `packages/monitoring_stack.yaml` exposes health sensors to surface availability

Key secrets live in `secrets.yaml`; placeholders remain in git to describe the expected structure.

---

## 2. Configure Home Assistant Recording
1. Review `recorder` configuration in `configuration.yaml` to tune data retention
2. Use include/exclude lists to optimize storage and query performance
3. Consider purge strategies based on entity importance and storage constraints

---

## 3. Deploy Grafana
1. Complete [`docs/addons/grafana.md`](./addons/grafana.md) to provision the visualization layer
2. Configure Home Assistant as a data source
3. Import starter dashboards
4. Create folders by domain (e.g., `System`, `Climate`, `Automations`, `Energy`)

Use the `sensor.monitoring_stack_status` entity to show high-level readiness in Lovelace or voice assistants.

---

## 4. Alerting Workflow
1. In Grafana, configure contact points for Home Assistant webhook, mobile app push, or Slack/Teams
2. Define multi-level alert rules:
   - Infrastructure: CPU, memory, disk for HA host/add-ons
   - Home signals: temperature deviations, door sensors, energy spikes
   - Automation reliability: failure counts per automation
3. Route alerts back into HA automations via webhook or MQTT to reuse existing notification flows
4. Track alert lifecycle in Grafana and mirror critical states in HA dashboards (e.g., a tile bound to `monitoring_stack_status`)

---

## 5. Maintenance & Operations
- **Backups**: Include exported Grafana dashboards in routine backups
- **Upgrades**: Update add-ons one at a time; validate health sensors after each upgrade
- **Capacity**: Monitor Home Assistant database size and performance
- **Runbooks**: Log incident timelines in `docs/logs/YYYY-MM-DD-monitoring.md` to capture lessons learned

### Quick Checks
| Task | Command/Location | Expected Outcome |
| --- | --- | --- |
| Grafana health | `GET /api/health` with API key | JSON `{"status":"ok"}` |
| HA History | Developer Tools > Statistics | Expected entities present |
| Stack summary | `sensor.monitoring_stack_status` | `ready` or `offline` |

Keep this document updated as dashboards and alert rules evolve.
