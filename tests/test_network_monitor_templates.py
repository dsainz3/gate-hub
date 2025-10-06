"""Tests for the network monitor template definitions."""

from __future__ import annotations

from pathlib import Path


def _build_context(lines: list[str], idx: int) -> list[tuple[int, str]]:
    """Return the indentation stack up to and including ``idx``."""

    stack: list[tuple[int, str]] = []
    for current, raw_line in enumerate(lines[: idx + 1]):
        stripped = raw_line.strip()

        if not stripped or stripped.startswith("#"):
            continue

        indent = len(raw_line) - len(raw_line.lstrip(" "))

        while stack and stack[-1][0] >= indent:
            stack.pop()

        stack.append((indent, stripped))

        if current == idx:
            break

    return stack


def test_network_dashboard_internet_online_is_binary_sensor():
    """Ensure the dashboard template uses the binary_sensor domain."""

    path = Path("packages/network_monitor.yaml")
    lines = path.read_text(encoding="utf-8").splitlines()

    try:
        target_index = next(
            index
            for index, line in enumerate(lines)
            if "- name: Network Dashboard Internet Online" in line
        )
    except (
        StopIteration
    ) as exc:  # pragma: no cover - aids debugging if missing
        raise AssertionError(
            "template entry not found in network_monitor.yaml"
        ) from exc

    stack = _build_context(lines, target_index)

    binary_sensor_context = [
        entry for entry in stack if entry[1] == "- binary_sensor:"
    ]

    assert binary_sensor_context, (
        "Expected Network Dashboard Internet Online template to be declared "
        "within the binary_sensor domain"
    )

    unique_id_found = any(
        "unique_id: network_dashboard_internet_online" in line
        for line in lines[target_index : target_index + 10]
    )

    assert unique_id_found, (
        "Expected the template to retain its unique_id for Home Assistant "
        "entity tracking"
    )
