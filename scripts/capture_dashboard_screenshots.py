"""Capture Home Assistant dashboard screenshots for documentation.

This script uses Playwright to log into Home Assistant with a long-lived
access token and capture PNG screenshots for a list of dashboards. It is
intended to make it easy to keep MkDocs documentation in sync with the
latest UI.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

import yaml
from playwright.sync_api import (
    Browser,
    Page,
    Playwright,
    TimeoutError as PlaywrightTimeoutError,
    sync_playwright,
)

LOGGER = logging.getLogger(__name__)

DEFAULT_WAIT_MS = 1500
DEFAULT_VIEWPORT = {"width": 1920, "height": 1080}


@dataclass(slots=True)
class DashboardSpec:
    """Configuration for a single screenshot run."""

    slug: str
    path: str
    wait_selector: str | None = None
    wait_ms: int = DEFAULT_WAIT_MS
    viewport: Mapping[str, int] = field(
        default_factory=lambda: DEFAULT_VIEWPORT.copy()
    )
    full_page: bool = False
    file_name: str | None = None

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> DashboardSpec:
        try:
            slug = data["slug"]
            path = data["path"]
        except KeyError as err:  # pragma: no cover - defensive
            missing = ", ".join(sorted(data.keys()))
            raise ValueError(
                "Dashboard entries must define 'slug' and 'path'. "
                f"Got keys: {missing}"
            ) from err

        wait_selector = data.get("wait_selector")
        wait_ms = int(data.get("wait_ms", DEFAULT_WAIT_MS))
        viewport_raw = data.get("viewport", {})
        viewport = {
            "width": int(viewport_raw.get("width", DEFAULT_VIEWPORT["width"])),
            "height": int(viewport_raw.get("height", DEFAULT_VIEWPORT["height"])),
        }
        full_page = bool(data.get("full_page", False))
        file_name = data.get("file_name")
        return cls(
            slug=slug,
            path=path,
            wait_selector=wait_selector,
            wait_ms=wait_ms,
            viewport=viewport,
            full_page=full_page,
            file_name=file_name,
        )


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--config",
        type=Path,
        required=True,
        help="Path to the YAML file describing dashboards to capture.",
    )
    parser.add_argument(
        "--base-url",
        default=os.environ.get("HASS_BASE_URL"),
        help="Base URL for the Home Assistant instance (can come from HASS_BASE_URL).",
    )
    parser.add_argument(
        "--token",
        default=os.environ.get("HASS_LONG_LIVED_TOKEN"),
        help="Long-lived access token (can come from HASS_LONG_LIVED_TOKEN).",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("docs/assets/screenshots"),
        help="Directory where screenshots will be stored.",
    )
    parser.add_argument(
        "--headful",
        action="store_true",
        help="Run the browser in headed mode for debugging.",
    )
    parser.add_argument(
        "--slow-mo",
        type=int,
        default=0,
        help="Delay (ms) between Playwright actions to aid debugging.",
    )
    parser.add_argument(
        "--log-level",
        default="INFO",
        choices=("DEBUG", "INFO", "WARNING", "ERROR"),
        help="Logging verbosity.",
    )
    return parser.parse_args(argv)


def load_dashboard_specs(config_path: Path) -> list[DashboardSpec]:
    with config_path.open("r", encoding="utf-8") as handle:
        config = yaml.safe_load(handle)

    dashboards_raw = config.get("dashboards") if isinstance(config, Mapping) else None
    if not dashboards_raw:
        raise ValueError(
            "Configuration file must define a non-empty 'dashboards' list."
        )

    specs = [DashboardSpec.from_mapping(entry) for entry in dashboards_raw]
    LOGGER.debug("Loaded %d dashboards from %s", len(specs), config_path)
    return specs


def ensure_login(page: Page, base_url: str, token: str) -> None:
    login_url = f"{base_url.rstrip('/')}/?auth={token}"
    LOGGER.debug("Logging into Home Assistant via %s", login_url)
    page.goto(login_url, wait_until="networkidle")
    page.wait_for_selector("home-assistant")


def capture_dashboard(
    browser: Browser,
    base_url: str,
    storage_state: Mapping[str, Any],
    spec: DashboardSpec,
    output_dir: Path,
) -> Path:
    LOGGER.info("Capturing dashboard '%s'", spec.slug)
    context = browser.new_context(
        viewport=dict(spec.viewport),
        storage_state=storage_state,
    )
    page = context.new_page()
    target_url = f"{base_url.rstrip('/')}/{spec.path.lstrip('/')}"
    LOGGER.debug("Navigating to %s", target_url)
    page.goto(target_url, wait_until="networkidle")

    if spec.wait_selector:
        LOGGER.debug("Waiting for selector '%s'", spec.wait_selector)
        try:
            page.wait_for_selector(spec.wait_selector, timeout=spec.wait_ms)
        except PlaywrightTimeoutError:
            LOGGER.warning(
                "Selector '%s' did not appear within %sms for %s",
                spec.wait_selector,
                spec.wait_ms,
                spec.slug,
            )
    else:
        LOGGER.debug("Waiting %sms before taking screenshot", spec.wait_ms)
        page.wait_for_timeout(spec.wait_ms)

    file_name = spec.file_name or f"{spec.slug}.png"
    output_path = output_dir / file_name
    output_path.parent.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(output_path), full_page=spec.full_page)
    LOGGER.info("Saved %s", output_path)
    context.close()
    return output_path


def login_and_get_storage(playwright: Playwright, base_url: str, token: str, headless: bool, slow_mo: int) -> tuple[Browser, Mapping[str, Any]]:
    browser = playwright.chromium.launch(headless=headless, slow_mo=slow_mo)
    context = browser.new_context(viewport=DEFAULT_VIEWPORT)
    page = context.new_page()
    ensure_login(page, base_url, token)
    storage_state = json.loads(context.storage_state())
    context.close()
    LOGGER.debug("Obtained authenticated storage state")
    return browser, storage_state


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    logging.basicConfig(level=getattr(logging, args.log_level))

    if not args.base_url or not args.token:
        raise SystemExit(
            "--base-url and --token (or their environment variables) are required."
        )

    specs = load_dashboard_specs(args.config)

    with sync_playwright() as playwright:
        browser, storage_state = login_and_get_storage(
            playwright,
            args.base_url,
            args.token,
            headless=not args.headful,
            slow_mo=args.slow_mo,
        )
        try:
            for spec in specs:
                capture_dashboard(
                    browser,
                    args.base_url,
                    storage_state,
                    spec,
                    args.output_dir,
                )
        finally:
            browser.close()

    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
