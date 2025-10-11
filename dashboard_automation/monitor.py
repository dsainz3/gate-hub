"""File monitoring utilities for dashboard change detection."""

from __future__ import annotations

import asyncio
import hashlib
import json
import logging
from collections.abc import Iterable
from dataclasses import dataclass, field
from pathlib import Path

from .config import AppConfig

LOGGER = logging.getLogger(__name__)


def _hash_file(path: Path) -> str:
    """Return an MD5 hash of the file contents."""

    digest = hashlib.md5()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(8192), b""):
            digest.update(chunk)
    return digest.hexdigest()


def _list_dashboard_files(paths: Iterable[Path]) -> list[Path]:
    """Collect dashboard files under the provided directories."""

    files: list[Path] = []
    for root in paths:
        if not root.exists():
            LOGGER.debug("Skipping missing dashboards directory: %s", root)
            continue
        files.extend(
            sorted(path.resolve() for path in root.glob("*.dashboard.yaml"))
        )
    return files


@dataclass
class DashboardState:
    """Track the checksum state for a dashboard file."""

    path: Path
    checksum: str


@dataclass
class MonitorState:
    """State tracking for multiple dashboards."""

    dashboards: dict[str, DashboardState] = field(default_factory=dict)

    @classmethod
    def from_json(cls, payload: dict[str, str]) -> MonitorState:
        """Construct state from stored JSON payload."""

        dashboards = {
            str(Path(path).resolve()): DashboardState(
                path=Path(path).resolve(), checksum=checksum
            )
            for path, checksum in payload.items()
        }
        return cls(dashboards=dashboards)

    def to_json(self) -> dict[str, str]:
        """Serialise state to a JSON-compatible dictionary."""

        return {
            str(item.path): item.checksum for item in self.dashboards.values()
        }

    def update(self, path: Path, checksum: str) -> None:
        """Update or insert a dashboard checksum."""

        resolved = path.resolve()
        self.dashboards[str(resolved)] = DashboardState(
            path=resolved, checksum=checksum
        )

    def checksum_for(self, path: Path) -> str | None:
        """Return the last known checksum for a path."""

        item = self.dashboards.get(str(path))
        return item.checksum if item else None


class DashboardMonitor:
    """Monitor dashboard YAML files and detect changes."""

    def __init__(self, config: AppConfig) -> None:
        self._config = config
        self._state_file = config.state_file
        self._state = self._load_state()

    def _load_state(self) -> MonitorState:
        if not self._state_file.exists():
            LOGGER.info(
                "State file missing, creating new one at %s", self._state_file
            )
            self._state_file.write_text("{}", encoding="utf-8")
            return MonitorState()
        try:
            payload = json.loads(self._state_file.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            LOGGER.warning("State file corrupt (%s); resetting state", exc)
            return MonitorState()
        return MonitorState.from_json(payload)

    def _save_state(self) -> None:
        payload = json.dumps(self._state.to_json(), indent=2)
        self._state_file.write_text(payload, encoding="utf-8")

    async def scan(self) -> list[tuple[Path, str]]:
        """Scan dashboard files and return those with updated checksums."""

        dashboards = _list_dashboard_files([self._config.dashboards_path])
        LOGGER.debug("Scanning %d dashboard files", len(dashboards))
        changed: list[tuple[Path, str]] = []
        for path in dashboards:
            checksum = await asyncio.to_thread(_hash_file, path)
            previous = self._state.checksum_for(path)
            if previous != checksum:
                LOGGER.info("Detected change in %s", path)
                changed.append((path, checksum))
        return changed

    async def update_state(self, updates: Iterable[tuple[Path, str]]) -> None:
        """Persist new checksums after processing."""

        for path, checksum in updates:
            self._state.update(path, checksum)
        await asyncio.to_thread(self._save_state)
