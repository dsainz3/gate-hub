"""Screenshot capturing via Browserless API."""

from __future__ import annotations

import asyncio
import base64
import json
import logging
from pathlib import Path
from typing import Any

import aiohttp

from .config import AppConfig

LOGGER = logging.getLogger(__name__)


class ScreenshotError(RuntimeError):
    """Raised when screenshot capture fails."""


class ScreenshotClient:
    """Client for capturing dashboard screenshots via Browserless."""

    def __init__(self, config: AppConfig) -> None:
        self._config = config
        self._session: aiohttp.ClientSession | None = None

    async def __aenter__(self) -> ScreenshotClient:
        self._session = aiohttp.ClientSession()
        return self

    async def __aexit__(self, exc_type, exc, tb) -> None:
        if self._session:
            await self._session.close()

    async def capture(
        self,
        dashboard_url: str,
        destination: Path,
        viewport: tuple[int, int] = (1920, 1080),
    ) -> Path:
        """Capture a screenshot for the given URL and write it to destination."""

        headers = {"Content-Type": "application/json"}
        options: dict[str, Any] = {
            "viewport": {"width": viewport[0], "height": viewport[1]},
            "colorScheme": "dark",
            "fullPage": True,
            "waitFor": "networkidle0",
            "gotoOptions": {
                "waitUntil": ["load", "domcontentloaded", "networkidle0"]
            },
        }
        token = self._config.ha_token
        if token:
            options["headers"] = {"Authorization": f"Bearer {token}"}

        payload: dict[str, Any] = {
            "url": dashboard_url,
            "options": options,
        }
        browserless_token = self._config.browserless_token
        if browserless_token:
            headers["Cache-Control"] = "no-cache"
            payload["token"] = browserless_token

        if not self._session:
            msg = "ScreenshotClient must be used as an async context manager"
            raise ScreenshotError(msg)

        endpoint = f"{self._config.browserless_url.rstrip('/')}/screenshot"
        LOGGER.info("Requesting screenshot via %s", endpoint)
        try:
            async with self._session.post(
                endpoint,
                data=json.dumps(payload),
                headers=headers,
                timeout=120,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    msg = f"Screenshot request failed ({response.status}): {error_text}"
                    raise ScreenshotError(msg)
                body = await response.read()
        except aiohttp.ClientError as exc:
            msg = f"Failed to contact Browserless service: {exc}"
            raise ScreenshotError(msg) from exc
        # Browserless returns raw image bytes by default.
        await asyncio.to_thread(destination.write_bytes, body)
        LOGGER.info(
            "Saved screenshot to %s (%d bytes)", destination, len(body)
        )
        return destination

    async def capture_base64(self, dashboard_url: str) -> bytes:
        """Capture a screenshot and return raw bytes when API returns base64."""

        if not self._session:
            msg = "ScreenshotClient must be used as an async context manager"
            raise ScreenshotError(msg)

        headers = {"Content-Type": "application/json"}
        options: dict[str, Any] = {}
        token = self._config.ha_token
        if token:
            options["headers"] = {"Authorization": f"Bearer {token}"}

        payload: dict[str, Any] = {"url": dashboard_url, "options": options}
        endpoint = f"{self._config.browserless_url.rstrip('/')}/screenshot?encoding=base64"
        try:
            async with self._session.post(
                endpoint,
                data=json.dumps(payload),
                headers=headers,
                timeout=120,
            ) as response:
                if response.status != 200:
                    error_text = await response.text()
                    msg = f"Screenshot request failed ({response.status}): {error_text}"
                    raise ScreenshotError(msg)
                body = await response.json()
        except aiohttp.ClientError as exc:
            msg = f"Failed to contact Browserless service: {exc}"
            raise ScreenshotError(msg) from exc
        encoded = body.get("data")
        if not encoded:
            msg = "Browserless response missing base64 data"
            raise ScreenshotError(msg)
        return base64.b64decode(encoded)
