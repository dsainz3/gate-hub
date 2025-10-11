#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ -z "${PYTHONPATH:-}" ]]; then
  export PYTHONPATH="/config"
elif [[ ":${PYTHONPATH}:" != *":/config:"* ]]; then
  export PYTHONPATH="${PYTHONPATH}:/config"
fi

cd "$SCRIPT_DIR"

if ! command -v poetry >/dev/null 2>&1; then
  POETRY_BIN="$SCRIPT_DIR/../.venv/bin/poetry"
else
  POETRY_BIN="poetry"
fi

"$POETRY_BIN" install >/dev/null
"$POETRY_BIN" run env PYTHONPATH="${PYTHONPATH}" python -m dashboard_automation.app
