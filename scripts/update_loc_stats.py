"""Update README with repository line counts.

This script walks the repository, counts lines in tracked source files while
skipping the ``custom_components`` directory, and writes the aggregated totals
to the ``README.md`` between the ``LOC_COUNTS_START`` and ``LOC_COUNTS_END``
markers.
"""

from __future__ import annotations

import argparse
import datetime as dt
from collections import Counter
from collections.abc import Iterable
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
README_PATH = REPO_ROOT / "README.md"
START_MARKER = "<!-- LOC_COUNTS_START -->"
END_MARKER = "<!-- LOC_COUNTS_END -->"

EXCLUDED_DIRS = {
    "custom_components",
    "__pycache__",
    ".venv",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".git",
}

BINARY_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".ico",
    ".svgz",
    ".gz",
    ".zip",
    ".tar",
    ".bz2",
    ".xz",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".mp3",
    ".mp4",
    ".webm",
    ".mov",
    ".pdf",
    ".pyc",
    ".pyo",
    ".so",
    ".dylib",
    ".dll",
    ".exe",
}

EXTENSION_TO_LANGUAGE = {
    ".py": "Python",
    ".pyi": "Python",
    ".yaml": "YAML",
    ".yml": "YAML",
    ".json": "JSON",
    ".md": "Markdown",
    ".jinja": "Jinja",
    ".j2": "Jinja",
    ".jinja2": "Jinja",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".tsx": "TypeScript",
    ".css": "CSS",
    ".scss": "Sass",
    ".html": "HTML",
    ".htm": "HTML",
    ".sh": "Shell",
    ".bash": "Shell",
    ".zsh": "Shell",
    ".fish": "Shell",
    ".ps1": "PowerShell",
    ".ini": "INI",
    ".cfg": "INI",
    ".conf": "INI",
    ".toml": "TOML",
    ".lock": "Lockfile",
    ".txt": "Text",
    ".csv": "CSV",
    ".xml": "XML",
    ".svg": "SVG",
    ".rst": "reStructuredText",
}


def iter_files(root: Path) -> Iterable[Path]:
    """Yield files under ``root`` excluding ignored directories."""

    for path in root.rglob("*"):
        if not path.is_file():
            continue

        if any(part in EXCLUDED_DIRS for part in path.parts):
            continue

        if path.name.startswith("."):
            continue

        yield path


def count_lines(path: Path) -> int:
    """Return the number of lines in ``path``."""

    try:
        with path.open("r", encoding="utf-8", errors="ignore") as handle:
            return sum(1 for _ in handle)
    except OSError:
        return 0


def build_tables() -> tuple[int, Counter[str], Counter[str]]:
    """Compute total lines, counts by language, and counts by extension."""

    total_lines = 0
    lines_by_language: Counter[str] = Counter()
    lines_by_extension: Counter[str] = Counter()

    for file_path in iter_files(REPO_ROOT):
        if file_path == README_PATH:
            continue

        extension = file_path.suffix.lower()
        if extension in BINARY_EXTENSIONS:
            continue

        lines = count_lines(file_path)
        if lines == 0:
            continue

        total_lines += lines

        normalized_extension = extension or "<no extension>"
        lines_by_extension[normalized_extension] += lines

        language = EXTENSION_TO_LANGUAGE.get(normalized_extension, "Other")
        lines_by_language[language] += lines

    return total_lines, lines_by_language, lines_by_extension


def format_table(title: str, counts: Counter[str]) -> str:
    """Return a Markdown table from the provided ``counts``."""

    lines = [f"### {title}", "", "| Category | Lines |", "| --- | ---: |"]
    for name, line_count in counts.most_common():
        lines.append(f"| {name} | {line_count:,} |")
    return "\n".join(lines)


def render_section(
    total_lines: int, by_language: Counter[str], by_extension: Counter[str]
) -> str:
    """Render the Markdown section inserted into the README."""

    timestamp = dt.datetime.now(dt.UTC).strftime("%Y-%m-%d %H:%M UTC")
    section_lines = [
        START_MARKER,
        f"_Last updated: {timestamp}_",
        "",
        f"**Total lines (excluding `custom_components/`):** {total_lines:,}",
        "",
        format_table("Lines by Language", by_language),
        "",
        format_table("Lines by Extension", by_extension),
        END_MARKER,
    ]
    return "\n".join(section_lines)


def update_readme(section: str) -> None:
    """Replace the marked section within the README."""

    contents = README_PATH.read_text(encoding="utf-8")

    if START_MARKER not in contents or END_MARKER not in contents:
        raise SystemExit(
            "README.md is missing LOC markers. Add them before running this script."
        )

    before, _, rest = contents.partition(START_MARKER)
    _, _, after = rest.partition(END_MARKER)

    before_clean = before.rstrip("\n")
    after_clean = after.lstrip("\n")
    new_contents = f"{before_clean}\n\n{section}\n\n{after_clean}"
    README_PATH.write_text(new_contents, encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.parse_args()

    total_lines, by_language, by_extension = build_tables()
    section = render_section(total_lines, by_language, by_extension)
    update_readme(section)


if __name__ == "__main__":
    main()
