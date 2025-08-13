# Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to ensure a consistent
code style.

## Configured hooks

- `trailing-whitespace`
- `end-of-file-fixer`
- `mixed-line-ending` (fixes line endings to LF)
- `check-yaml`
- `check-added-large-files`
- `yamllint` enforcing a maximum YAML line length of 140 characters as configured in `.yamllint.yml`
- `black` enforcing a maximum Python line length of 79 characters
- `flake8` enforcing a maximum Python line length of 79 characters
- `hass-config-check` validates the Home Assistant configuration

Run all checks locally with:

```bash
poetry run pre-commit run --all-files
```
