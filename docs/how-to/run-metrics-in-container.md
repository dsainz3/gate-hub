# Run repository metrics inside a container

This guide explains how to execute `scripts/metrics.py` from a disposable Docker
container. Using a container keeps the host environment clean and allows you to
reuse cached Python dependencies between runs, which makes repeated scans
significantly faster on CI or developer laptops.

## TL;DR

1. `export GITHUB_TOKEN=<your token>`
2. `docker build -f docker/Dockerfile.metrics -t gate-hub-metrics .`
3. `docker run --rm -e GITHUB_TOKEN -v "$(pwd)/www/metrics:/app/www/metrics" gate-hub-metrics --repo dsainz3/gate-hub --output www/metrics --markdown --html --summary-html`

The following sections expand on each step and include optional flags.

## Prerequisites

- Docker 20.10 or newer installed locally.
- A GitHub personal access token with `repo` scope stored in an environment
  variable called `GITHUB_TOKEN`.

## Build the image

```bash
# From the repository root
docker build -f docker/Dockerfile.metrics -t gate-hub-metrics .
```

The Dockerfile installs the three libraries required by the metrics script
(`requests`, `matplotlib` and `markdown`) and uses the repository copy baked
into the image.

## Run the metrics scan

```bash
docker run --rm \
  -e GITHUB_TOKEN \
  -v "$(pwd)/www/metrics:/app/www/metrics" \
  gate-hub-metrics \
  --repo dsainz3/gate-hub \
  --output www/metrics \
  --markdown --html --summary-html
```

Mounting the `www/metrics` directory makes the generated reports available on
the host machine immediately. Docker caches the layers that install Python
packages, so subsequent builds and runs finish quickly—ideal for iterative
scans.

## Optional: update the README automatically

To mirror the behaviour of the scheduled GitHub Action, pass the
`--update-readme` flag:

```bash
docker run --rm \
  -e GITHUB_TOKEN \
  -v "$(pwd)/www/metrics:/app/www/metrics" \
  gate-hub-metrics \
  --repo dsainz3/gate-hub \
  --output www/metrics \
  --markdown --html --summary-html --update-readme
```

The container entrypoint forwards all additional arguments directly to
`scripts/metrics.py`, so you can add or remove output formats as needed.
