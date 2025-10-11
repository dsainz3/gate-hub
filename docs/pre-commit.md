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

Refer to `.pre-commit-config.yaml` for the authoritative configuration.
