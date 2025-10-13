"""Scan the repository for duplicate Home Assistant entity definitions.

This helper walks every YAML file in the repository and looks for duplicate
entities across common Home Assistant domains (inputs, groups, automations,
scenes, scripts, etc.).  It is intentionally read-only: the script only reports
potential duplicates so humans can decide which ones should be removed or
consolidated.

The goal is to surface overlap between top-level configuration files and the
feature packages that live under ``packages/``.  The output is a markdown report
that highlights where the same entity ID, alias, or automation ID appears in
multiple locations.
"""

from __future__ import annotations

import argparse
import datetime as dt
from collections import defaultdict
from collections.abc import Iterable, Iterator, Mapping, Sequence
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import yaml

# --- YAML loading helpers --------------------------------------------------


class IgnoreUnknownLoader(yaml.SafeLoader):
    """PyYAML loader that ignores Home Assistant specific tags."""


def _ignore_unknown(  # type: ignore[override]
    loader: IgnoreUnknownLoader, node: yaml.Node
) -> Any:
    """Best-effort construction for unknown YAML tags.

    Home Assistant relies on a number of custom tags (``!include`` and friends)
    that SafeLoader cannot parse.  Treat them as vanilla YAML structures so we
    can still inspect the data.
    """

    if isinstance(node, yaml.ScalarNode):
        return loader.construct_scalar(node)
    if isinstance(node, yaml.SequenceNode):
        return loader.construct_sequence(node)
    if isinstance(node, yaml.MappingNode):
        return loader.construct_mapping(node)
    return None


IgnoreUnknownLoader.add_constructor(None, _ignore_unknown)


# --- Data structures -------------------------------------------------------


DOMAINS_TO_KEYS: Mapping[str, Sequence[str]] = {
    "automation": ("id", "alias", "unique_id"),
    "binary_sensor": ("name", "unique_id"),
    "group": ("entity_id",),
    "input_boolean": ("entity_id",),
    "input_number": ("entity_id",),
    "input_select": ("entity_id",),
    "input_text": ("entity_id",),
    "light": ("entity_id",),
    "scene": ("id", "name"),
    "script": ("entity_id", "alias"),
    "sensor": ("name", "unique_id"),
}


EXCLUDE_DIRS = {
    ".git",
    "custom_components",
    "node_modules",
    "site",
    "venv",
    ".venv",
    "__pycache__",
}


@dataclass(frozen=True)
class Occurrence:
    file: Path
    context: tuple[str, ...]

    def format(self, root: Path) -> str:
        relative_file = self.file.relative_to(root)
        if not self.context:
            return str(relative_file)
        context_str = " / ".join(self.context)
        return f"{relative_file} :: {context_str}"


Occurrences = defaultdict[tuple[str, str], defaultdict[str, list[Occurrence]]]


def iter_yaml_files(root: Path) -> Iterator[Path]:
    for pattern in ("*.yaml", "*.yml"):
        for path in root.rglob(pattern):
            if any(part in EXCLUDE_DIRS for part in path.parts):
                continue
            if path.is_dir():  # Paranoia: skip directories matched by glob.
                continue
            yield path


def _is_sequence(value: Any) -> bool:
    return isinstance(value, Sequence) and not isinstance(
        value, str | bytes | bytearray
    )


def _collect_from_mapping(
    domain: str,
    data: Mapping[str, Any],
    context: tuple[str, ...],
    file_path: Path,
    records: Occurrences,
) -> None:
    for key, value in data.items():
        if not isinstance(key, str):
            continue
        records[(domain, "entity_id")][key].append(
            Occurrence(file=file_path, context=(*context, domain, key))
        )
        if isinstance(value, Mapping):
            for attribute in DOMAINS_TO_KEYS.get(domain, ()):  # type: ignore[index]
                attr_value = value.get(attribute)
                if isinstance(attr_value, str) and attr_value:
                    records[(domain, attribute)][attr_value].append(
                        Occurrence(
                            file=file_path,
                            context=(*context, domain, key, attribute),
                        )
                    )
            _collect_nested(domain, value, (*context, domain, key), file_path, records)


def _collect_from_sequence(
    domain: str,
    items: Sequence[Any],
    context: tuple[str, ...],
    file_path: Path,
    records: Occurrences,
) -> None:
    for index, item in enumerate(items):
        if not isinstance(item, Mapping):
            continue
        entry_context = (*context, domain, f"item[{index}]")
        for key in DOMAINS_TO_KEYS.get(domain, ()):  # type: ignore[index]
            value = item.get(key)
            if isinstance(value, str) and value:
                records[(domain, key)][value].append(
                    Occurrence(file=file_path, context=(*entry_context, key))
                )
        _collect_nested(domain, item, entry_context, file_path, records)


def _collect_nested(
    domain: str,
    data: Mapping[str, Any],
    context: tuple[str, ...],
    file_path: Path,
    records: Occurrences,
) -> None:
    """Recurse into nested mappings inside a domain entry."""

    for nested_key, nested_value in data.items():
        if nested_key in DOMAINS_TO_KEYS and isinstance(nested_value, Mapping):
            _collect_from_mapping(
                nested_key, nested_value, (*context, nested_key), file_path, records
            )
        elif nested_key in DOMAINS_TO_KEYS and _is_sequence(nested_value):
            _collect_from_sequence(
                nested_key, nested_value, (*context, nested_key), file_path, records
            )


def _collect_domains(
    obj: Any,
    context: tuple[str, ...],
    file_path: Path,
    records: Occurrences,
) -> None:
    if isinstance(obj, Mapping):
        for key, value in obj.items():
            if key in DOMAINS_TO_KEYS:
                if "frontend" in context or "command_line" in context:
                    continue
                if isinstance(value, Mapping):
                    _collect_from_mapping(key, value, context, file_path, records)
                elif _is_sequence(value):
                    _collect_from_sequence(key, value, context, file_path, records)
            if isinstance(value, Mapping) or _is_sequence(value):
                _collect_domains(value, (*context, str(key)), file_path, records)
    elif _is_sequence(obj):
        for index, item in enumerate(obj):
            if isinstance(item, Mapping) or _is_sequence(item):
                _collect_domains(item, (*context, f"[{index}]"), file_path, records)


def scan_for_duplicates(root: Path) -> tuple[Occurrences, list[str]]:
    records: Occurrences = defaultdict(lambda: defaultdict(list))
    errors: list[str] = []

    for yaml_file in sorted(iter_yaml_files(root)):
        try:
            with yaml_file.open("r", encoding="utf-8") as handle:
                documents = tuple(yaml.load_all(handle, Loader=IgnoreUnknownLoader))
        except yaml.YAMLError as exc:  # pragma: no cover - defensive logging
            errors.append(f"{yaml_file.relative_to(root)} :: {exc}")
            continue

        for doc in documents:
            if doc is None:
                continue
            _collect_domains(doc, (), yaml_file, records)

    return records, errors


def render_report(root: Path, records: Occurrences, errors: Sequence[str]) -> str:
    timestamp = dt.datetime.now(dt.UTC).strftime("%Y-%m-%d %H:%M UTC")
    lines: list[str] = [
        "# Duplicate entity report",
        "",
        f"Generated: {timestamp}",
        "",
    ]

    duplicates_found = False
    for (domain, key_name), values in sorted(records.items()):
        duplicate_values = {
            value: occurrences
            for value, occurrences in values.items()
            if len(occurrences) > 1
        }
        if not duplicate_values:
            continue

        duplicates_found = True
        lines.append(f"## {domain} duplicates by `{key_name}`")
        lines.append("")
        for value, occurrences in sorted(duplicate_values.items()):
            lines.append(f"- `{value}`")
            for occurrence in occurrences:
                lines.append(
                    f"  - {occurrence.format(root)}"
                )
            lines.append("")

    if not duplicates_found:
        lines.append("No duplicates detected across tracked domains.")
        lines.append("")

    if errors:
        lines.append("## YAML parsing issues")
        lines.append("")
        for message in errors:
            lines.append(f"- {message}")
        lines.append("")

    return "\n".join(lines).rstrip() + "\n"


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Repository root to scan.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional path to write the markdown report.",
    )
    args = parser.parse_args(list(argv) if argv is not None else None)

    records, errors = scan_for_duplicates(args.root)
    report = render_report(args.root, records, errors)

    if args.output:
        args.output.write_text(report, encoding="utf-8")
    else:
        print(report)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
