# automation-builder

A tiny FastAPI service that turns natural-language requests into Home Assistant
automations/blueprints, validates YAML, commits to a branch, and opens a PR.

## Run with Docker Compose
1. Create a GitHub personal access token (repo scope) and export it for Compose:
   ```bash
   export GITHUB_TOKEN=ghp_...
