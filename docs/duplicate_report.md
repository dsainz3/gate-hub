# Duplicate entity report

Generated: 2025-10-13 16:12 UTC

No duplicates detected across tracked domains.

## Manual overlaps worth investigating

### Legacy Lovelace dashboards

Several Huskers dashboard views live in both the modern `lovelace/` bundle and
the legacy `ui-lovelace/` directory. The YAML is nearly identical, which means
both paths need to be maintained in lockstep:

- Huskers HQ: `lovelace/views/20_hq.yaml` and `ui-lovelace/views/10_hq.yaml`.
- Huskers LED test controls: `lovelace/views/10_led_test.yaml` and
  `ui-lovelace/views/30_led_test.yaml`.
- Huskers control panel: `lovelace/views/30_controls.yaml` and
  `ui-lovelace/views/20_controls.yaml`.
- Huskers fan zone: `lovelace/views/50_fan_zone.yaml` and
  `ui-lovelace/views/40_fan_zone.yaml`.

Consolidating on one directory (with redirects or migration notes) would remove
the duplicated maintenance burden.

### Multiple config-check helpers

Three scripts wrap the Home Assistant `check_config` command with slightly
different behaviour (`scripts/ha_check_portable.py`,
`scripts/ha_check_portable.sh`, and `scripts/hass_check.py`/`scripts/hass_check.sh`).

They all execute a Docker (or supervisor) based config validation, but the
Python version handles fake secrets generation while the shell scripts vary on
image pinning and podman support. Consolidating the logic into a single helper
would keep behaviour consistent.
