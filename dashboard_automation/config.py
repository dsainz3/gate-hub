"""Configuration loader for the dashboard automation service."""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any


@dataclass(frozen=True)
class AppConfig:
    """Application configuration sourced from the environment."""

    ha_url: str = field(
        default_factory=lambda: os.getenv("HA_URL", "http://supervisor/core")
    )
    ha_token: str = field(
        default_factory=lambda: os.getenv(
            "SUPERVISOR_TOKEN", os.getenv("HA_TOKEN", "")
        )
    )
    config_path: Path = field(
        default_factory=lambda: Path(os.getenv("CONFIG_PATH", "/config"))
    )
    dashboards_path: Path = field(init=False)
    screenshots_path: Path = field(
        default_factory=lambda: Path(
            os.getenv("SCREENSHOTS_PATH", "/config/www/dashboard_screenshots")
        )
    )
    docs_path: Path = field(
        default_factory=lambda: Path(
            os.getenv("DOCS_PATH", "/config/docs/dashboards")
        )
    )
    check_interval: int = field(
        default_factory=lambda: int(os.getenv("CHECK_INTERVAL", "300"))
    )
    state_file: Path = field(
        default_factory=lambda: Path(
            os.getenv(
                "STATE_FILE",
                "/config/dashboard_automation/.dashboard_states.json",
            )
        )
    )
    log_level: str = field(
        default_factory=lambda: os.getenv("LOG_LEVEL", "INFO")
    )
    browserless_url: str = field(
        default_factory=lambda: os.getenv(
            "BROWSERLESS_URL", "http://localhost:3000"
        )
    )
    browserless_token: str = field(
        default_factory=lambda: os.getenv("BROWSERLESS_TOKEN", "")
    )

    def __post_init__(self) -> None:
        object.__setattr__(
            self, "dashboards_path", self.config_path / "dashboards"
        )
        if self.check_interval <= 0:
            msg = "CHECK_INTERVAL must be a positive integer"
            raise ValueError(msg)


def to_dict(config: AppConfig) -> dict[str, Any]:
    """Return a JSON-serialisable representation of the configuration."""

    return {
        "ha_url": config.ha_url,
        "ha_token_present": bool(config.ha_token),
        "config_path": str(config.config_path),
        "dashboards_path": str(config.dashboards_path),
        "screenshots_path": str(config.screenshots_path),
        "docs_path": str(config.docs_path),
        "check_interval": config.check_interval,
        "state_file": str(config.state_file),
        "log_level": config.log_level,
        "browserless_url": config.browserless_url,
        "browserless_token_present": bool(config.browserless_token),
    }


def ensure_directories(config: AppConfig) -> None:
    """Ensure application directories exist."""

    for path in (
        config.screenshots_path,
        config.docs_path,
        config.state_file.parent,
    ):
        path.mkdir(parents=True, exist_ok=True)

    if not config.dashboards_path.exists():
        msg = f"Dashboards folder not found: {config.dashboards_path}"
        raise FileNotFoundError(msg)


def load_config() -> AppConfig:
    """Instantiate configuration and write a diagnostic snapshot."""

    config = AppConfig()
    ensure_directories(config)
    snapshot = config.state_file.parent / "config_snapshot.json"
    snapshot.write_text(
        json.dumps(to_dict(config), indent=2), encoding="utf-8"
    )
    return config
