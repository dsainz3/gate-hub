#!/usr/bin/env python3
"""Convenience wrapper for running dashboard screenshots using secrets.yaml.

This script loads Home Assistant connection details (base URL + token) from a
secrets file and invokes ``capture_dashboard_screenshots.py`` with the provided
plan. It keeps sensitive values out of the shell history and avoids manual
exporting of environment variables before each run.
"""

from __future__ import annotations

import argparse
import os
from collections.abc import Sequence
from pathlib import Path

import yaml

from scripts.capture_dashboard_screenshots import main as capture_main

DEFAULT_PLAN = Path("docs/how-to/dashboard-screenshot-plan.yaml")
DEFAULT_OUTPUT = Path("docs/assets/screenshots")
DEFAULT_MARKDOWN = Path("docs/reference/dashboard-snapshots")
DEFAULT_SECRETS = Path("secrets.yaml")
DEFAULT_BASE_URL_KEY = "dashboard_capture_base_url"
DEFAULT_TOKEN_KEY = "dashboard_capture_token"


def load_secrets(path: Path) -> dict[str, object]:
    if not path.exists():
        raise FileNotFoundError(
            f"Secrets file {path} does not exist. Provide --secrets."
        )

    with path.open(encoding="utf-8") as handle:
        data = yaml.safe_load(handle) or {}

    if not isinstance(data, dict):
        raise ValueError(f"Secrets file {path} must contain a mapping.")

    return data


def build_capture_args(
    plan: Path,
    output_dir: Path,
    markdown_dir: Path,
    base_url: str,
    token: str,
    headful: bool,
    slow_mo: int,
    force: bool,
    log_level: str | None,
) -> list[str]:
    args: list[str] = [
        "--config",
        str(plan),
        "--output-dir",
        str(output_dir),
        "--markdown-dir",
        str(markdown_dir),
        "--base-url",
        base_url,
        "--token",
        token,
    ]

    if headful:
        args.append("--headful")

    if slow_mo:
        args.extend(["--slow-mo", str(slow_mo)])

    if force:
        args.append("--force")

    if log_level:
        args.extend(["--log-level", log_level])

    return args


def run(argv: Sequence[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--plan",
        type=Path,
        default=DEFAULT_PLAN,
        help="Dashboard capture plan YAML (defaults to docs/how-to/dashboard-screenshot-plan.yaml).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Directory for generated screenshots (defaults to docs/assets/screenshots).",
    )
    parser.add_argument(
        "--markdown-dir",
        type=Path,
        default=DEFAULT_MARKDOWN,
        help="Directory for generated Markdown trackers (defaults to docs/reference/dashboard-snapshots).",
    )
    parser.add_argument(
        "--secrets",
        type=Path,
        default=DEFAULT_SECRETS,
        help="Path to secrets.yaml containing capture credentials.",
    )
    parser.add_argument(
        "--base-url-key",
        default=DEFAULT_BASE_URL_KEY,
        help="Key in the secrets file that holds the HA base URL.",
    )
    parser.add_argument(
        "--token-key",
        default=DEFAULT_TOKEN_KEY,
        help="Key in the secrets file that holds the long-lived token.",
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run the Playwright browser in headed mode.",
    )
    parser.add_argument(
        "--slow-mo",
        type=int,
        default=0,
        help="Delay (ms) between Playwright actions.",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Capture all dashboards even if sources are unchanged.",
    )
    parser.add_argument(
        "--log-level",
        choices=("DEBUG", "INFO", "WARNING", "ERROR"),
        help="Optional log level override for the capture script.",
    )
    args = parser.parse_args(argv)

    secrets = load_secrets(args.secrets)

    base_url_raw = (
        secrets.get(args.base_url_key)
        or os.environ.get("HA_BASE_URL")
        or os.environ.get("HASS_BASE_URL")
    )
    token_raw = (
        secrets.get(args.token_key)
        or os.environ.get("HA_TOKEN")
        or os.environ.get("HASS_LONG_LIVED_TOKEN")
    )

    if base_url_raw is None:
        raise KeyError(
            f"Missing '{args.base_url_key}' in {args.secrets} and HA_BASE_URL/HASS_BASE_URL env vars. "
            "Add the value or override --base-url-key."
        )
    if token_raw is None:
        raise KeyError(
            f"Missing '{args.token_key}' in {args.secrets} and HA_TOKEN/HASS_LONG_LIVED_TOKEN env vars. "
            "Add the value or override --token-key."
        )

    base_url = str(base_url_raw)
    token = str(token_raw)

    if not base_url:
        raise ValueError(
            f"Secret '{args.base_url_key}' in {args.secrets} must not be empty."
        )
    if not token:
        raise ValueError(
            f"Secret '{args.token_key}' in {args.secrets} must not be empty."
        )

    capture_args = build_capture_args(
        args.plan,
        args.output_dir,
        args.markdown_dir,
        base_url,
        token,
        args.headful,
        args.slow_mo,
        args.force,
        args.log_level,
    )
    return capture_main(capture_args)


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(run())
