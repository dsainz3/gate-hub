#!/usr/bin/env sh
set -e

if command -v ha >/dev/null 2>&1; then
  # HAOS / Supervisor CLI present
  exec ha core check
elif command -v docker >/dev/null 2>&1; then
  # Fallback for dev machines that have Docker
  exec docker run --rm \
    -v "$PWD":/config \
    ghcr.io/home-assistant/home-assistant:stable \
    python -m homeassistant --config /config --script check_config
else
  echo "Skipping HA config check: no ha or docker available"
  exit 0
fi
