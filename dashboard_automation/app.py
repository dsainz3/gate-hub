"""Main application entry point."""

from __future__ import annotations

import asyncio
import logging
import signal
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path

import yaml

from .config import AppConfig, load_config
from .documentation import DocumentationEntry, DocumentationGenerator
from .monitor import DashboardMonitor
from .screenshot import ScreenshotClient, ScreenshotError

LOGGER = logging.getLogger(__name__)


@dataclass
class DashboardMeta:
    """Metadata for a configured dashboard."""

    slug: str
    title: str
    filename: Path

    def url(self, base_url: str) -> str:
        return f"{base_url.rstrip('/')}/dashboard/{self.slug}/"


def load_dashboards(config: AppConfig) -> dict[Path, DashboardMeta]:
    """Read configuration.yaml and map dashboard files to metadata."""

    config_path = config.config_path / "configuration.yaml"
    if not config_path.exists():
        msg = f"configuration.yaml not found at {config_path}"
        raise FileNotFoundError(msg)
    payload = yaml.load(
        config_path.read_text(encoding="utf-8"), Loader=LovelaceLoader
    )
    dashboards_conf = (payload or {}).get("lovelace", {}).get("dashboards", {})

    dashboards: dict[Path, DashboardMeta] = {}
    for slug, info in dashboards_conf.items():
        filename = info.get("filename")
        if not filename:
            LOGGER.warning("Dashboard %s missing filename, skipping", slug)
            continue
        title = info.get("title") or slug.replace("-", " ").title()
        path = (config.config_path / filename).resolve()
        dashboards[path] = DashboardMeta(slug=slug, title=title, filename=path)
    return dashboards


class DashboardAutomationService:
    """Continuous service orchestrating monitoring, screenshots, and docs."""

    def __init__(self, config: AppConfig) -> None:
        self._config = config
        self._monitor = DashboardMonitor(config)
        self._doc_generator = DocumentationGenerator(config)
        self._dashboards = load_dashboards(config)
        self._stop_event = asyncio.Event()

    def signal_stop(self) -> None:
        """Signal the service loop to stop."""

        self._stop_event.set()

    async def run(self) -> None:
        """Run the monitoring loop until stopped."""

        LOGGER.info("Loaded %d dashboards", len(self._dashboards))
        async with ScreenshotClient(self._config) as screenshots:
            while not self._stop_event.is_set():
                await self._run_cycle(screenshots)
                try:
                    await asyncio.wait_for(
                        self._stop_event.wait(),
                        timeout=self._config.check_interval,
                    )
                except TimeoutError:
                    continue

    async def _run_cycle(self, screenshots: ScreenshotClient) -> None:
        """Handle a single monitoring cycle."""

        changed = await self._monitor.scan()
        if not changed:
            LOGGER.debug("No dashboard changes detected")
            return
        processed: list[tuple[Path, str]] = []
        doc_entries: list[DocumentationEntry] = []
        www_root = self._config.config_path / "www"

        for path, checksum in changed:
            meta = self._dashboards.get(path.resolve())
            if not meta:
                LOGGER.warning("Untracked dashboard change at %s", path)
                continue
            destination = self._config.screenshots_path / f"{meta.slug}.png"
            url = meta.url(self._config.ha_url)
            try:
                await screenshots.capture(url, destination)
            except ScreenshotError as exc:
                LOGGER.error("Screenshot failed for %s: %s", meta.slug, exc)
                continue
            entry = DocumentationEntry(
                title=meta.title,
                source_path=path,
                image_path=destination,
                www_root=www_root,
            )
            await self._doc_generator.render_entry(entry)
            processed.append((path, checksum))
            doc_entries.append(entry)

        if processed:
            await self._monitor.update_state(processed)
            await self._update_index(doc_entries)

    async def _update_index(
        self, new_entries: Iterable[DocumentationEntry]
    ) -> None:
        """Refresh the documentation index using all available pages."""

        docs_dir = self._config.docs_path
        entries_map: dict[Path, DocumentationEntry] = {
            entry.source_path.resolve(): entry for entry in new_entries
        }
        www_root = self._config.config_path / "www"

        for meta in self._dashboards.values():
            doc_path = docs_dir / f"{meta.filename.stem}.md"
            screenshot_path = (
                self._config.screenshots_path / f"{meta.slug}.png"
            )
            if not doc_path.exists() or not screenshot_path.exists():
                continue
            source = meta.filename.resolve()
            if source not in entries_map:
                entries_map[source] = DocumentationEntry(
                    title=meta.title,
                    source_path=source,
                    image_path=screenshot_path,
                    www_root=www_root,
                )
        if entries_map:
            await self._doc_generator.render_index(entries_map.values())


async def main() -> None:
    """Entrypoint for the dashboard automation application."""

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    config = load_config()
    service = DashboardAutomationService(config)

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGINT, signal.SIGTERM):
        loop.add_signal_handler(sig, service.signal_stop)

    try:
        await service.run()
    finally:
        service.signal_stop()


if __name__ == "__main__":
    asyncio.run(main())


class LovelaceLoader(yaml.SafeLoader):
    """YAML loader that ignores custom include tags."""


def _unknown_tag(
    loader: LovelaceLoader, tag_suffix: str, node: yaml.Node
) -> object:
    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    if isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node)
    return None


LovelaceLoader.add_multi_constructor("!", _unknown_tag)
