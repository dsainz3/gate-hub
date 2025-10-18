#!/usr/bin/env bash
# shellcheck shell=bash

export HA_HOST=${HA_HOST:-homeassistant.local}
haos() {
    local port="${HA_PORT:-2222}"
    ssh "root@${HA_HOST}" -p "$port" "$@"
}
