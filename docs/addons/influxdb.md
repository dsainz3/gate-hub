# InfluxDB Add-on Setup

This guide captures the Home Assistant OS add-on configuration for the InfluxDB v2 stack that backs Grafana dashboards.

## Prerequisites
- Home Assistant Supervisor access with the Add-on Store.
- Sufficient storage for time-series retention (target 30-90 days).
- Secrets defined in `secrets.yaml` (see keys starting with `influxdb_`).

## Install & Configure
1. **Install** the official InfluxDB add-on from the Home Assistant add-on store.
2. Open the add-on options and set:
   - `http_port`: `8086` (default)
   - `log_level`: `info`
   - `auth`: `true`
   - `ssl`: `false` (managed via HA network)
   - `certfile` / `keyfile`: leave default unless you terminate TLS locally.
3. Start the add-on and enable both *Start on boot* and *Watchdog*.
4. Launch the **Web UI** and complete the onboarding wizard:
   - Organization: `gate-hub`
   - Bucket: `homeassistant` with 30d retention to start.
   - Admin token: store in `secrets.yaml` as `influxdb_token`.

## API Tokens
Create scoped tokens so Grafana and automations avoid using the bootstrap admin token:

- **Grafana token**: read access to the `homeassistant` bucket; copy into `secrets.yaml` once created.
- **Maintenance token** (optional): read/write for ad-hoc metrics or CLI imports.

Record the token values in an out-of-band secret manager; only short placeholders live in git.

## Health & Maintenance
- Health endpoint: `http://a0d7b954-influxdb:8086/health` (surfaced via the `binary_sensor.monitoring_influxdb_health`).
- Monitor `_internal` bucket to confirm retention and resource usage.
- Back up the volume via HA snapshots or external exports.

## CLI Helpers
Use the add-on's embedded `influx` CLI via the container shell:

```bash
ha addons open a0d7b954_influxdb
# or from SSH add-on
docker exec -it addon_a0d7b954_influxdb influx bucket list
```

Retain these steps in `docs/monitoring-stack.md` for cross-component workflow references.
