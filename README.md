# GateHub

This repository houses a hypermodern Home Assistant OS (HAOS) configuration.  It provides
version-controlled infrastructure-as-code for reproducible deployments.

## Repository Structure
- `configuration.yaml` – root configuration that loads automations, scripts, and scenes.
- `automations.yaml` – placeholder list for custom automations.
- `scripts.yaml` – placeholder file for custom scripts.
- `scenes.yaml` – placeholder file for scenes.
- `blueprints/` – curated Home Assistant automation and script blueprints.
- `secrets.yaml` – sample secrets file; replace values before deploying.

## Getting Started
1. Install Home Assistant OS or Home Assistant container.
2. Clone this repository into your Home Assistant configuration directory.
3. Update `secrets.yaml` with real credentials.
4. Restart Home Assistant to apply the configuration.

## Development Notes
- Validate changes with `home-assistant --script check_config` or `yamllint`.
- Keep sensitive values outside version control where possible.
- Use branches and pull requests for substantial changes.

## Poetry Workflow
This repository uses [Poetry](https://python-poetry.org/) to manage developer dependencies such as
`yamllint` and `pre-commit`. To set up the environment run:

```bash
poetry install
```

This will create a virtual environment and install the required tooling.  
You can then run linters via:

```bash
poetry run yamllint .
poetry run pre-commit run --all-files  # once a .pre-commit-config is added
```

## Contributing
Issues and pull requests are welcome.  Please describe your environment and the
purpose of proposed changes.

