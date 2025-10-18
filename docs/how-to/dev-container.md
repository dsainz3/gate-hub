---
title: VS Code Dev Container Setup
summary: Build and use the gate-hub development container with Home Assistant OS connectivity.
status: active
category: how-to
updated: 2025-10-20
owner: platform-team
---

# VS Code Dev Container Setup

This guide provisions the dev container defined in `.devcontainer/` and connects it to the Home Assistant OS (HAOS) SSH service on port `2222`.

## Prerequisites

- Docker Desktop or a Linux host with the Docker Engine installed.
- Visual Studio Code with the **Dev Containers** extension.
- SSH access to Home Assistant OS at `root@homeassistant.local:2222` (or a static IP if mDNS is unreliable).
- Your SSH private key available on the host machine.

## Build the Container

1. Clone the repository locally if you have not already:
   ```bash
   git clone https://github.com/dsainz3/gate-hub.git
   cd gate-hub
   ```
2. Open the folder in VS Code.
3. When prompted, choose **Reopen in Container** or run **Dev Containers: Reopen in Container** from the command palette.

The image builds from `mcr.microsoft.com/devcontainers/python:3.11`, installs Poetry, and wires helper scripts defined in `.devcontainer/`.

## Post-create Tasks

The `postCreateCommand` executes `poetry install` automatically. After the dependency sync completes:

- Run `poetry run pre-commit run --all-files` to confirm hooks execute.
- Run `poetry run pytest` to ensure the test suite passes.

These commands are also available via VS Code tasks (see below).

## SSH Access to HAOS from the Container

The container mounts your host `~/.ssh` directory (including `config`, `known_hosts`, and keys) read-only at `/home/vscode/.ssh` so existing keys and host-specific SSH aliases work without copying secrets. Networking runs in host mode so `homeassistant.local` resolves as it does on the host.

Use either of the following from the integrated terminal:

```bash
haos-ssh
haos
```

- `haos-ssh` is a helper script that wraps `ssh root@homeassistant.local -p 2222` (or uses `HA_HOST`/`HA_PORT` if set).
- `haos` is a shell function sourced from `.devcontainer/profile.d/haos.sh`. Pass additional SSH arguments as needed (for example, `haos -L 1883:localhost:1883`).

Set environment variables when you need explicit connectivity overrides:

```bash
export HA_HOST=192.168.50.20
export HA_PORT=2222
```

## VS Code Tasks

Three tasks ship with the workspace (`.vscode/tasks.json`):

1. **Run pre-commit** – executes `poetry run pre-commit run --all-files`.
2. **Run pytest** – executes `poetry run pytest`.
3. **SSH to Home Assistant OS** – runs `haos-ssh` for one-click shell access.

Use the command palette (**Tasks: Run Task…**) to launch any of them.

## Troubleshooting

- **Cannot resolve `homeassistant.local`:** Export `HA_HOST` to the device IP address. Host networking mode allows direct access.
- **Permission issues reading SSH keys:** Ensure the host key files are readable by the user running VS Code and are not stored in a hardware-backed agent.
- **Poetry not found:** The container installs Poetry through `pipx`. Reopen the folder in the container if the path was not refreshed (`Dev Containers: Rebuild Container`).

Document any additional findings in the ops journal or update this guide to keep onboarding smooth.
