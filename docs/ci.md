# CI Overview

Continuous integration lives in `.github/workflows/` and mirrors the local tooling defined in `.pre-commit-config.yaml`.

## Workflows

- `ci.yml` (always on): runs Ruff and the non-Python pre-commit hooks on pushes and pull requests.
- `ha-config-check.yaml` (optional): containerised Home Assistant `check_config` for branches that need full validation.

## Jobs in `ci.yml`

### Ruff

1. Checks out the repository with full history for Ruff cache keys.
2. Installs Python 3.11 and caches dependencies.
3. Runs `ruff check . --output-format=github`.
4. Runs `ruff format --check .` to ensure formatting parity.

### pre-commit (YAML & HA tools)

1. Checks out the repository.
2. Installs Python 3.11 and caches dependencies plus the pre-commit cache.
3. Runs `pre-commit run --all-files` with `SKIP=ruff,ruff-format` to avoid duplicating the Ruff job.

## Local parity

Local validation is equivalent to the jobs above:

```bash
ruff check . && ruff format --check .
pre-commit run --all-files
```

Add `python scripts/ha_check_portable.py` or `ha core check` when you need to mirror the optional Home Assistant workflow.

## Troubleshooting

- Delete `~/.cache/pre-commit` or rerun with `PRE_COMMIT_ALLOW_NO_CONFIG=1` if hook versions stick after updates.
- Clear the Ruff cache (`ruff clean`) when upgrading Ruff to a new major/minor release.
- For HA config validation failures, run `python scripts/ha_check_portable.py --verbose` locally; it will print the docker command it uses.
