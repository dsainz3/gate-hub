"""Capture Home Assistant dashboard screenshots for documentation.

This script uses Playwright to log into Home Assistant with a long-lived
access token and capture PNG screenshots for a list of dashboards. It is
intended to make it easy to keep MkDocs documentation in sync with the
latest UI.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
from collections.abc import Mapping, Sequence
from dataclasses import dataclass, field
from datetime import UTC, datetime
from pathlib import Path
from typing import Any
from urllib.parse import urljoin

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


def _redact_token(token: str) -> str:
    """Return a minimally useful but redacted representation of a token."""

    if not token:
        return "<empty>"

    if len(token) <= 8:
        return "*" * len(token)

    return f"{token[:4]}…{token[-4:]}"


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
    sources: tuple[Path, ...] = field(default_factory=tuple)
    sources_display: tuple[str, ...] = field(default_factory=tuple)
    markdown: Path | None = None
    title: str | None = None

    @staticmethod
    def _resolve_path(
        value: str | os.PathLike[str], base_path: Path | None
    ) -> Path:
        path = Path(value)
        if base_path and not path.is_absolute():
            return (base_path / path).resolve()
        return path.resolve()

    @classmethod
    def from_mapping(
        cls, data: Mapping[str, Any], base_path: Path | None = None
    ) -> DashboardSpec:
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
            "height": int(
                viewport_raw.get("height", DEFAULT_VIEWPORT["height"])
            ),
        }
        full_page = bool(data.get("full_page", False))
        file_name = data.get("file_name")
        sources_raw = data.get("sources", ())
        if isinstance(sources_raw, str | os.PathLike[str]):
            sources_list = [str(sources_raw)]
        else:
            sources_list = [str(item) for item in sources_raw]
        sources_display = tuple(sources_list)
        sources = tuple(
            cls._resolve_path(item, base_path) for item in sources_list
        )
        markdown_raw = data.get("markdown")
        markdown = (
            cls._resolve_path(markdown_raw, base_path)
            if markdown_raw
            else None
        )
        title = data.get("title")
        return cls(
            slug=slug,
            path=path,
            wait_selector=wait_selector,
            wait_ms=wait_ms,
            viewport=viewport,
            full_page=full_page,
            file_name=file_name,
            sources=sources,
            sources_display=sources_display,
            markdown=markdown,
            title=title,
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
        "--markdown-dir",
        type=Path,
        default=Path("docs/reference/dashboard-snapshots"),
        help=(
            "Directory where Markdown trackers will be stored "
            "(will be created if missing)."
        ),
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="Capture dashboards even when tracked sources look unchanged.",
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

    dashboards_raw = (
        config.get("dashboards") if isinstance(config, Mapping) else None
    )
    if not dashboards_raw:
        raise ValueError(
            "Configuration file must define a non-empty 'dashboards' list."
        )

    base_path = config_path.parent
    specs = [
        DashboardSpec.from_mapping(entry, base_path=base_path)
        for entry in dashboards_raw
    ]
    LOGGER.debug("Loaded %d dashboards from %s", len(specs), config_path)
    return specs


def ensure_login(page: Page, base_url: str, token: str) -> None:
    base = base_url.rstrip("/") + "/"
    login_url = urljoin(base, "?auth=" + token)
    LOGGER.debug(
        "Logging into Home Assistant using token %s", _redact_token(token)
    )
    page.goto(login_url, wait_until="networkidle")
    page.wait_for_selector("home-assistant")


def capture_dashboard(
    browser: Browser,
    base_url: str,
    storage_state: Mapping[str, Any],
    spec: DashboardSpec,
    output_path: Path,
) -> bytes:
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

    output_path.parent.mkdir(parents=True, exist_ok=True)
    image_bytes = page.screenshot(
        path=str(output_path), full_page=spec.full_page
    )
    LOGGER.info("Saved %s", output_path)
    context.close()
    return image_bytes


def should_capture(
    spec: DashboardSpec, screenshot_path: Path, force: bool
) -> bool:
    """Return True if a dashboard should be recaptured."""

    if force:
        LOGGER.debug("Force flag set; recapturing '%s'", spec.slug)
        return True

    if not screenshot_path.exists():
        LOGGER.debug(
            "Screenshot %s missing for '%s'", screenshot_path, spec.slug
        )
        return True

    if not spec.sources:
        LOGGER.debug(
            "No tracked sources for '%s'; defaulting to recapture", spec.slug
        )
        return True

    try:
        screenshot_mtime = screenshot_path.stat().st_mtime
    except FileNotFoundError:  # pragma: no cover - defensive
        return True

    for source in spec.sources:
        try:
            if source.stat().st_mtime > screenshot_mtime:
                LOGGER.debug(
                    "Source %s newer than screenshot for '%s'",
                    source,
                    spec.slug,
                )
                return True
        except FileNotFoundError:
            LOGGER.debug(
                "Tracked source %s missing when evaluating '%s'",
                source,
                spec.slug,
            )
            return True

    return False


def _compute_hash(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _title_for_spec(spec: DashboardSpec) -> str:
    if spec.title:
        return spec.title
    cleaned = spec.slug.replace("-", " ").replace("_", " ")
    return cleaned.title() or spec.slug


def _relpath(path: Path, base: Path) -> str:
    try:
        rel = path.relative_to(base)
    except ValueError:
        rel = Path(os.path.relpath(path, base))
    return rel.as_posix()


def write_markdown_summary(
    spec: DashboardSpec,
    screenshot_path: Path,
    markdown_path: Path,
    image_hash: str,
    timestamp: datetime,
) -> None:
    """Render/update the Markdown tracker for a dashboard."""

    markdown_path.parent.mkdir(parents=True, exist_ok=True)
    image_rel = _relpath(screenshot_path, markdown_path.parent)
    title = _title_for_spec(spec)
    sources_display = (
        [Path(item).as_posix() for item in spec.sources_display]
        if spec.sources_display
        else [source.as_posix() for source in spec.sources]
    )

    lines = [
        "---",
        f"title: {title}",
        f"slug: {spec.slug}",
        f"last_updated: {timestamp.isoformat()}",
        f"screenshot: {image_rel}",
        f"hash: {image_hash}",
    ]
    if sources_display:
        lines.append("sources:")
        lines.extend(f"  - {item}" for item in sources_display)
    else:
        lines.append("sources: []")
    lines.extend(
        [
            "---",
            "",
            f"![{title}]({image_rel})",
            "",
            "> _Generated by `capture_dashboard_screenshots.py`._",
        ]
    )

    markdown_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    LOGGER.info("Updated %s", markdown_path)


def login_and_get_storage(
    playwright: Playwright,
    base_url: str,
    token: str,
    headless: bool,
    slow_mo: int,
) -> tuple[Browser, Mapping[str, Any]]:
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
                file_name = spec.file_name or f"{spec.slug}.png"
                screenshot_path = args.output_dir / file_name
                markdown_path = (
                    spec.markdown
                    if spec.markdown
                    else args.markdown_dir / f"{spec.slug}.md"
                )

                if not should_capture(spec, screenshot_path, args.force):
                    LOGGER.info("Skipping '%s' (sources unchanged)", spec.slug)
                    if screenshot_path.exists() and not markdown_path.exists():
                        LOGGER.debug(
                            "Creating missing Markdown tracker for '%s'",
                            spec.slug,
                        )
                        existing_bytes = screenshot_path.read_bytes()
                        write_markdown_summary(
                            spec,
                            screenshot_path,
                            markdown_path,
                            _compute_hash(existing_bytes),
                            datetime.now(UTC),
                        )
                    continue

                existing_bytes = (
                    screenshot_path.read_bytes()
                    if screenshot_path.exists()
                    else None
                )
                image_bytes = capture_dashboard(
                    browser,
                    args.base_url,
                    storage_state,
                    spec,
                    screenshot_path,
                )
                changed = (
                    existing_bytes != image_bytes
                    if existing_bytes is not None
                    else True
                )
                if not changed:
                    LOGGER.info(
                        "Dashboard '%s' captured with no pixel diff", spec.slug
                    )

                if changed or not markdown_path.exists():
                    write_markdown_summary(
                        spec,
                        screenshot_path,
                        markdown_path,
                        _compute_hash(image_bytes),
                        datetime.now(UTC),
                    )
                else:
                    LOGGER.debug(
                        "Markdown unchanged for '%s' (no visual diff)",
                        spec.slug,
                    )
        finally:
            browser.close()

    return 0


if __name__ == "__main__":  # pragma: no cover - CLI entry point
    raise SystemExit(main())
