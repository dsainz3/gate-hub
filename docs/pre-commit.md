# Pre-commit Hooks

This repository enforces formatting and validation with [pre-commit](https://pre-commit.com/). Hooks run automatically on commit after you install the git hook, and the same configuration is executed inside CI.

## Configured hooks

- `prettier` (YAML only) for fast declarative formatting
- `trailing-whitespace`, `end-of-file-fixer`, `mixed-line-ending`, and `check-yaml` from `pre-commit-hooks`
- `yamllint` with the project `.yamllint.yml`
- `ruff` (lint + autofix) and `ruff-format` for Python code
 - `hass-config-check` which runs the Home Assistant config check in CI; locally prefer `ha core check` or the CI workflow for parity.

## Install & run locally

```bash
poetry install        # installs Ruff + pre-commit into the virtualenv
pre-commit install    # sets up the git hook
```

Run the full suite on demand:

```bash
pre-commit run --all-files
```

To skip specific hooks temporarily (for example during rapid iteration) use:

```bash
SKIP=ruff,ruff-format pre-commit run --all-files
```

Remember to re-run without the skip flag before pushing. Hooks that apply changes (`ruff --fix`, `prettier`, etc.) must be re-staged before committing.
