# pre-commit recommendations

The repository relies heavily on YAML configuration, shell automation helpers, and a
couple of Python utilities. The updated `pre-commit` configuration adds coverage
for each of those areas so contributors catch mistakes before pushing.

## Highlights

- **Strengthened safety checks** – hooks for merge conflicts, case-sensitive file
  collisions, large files, and accidentally committed private keys now block the
  most common foot-guns.
- **Config validation** – `check-yaml`, `check-json`, `check-toml`, and
  `check-xml` run quickly and stop malformed config updates from shipping. YAML
  exclusions ensure the Home Assistant files that require manual validation are
  still skipped.
- **Shell script linting** – `shellcheck` now runs on every script in
  `scripts/*.sh`, catching portability issues in the helper utilities used in CI
  and local workflows.
- **Python experience unchanged** – Ruff continues to format and lint the Python
  helpers with the same arguments as before so there is no workflow disruption.

Run all hooks locally with:

```bash
poetry run pre-commit run --all-files
```

Install the hooks into your Git environment with:

```bash
poetry run pre-commit install
```

## Python environment

The project standardizes on the Poetry-managed virtual environment. If you
haven't already created it, bootstrap the dependencies with:

```bash
poetry install
```

Poetry will reuse the same virtualenv for all `poetry run` commands. To work
inside that environment interactively with Poetry 2.x, activate the env using:

```bash
poetry env activate
```

Poetry prints the `source …/activate` command required for your shell—run the
printed command (or execute `eval "$(poetry env activate)"`) to enter the
virtualenv. If you prefer the legacy `poetry shell` workflow, install the
[`poetry-plugin-shell`](https://github.com/python-poetry/poetry-plugin-shell)
plugin.

You can inspect the location of the virtualenv—useful for IDE integration or
manual activation—with:

```bash
poetry env info --path
```

All of the pre-commit examples above assume you're executing within this Poetry
environment so the hooks have the right Python and toolchain available.

### Using a standalone virtualenv

If you prefer to manage a lightweight virtual environment with the standard
library tooling, mirror the CI setup by creating a dedicated `venv`, installing
`pre-commit`, and syncing the configured Python version:

```bash
# Create the virtualenv and activate it
python3.13 -m venv precommit
source precommit/bin/activate

# Install the hooks directly with pip
pip install --upgrade pip pre-commit

# Ensure the hooks use the active interpreter version
sed -i 's/python3.12/python3.13/g' .pre-commit-config.yaml

# Install and exercise the hooks
pre-commit install
pre-commit run --all-files
```

Adjust the Python version in both the `python3.13` command and the
`.pre-commit-config.yaml` edits if your local toolchain uses a different
interpreter.

Refer to `.pre-commit-config.yaml` for the authoritative configuration.
