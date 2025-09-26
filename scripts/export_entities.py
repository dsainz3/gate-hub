#!/usr/bin/env python3
"""Export entity ids and friendly names from Home Assistant."""

from __future__ import annotations

import argparse
import os
from collections.abc import Iterable
from pathlib import Path

import requests

DEFAULT_URL = "http://homeassistant.local:8123"
DEFAULT_OUTPUT = Path("docs") / "entities.md"
TOKEN_ENV = "HASS_TOKEN"
TOKEN_FILES = (
    Path.home() / ".ha_token",
    Path.home() / ".homeassistant_token",
)


def resolve_token(raw_token: str | None, token_file: str | None) -> str:
    if raw_token:
        return raw_token

    if token_file:
        data = (
            Path(token_file).expanduser().read_text(encoding="utf-8").strip()
        )
        if data:
            return data

    env_token = os.getenv(TOKEN_ENV)
    if env_token:
        return env_token.strip()

    for candidate in TOKEN_FILES:
        if candidate.exists():
            data = candidate.read_text(encoding="utf-8").strip()
            if data:
                return data

    raise SystemExit(
        "Missing token: provide --token, --token-file, or set HASS_TOKEN"
    )


Entity = tuple[str, str | None]


def fetch_entities(url: str, token: str) -> Iterable[Entity]:
    response = requests.get(
        f"{url.rstrip('/')}/api/states",
        headers={"Authorization": f"Bearer {token}"},
        timeout=10,
    )
    response.raise_for_status()
    for item in response.json():
        entity_id = item.get("entity_id", "") if isinstance(item, dict) else ""
        friendly_name = (
            item.get("attributes", {}).get("friendly_name")
            if isinstance(item, dict)
            else None
        )
        yield entity_id, friendly_name


def write_markdown(rows: Iterable[Entity], output: Path) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", encoding="utf-8") as handle:
        handle.write("# Home Assistant Entities\n\n")
        for entity_id, friendly_name in sorted(rows, key=lambda row: row[0]):
            if not entity_id:
                continue
            name = friendly_name or ""
            handle.write(f"- `{entity_id}` - {name}\n")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--url", default=DEFAULT_URL, help="Home Assistant base URL"
    )
    parser.add_argument("--token", help="Long-lived access token")
    parser.add_argument(
        "--token-file",
        help="File containing the token (defaults to ~/.ha_token if present)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Destination file (default: {DEFAULT_OUTPUT})",
    )
    args = parser.parse_args(argv)

    token = resolve_token(args.token, args.token_file)

    try:
        rows = list(fetch_entities(args.url, token))
    except requests.HTTPError as exc:
        payload = exc.response.text if exc.response is not None else ""
        raise SystemExit(f"Request failed: {exc} {payload}") from exc
    except requests.RequestException as exc:
        raise SystemExit(f"Unable to contact Home Assistant: {exc}") from exc

    write_markdown(rows, args.output)
    print(f"Wrote {len(rows)} entities to {args.output}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
