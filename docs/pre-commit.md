# Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) to ensure a consistent
code style.

## Configured hooks

- `trailing-whitespace` and `end-of-file-fixer` from `pre-commit-hooks`
- `yamllint` enforcing a maximum line length of 79 characters
- `flake8` enforcing a maximum Python line length of 79 characters

Run all checks locally with:

```bash
pre-commit run --all-files
```

