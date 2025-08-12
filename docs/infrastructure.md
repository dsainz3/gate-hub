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

## Git Integration

Clone the repository directly into the Home Assistant `/config` directory:

```bash
cd /config
git clone https://github.com/dsainz3/gate-hub.git .
```

To prevent repeated credential prompts, store a GitHub personal access token in `~/.netrc`:

```text
machine github.com
  login dsainz3
  password <TOKEN>
```

Secure the file with `chmod 600 ~/.netrc`.

## Repository Structure

```
.
├─ configuration.yaml
├─ automations.yaml
├─ blueprints/
├─ scripts.yaml
├─ scenes.yaml
└─ docs/
```

This structure forms the baseline for rebuilding the HAOS infrastructure in a hypermodern methodology.


