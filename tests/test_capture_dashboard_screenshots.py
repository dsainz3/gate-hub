from __future__ import annotations

import os
import sys
import textwrap
from datetime import UTC, datetime
from pathlib import Path
from types import SimpleNamespace

import pytest

_playwright_stub = SimpleNamespace(
    Browser=object,
    Page=object,
    Playwright=object,
    TimeoutError=Exception,
    sync_playwright=lambda: None,
)
sys.modules.setdefault(
    "playwright", SimpleNamespace(sync_api=_playwright_stub)
)
sys.modules.setdefault("playwright.sync_api", _playwright_stub)

import scripts.capture_dashboard_screenshots as capture_module  # noqa: E402
from scripts.capture_dashboard_screenshots import (  # noqa: E402
    DEFAULT_VIEWPORT,
    DashboardSpec,
    _redact_token,
    load_dashboard_specs,
    main,
    should_capture,
    write_markdown_summary,
)


def test_dashboard_spec_defaults() -> None:
    spec = DashboardSpec.from_mapping(
        {
            "slug": "default",
            "path": "lovelace/default",
        }
    )

    assert spec.wait_selector is None
    assert spec.wait_ms > 0
    assert spec.viewport == DEFAULT_VIEWPORT
    assert spec.full_page is False
    assert spec.file_name is None
    assert spec.sources == ()
    assert spec.sources_display == ()
    assert spec.markdown is None
    assert spec.title is None


def test_dashboard_spec_overrides(tmp_path: Path) -> None:
    spec = DashboardSpec.from_mapping(
        {
            "slug": "kiosk",
            "path": "kiosk",  # value preserved verbatim
            "wait_selector": "hui-view",
            "wait_ms": "2500",
            "viewport": {"width": "1024", "height": 768},
            "full_page": True,
            "file_name": "custom.png",
            "sources": ["dashboards/kiosk.dashboard.yaml"],
            "markdown": "docs/kiosk.md",
            "title": "Kiosk Dashboard",
        },
        base_path=tmp_path,
    )

    assert spec.wait_selector == "hui-view"
    assert spec.wait_ms == 2500
    assert spec.viewport == {"width": 1024, "height": 768}
    assert spec.full_page is True
    assert spec.file_name == "custom.png"
    assert spec.title == "Kiosk Dashboard"
    assert spec.sources_display == ("dashboards/kiosk.dashboard.yaml",)
    assert spec.sources == (
        (tmp_path / "dashboards/kiosk.dashboard.yaml").resolve(),
    )
    assert spec.markdown == (tmp_path / "docs/kiosk.md").resolve()


def test_load_dashboard_specs(tmp_path: Path) -> None:
    plan = tmp_path / "plan.yaml"
    plan.write_text(
        "dashboards:\n  - slug: one\n    path: lovelace/one\n",
        encoding="utf-8",
    )

    specs = load_dashboard_specs(plan)

    assert len(specs) == 1
    assert specs[0].slug == "one"


def test_load_dashboard_specs_requires_entries(tmp_path: Path) -> None:
    plan = tmp_path / "empty.yaml"
    plan.write_text("dashboards: []", encoding="utf-8")

    with pytest.raises(ValueError):
        load_dashboard_specs(plan)


def test_should_capture_with_sources(tmp_path: Path) -> None:
    source = tmp_path / "dashboards/default.dashboard.yaml"
    source.parent.mkdir()
    source.write_text("initial", encoding="utf-8")
    spec = DashboardSpec.from_mapping(
        {
            "slug": "default",
            "path": "lovelace/default",
            "sources": ["dashboards/default.dashboard.yaml"],
        },
        base_path=tmp_path,
    )

    screenshot = tmp_path / "docs/assets/screenshots/default.png"
    assert should_capture(spec, screenshot, force=False) is True

    screenshot.parent.mkdir(parents=True)
    screenshot.write_bytes(b"image")
    assert should_capture(spec, screenshot, force=False) is False

    os.utime(screenshot, (1, 1))
    os.utime(source, None)

    assert should_capture(spec, screenshot, force=False) is True
    assert should_capture(spec, screenshot, force=True) is True


def test_write_markdown_summary(tmp_path: Path) -> None:
    spec = DashboardSpec.from_mapping(
        {
            "slug": "weather",
            "path": "lovelace/weather",
            "title": "Weather Dashboard",
            "sources": ["dashboards/weather.dashboard.yaml"],
        },
        base_path=tmp_path,
    )
    screenshot = tmp_path / "docs/assets/screenshots/weather.png"
    screenshot.parent.mkdir(parents=True)
    screenshot.write_bytes(b"image")
    markdown = tmp_path / "docs/reference/weather.md"

    timestamp = datetime(2025, 1, 1, tzinfo=UTC)
    write_markdown_summary(
        spec,
        screenshot,
        markdown,
        "abc123",
        timestamp,
    )

    content = markdown.read_text(encoding="utf-8")
    assert "title: Weather Dashboard" in content
    assert "hash: abc123" in content
    assert "![Weather Dashboard]" in content
    assert "../assets/screenshots/weather.png" in content
    assert "- dashboards/weather.dashboard.yaml" in content


def test_main_smoke_and_skip(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    config_path = tmp_path / "plan.yaml"
    source = tmp_path / "dashboards/default.dashboard.yaml"
    source.parent.mkdir()
    source.write_text("initial", encoding="utf-8")
    os.utime(source, (0, 0))

    config_path.write_text(
        textwrap.dedent(
            """
            dashboards:
              - slug: default
                path: lovelace/default
                sources:
                  - dashboards/default.dashboard.yaml
            """
        ),
        encoding="utf-8",
    )

    output_dir = tmp_path / "docs/assets/screenshots"
    markdown_dir = tmp_path / "docs/reference/dashboard-snapshots"

    calls: list[str] = []
    close_calls: list[bool] = []

    class DummyBrowser:
        def close(self) -> None:
            close_calls.append(True)

    def fake_login(
        playwright: object,
        base_url: str,
        token: str,
        headless: bool,
        slow_mo: int,
    ) -> tuple[DummyBrowser, dict[str, str]]:
        return DummyBrowser(), {"state": "stub"}

    def fake_capture(
        browser: DummyBrowser,
        base_url: str,
        storage_state: dict[str, str],
        spec: DashboardSpec,
        output_path: Path,
    ) -> bytes:
        calls.append(spec.slug)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_bytes(b"image-bytes")
        return b"image-bytes"

    class DummyManager:
        def __enter__(self) -> object:
            return object()

        def __exit__(self, exc_type: object, exc: object, tb: object) -> bool:
            return False

    monkeypatch.setattr(
        capture_module,
        "sync_playwright",
        lambda: DummyManager(),
    )
    monkeypatch.setattr(
        capture_module,
        "login_and_get_storage",
        fake_login,
    )
    monkeypatch.setattr(
        capture_module,
        "capture_dashboard",
        fake_capture,
    )

    args = [
        "--config",
        str(config_path),
        "--output-dir",
        str(output_dir),
        "--markdown-dir",
        str(markdown_dir),
        "--base-url",
        "http://example.invalid",
        "--token",
        "token",
    ]

    exit_code = main(args)
    assert exit_code == 0
    assert calls == ["default"]
    assert close_calls == [True]

    screenshot_path = output_dir / "default.png"
    markdown_path = markdown_dir / "default.md"
    assert screenshot_path.exists()
    assert markdown_path.exists()

    calls.clear()
    exit_code = main(args)
    assert exit_code == 0
    assert calls == []
    assert close_calls == [True, True]
    assert screenshot_path.exists()
    assert markdown_path.exists()


@pytest.mark.parametrize(
    "token, expected",
    [
        ("", "<empty>"),
        ("abcd", "****"),
        ("abcdefgh", "********"),
        ("abcdefghijkl", "abcd…ijkl"),
    ],
)
def test_redact_token(token: str, expected: str) -> None:
    assert _redact_token(token) == expected
