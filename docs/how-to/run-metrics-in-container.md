# Run repository metrics inside a container

This guide explains how to execute `scripts/metrics.py` from a disposable Docker
container. Using a container keeps the host environment clean and allows you to
reuse cached Python dependencies between runs, which makes repeated scans
significantly faster on CI or developer laptops.

## TL;DR

1. `printf 'github_token: <your token>\n' >> secrets.yaml`
2. `docker build -f docker/Dockerfile.metrics -t gate-hub-metrics .`
3. `docker run --rm -v "$(pwd)/secrets.yaml:/app/secrets.yaml:ro" -v "$(pwd)/www/metrics:/app/www/metrics" gate-hub-metrics --repo dsainz3/gate-hub --output www/metrics --markdown --html --summary-html`

The following sections expand on each step and include optional flags.

## Prerequisites

- Docker 20.10 or newer installed locally.
- A GitHub personal access token with `repo` scope stored in `secrets.yaml`
  under the key `github_token`.

If you already keep a `secrets.yaml` for Home Assistant, add the new entry to it:

```yaml
github_token: YOUR_GITHUB_PAT
```

The metrics script also understands the legacy
`github_repo_metrics_auth_header` key, trimming the `Bearer` prefix
automatically. If you would rather store the credentials elsewhere, point the
container (or the local script) at the path with `--secrets /path/to/secrets`.

## Build the image

```bash
# From the repository root
docker build -f docker/Dockerfile.metrics -t gate-hub-metrics .
```

The Dockerfile installs the Python libraries required by the metrics script
(`requests`, `matplotlib`, `markdown` and `pyyaml` for parsing secrets) and
uses the repository copy baked into the image.

## Run the metrics scan

```bash
docker run --rm \
  -v "$(pwd)/secrets.yaml:/app/secrets.yaml:ro" \
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
  -v "$(pwd)/secrets.yaml:/app/secrets.yaml:ro" \
  -v "$(pwd)/www/metrics:/app/www/metrics" \
  gate-hub-metrics \
  --repo dsainz3/gate-hub \
  --output www/metrics \
  --markdown --html --summary-html --update-readme
```

The container entrypoint forwards all additional arguments directly to
`scripts/metrics.py`, so you can add or remove output formats as needed.
