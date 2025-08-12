# Infrastructure Overview

This project, **gate-hub**, defines a reproducible Home Assistant OS (HAOS) environment.

## VS Code Workspace

The repository is intended to be opened within VS Code. A minimal, anonymized `.vscode` configuration could look like:

```json
{
  "name": "haos-workspace",
  "extensions": [
    "ms-python.python",
    "esbenp.prettier-vscode"
  ],
  "settings": {
    "editor.tabSize": 2
  }
}
```

## Home Assistant OS

- Recorded version: `2025.8.1` (see `.HA_VERSION`)
- Host-specific details are intentionally redacted.

## Repository Structure

```
.
├─ configuration.yaml
├─ automations.yaml
├─ blueprints/
├─ scripts.yaml
└─ scenes.yaml
```

This structure forms the baseline for rebuilding the HAOS infrastructure in a hypermodern methodology.

