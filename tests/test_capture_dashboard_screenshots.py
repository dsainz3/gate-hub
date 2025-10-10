from __future__ import annotations

import sys
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


from scripts.capture_dashboard_screenshots import (  # noqa: E402
    DEFAULT_VIEWPORT,
    DashboardSpec,
    _redact_token,
    load_dashboard_specs,
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


def test_dashboard_spec_overrides() -> None:
    spec = DashboardSpec.from_mapping(
        {
            "slug": "kiosk",
            "path": "kiosk",  # value preserved verbatim
            "wait_selector": "hui-view",
            "wait_ms": "2500",
            "viewport": {"width": "1024", "height": 768},
            "full_page": True,
            "file_name": "custom.png",
        }
    )

    assert spec.wait_selector == "hui-view"
    assert spec.wait_ms == 2500
    assert spec.viewport == {"width": 1024, "height": 768}
    assert spec.full_page is True
    assert spec.file_name == "custom.png"


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
