"""Documentation generator for dashboards."""

from __future__ import annotations

import logging
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path

import aiofiles

from .config import AppConfig

LOGGER = logging.getLogger(__name__)


TABLE_TEMPLATE = """\
# {title}

![{title}]({image_url})

## Source

`{source_path}`

## Last Updated

*Generated automatically by dashboard automation.*
"""


@dataclass
class DocumentationEntry:
    """Information required to generate a documentation page."""

    title: str
    source_path: Path
    image_path: Path
    www_root: Path

    @property
    def image_url(self) -> str:
        rel = self.image_path.relative_to(self.www_root)
        return f"/local/{rel.as_posix()}"


class DocumentationGenerator:
    """Generate Markdown documentation and indices for dashboards."""

    def __init__(self, config: AppConfig) -> None:
        self._config = config

    async def render_entry(self, entry: DocumentationEntry) -> None:
        """Generate a Markdown file for a single dashboard."""

        docs_dir = self._config.docs_path
        docs_dir.mkdir(parents=True, exist_ok=True)
        output_path = docs_dir / f"{entry.source_path.stem}.md"
        content = TABLE_TEMPLATE.format(
            title=entry.title,
            image_url=entry.image_url,
            source_path=entry.source_path,
        )
        LOGGER.info("Writing documentation %s", output_path)
        async with aiofiles.open(output_path, "w", encoding="utf-8") as handle:
            await handle.write(content)

    async def render_index(
        self, entries: Iterable[DocumentationEntry]
    ) -> None:
        """Generate an index page with links to all dashboards."""

        docs_dir = self._config.docs_path
        docs_dir.mkdir(parents=True, exist_ok=True)
        index_path = docs_dir / "index.md"
        lines = ["# Dashboards", ""]
        sorted_entries = sorted(entries, key=lambda item: item.title.lower())
        for entry in sorted_entries:
            lines.append(f"- [{entry.title}]({entry.source_path.stem}.md)")
        async with aiofiles.open(index_path, "w", encoding="utf-8") as handle:
            await handle.write("\n".join(lines))
