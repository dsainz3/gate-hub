#!/usr/bin/env bash
set -euo pipefail
CONFIG_DIR="${CONFIG_DIR:-$PWD}"
IMAGE="${HA_IMAGE:-ghcr.io/home-assistant/home-assistant:2025.8.2}"
if command -v ha >/dev/null 2>&1; then
  echo "[hass-check] Using 'ha core check' ..."
  ha core check
  exit $?
fi
if command -v docker >/dev/null 2>&1; then
  echo "[hass-check] Using docker image $IMAGE ..."
  docker run --rm -v "$CONFIG_DIR":/config "$IMAGE" \
    python -m homeassistant --config /config --script check_config
  exit $?
fi
if command -v podman >/dev/null 2>&1; then
  echo "[hass-check] Using podman image $IMAGE ..."
  podman run --rm -v "$CONFIG_DIR":/config "$IMAGE" \
    python -m homeassistant --config /config --script check_config
  exit $?
fi
echo "[hass-check] Skipped: no 'ha', 'docker', or 'podman' available. Run the config check in CI instead." >&2
exit 0
