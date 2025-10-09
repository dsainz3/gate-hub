#!/usr/bin/env python3
"""Generate commit and review artifacts based on staged changes.

This helper is intended to be run after pre-commit completes successfully.
It inspects the staged files and suggests:
  * a conventional-commit style subject + body
  * a merge message template (PR body / merge commit notes)
  * review-ready bullet points for change summaries

The output can be filtered with CLI flags or redirected to a file.
"""

from __future__ import annotations

import argparse
import subprocess
import sys
from collections import defaultdict
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from pathlib import Path

DOC_EXTS = {".md", ".mdx", ".rst"}
YAML_EXTS = {".yaml", ".yml"}
PYTHON_EXTS = {".py"}
CONFIG_FOLDERS = {
    "automations.yaml": "Automations",
    "scripts.yaml": "Scripts",
    "scenes.yaml": "Scenes",
    "themes.yaml": "Themes",
    "templates.yaml": "Templates",
}


class GitError(RuntimeError):
    """Raised when git commands fail."""


def run_git(args: Sequence[str]) -> subprocess.CompletedProcess[str]:
    """Execute a git command and return the completed process."""
    result = subprocess.run(
        ["git", *args],
        check=False,
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise GitError(result.stderr.strip() or f"git {' '.join(args)} failed")
    return result


def staged_files() -> list[Path]:
    """Return staged files (relative paths)."""
    try:
        output = run_git(["diff", "--cached", "--name-only"]).stdout
    except GitError as exc:
        raise SystemExit(f"error: {exc}") from exc
    return [Path(line.strip()) for line in output.splitlines() if line.strip()]


@dataclass
class ChangeContext:
    files: list[Path]
    doc_files: list[Path]
    yaml_files: list[Path]
    python_files: list[Path]
    other_files: list[Path]
    classification: str
    areas: list[str]
    top_level_buckets: dict[str, list[Path]]


def categorize(files: Iterable[Path]) -> ChangeContext:
    files = list(files)
    doc_files: list[Path] = []
    yaml_files: list[Path] = []
    python_files: list[Path] = []
    other_files: list[Path] = []
    area_set: set[str] = set()
    buckets: dict[str, list[Path]] = defaultdict(list)

    for file_path in files:
        suffix = file_path.suffix.lower()
        if len(file_path.parts) <= 1:
            bucket_key = "[repo root]"
        else:
            bucket_key = file_path.parts[0]
        buckets[bucket_key].append(file_path)

        if is_doc_file(file_path):
            doc_files.append(file_path)
            area_set.add("Documentation")
        elif suffix in YAML_EXTS or file_path.name.endswith(".yaml"):
            yaml_files.append(file_path)
            label = CONFIG_FOLDERS.get(file_path.name)
            area_set.add(f"HA Config{f': {label}' if label else ''}")
        elif suffix in PYTHON_EXTS:
            python_files.append(file_path)
            if "custom_components" in file_path.parts:
                area_set.add("Custom Component Python")
            else:
                area_set.add("Python Scripts/Tools")
        else:
            other_files.append(file_path)
            area_set.add("Other")

    if not files:
        classification = "empty"
    elif doc_files and len(doc_files) == len(files):
        classification = "docs-only"
    else:
        classification = "mixed"

    areas = sorted(area for area in area_set if area != "Other")
    if "Other" in area_set:
        areas.append("Other")

    return ChangeContext(
        files=files,
        doc_files=doc_files,
        yaml_files=yaml_files,
        python_files=python_files,
        other_files=other_files,
        classification=classification,
        areas=areas,
        top_level_buckets=dict(sorted(buckets.items())),
    )


def is_doc_file(path: Path) -> bool:
    if path.suffix.lower() in DOC_EXTS:
        return True
    return path.parts and path.parts[0] == "docs"


def suggest_subject(ctx: ChangeContext) -> str:
    if ctx.classification == "empty":
        return "chore: stage changes before generating message"
    if ctx.classification == "docs-only":
        return "docs: refresh documentation"
    if ctx.python_files and not ctx.yaml_files and not ctx.doc_files:
        return "feat: update automation scripts"
    if ctx.yaml_files and not ctx.python_files:
        return "chore: update YAML configuration"
    if ctx.python_files and ctx.yaml_files:
        return "feat: update automations and config"
    return "chore: update project files"


def summary_lines(ctx: ChangeContext) -> list[str]:
    lines: list[str] = []
    for bucket, paths in ctx.top_level_buckets.items():
        samples = ", ".join(p.name for p in paths[:3])
        extra = f", ... +{len(paths) - 3}" if len(paths) > 3 else ""
        lines.append(
            f"touch {len(paths)} file(s) under `{bucket}` ({samples}{extra})"
        )
    return lines or ["document staged change intent before committing"]


def testing_lines(ctx: ChangeContext) -> list[str]:
    if ctx.classification == "empty":
        return ["nothing staged - run pre-commit once files are staged"]
    if ctx.classification == "docs-only":
        return ["n/a - docs-only change"]

    lines = ["pre-commit run --all-files"]
    if ctx.yaml_files:
        lines.append(
            "ha core check (or poetry run python scripts/ha_check_portable.py)"
        )
    if ctx.python_files:
        lines.append("poetry run pytest (or targeted script checks)")
    return lines


def deploy_lines(ctx: ChangeContext) -> list[str]:
    if ctx.classification == "docs-only":
        return ["no Home Assistant restart required"]
    lines = ["pull latest on HA host and reload affected domains"]
    if ctx.yaml_files:
        lines.append(
            "reload automations/scripts or restart Home Assistant if necessary"
        )
    return lines


def render_commit(ctx: ChangeContext) -> str:
    subject = suggest_subject(ctx)
    body_sections = [
        "Summary:",
        *[f"- {line}" for line in summary_lines(ctx)],
        "",
        "Testing:",
        *[f"- [ ] {line}" for line in testing_lines(ctx)],
    ]
    if ctx.areas:
        body_sections.extend(
            ["", "Impacted Areas:", *[f"- {area}" for area in ctx.areas]]
        )
    body = "\n".join(body_sections).rstrip()
    return f"{subject}\n\n{body}"


def render_merge(ctx: ChangeContext) -> str:
    subject = suggest_subject(ctx)
    summary = "\n".join(f"- {line}" for line in summary_lines(ctx))
    testing = "\n".join(f"- [ ] {line}" for line in testing_lines(ctx))
    deployment = "\n".join(f"- [ ] {line}" for line in deploy_lines(ctx))
    areas = (
        "\n".join(f"- {area}" for area in ctx.areas) or "- (none highlighted)"
    )
    return (
        f"## {subject}\n\n"
        f"### Summary\n{summary}\n\n"
        f"### Testing\n{testing}\n\n"
        f"### Deployment\n{deployment}\n\n"
        f"### Impacted Areas\n{areas}"
    )


def render_review_bullets(ctx: ChangeContext) -> str:
    bullets = []
    for index, line in enumerate(summary_lines(ctx), start=1):
        bullets.append(f"{index}. {line}")
    tests = ", ".join(testing_lines(ctx))
    if tests:
        bullets.append(f"{len(bullets) + 1}. Tests: {tests}")
    if ctx.areas:
        bullets.append(f"{len(bullets) + 1}. Impact: {', '.join(ctx.areas)}")
    return "\n".join(f"- {bullet}" for bullet in bullets)


def build_output(
    ctx: ChangeContext,
    include_commit: bool,
    include_merge: bool,
    include_comments: bool,
) -> str:
    parts: list[str] = []
    if include_commit:
        parts.append("=== Commit Message ===")
        parts.append(render_commit(ctx))
    if include_merge:
        parts.append("=== Merge Template ===")
        parts.append(render_merge(ctx))
    if include_comments:
        parts.append("=== Review Bullets ===")
        parts.append(render_review_bullets(ctx))
    return "\n\n".join(parts).strip()


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Suggest commit, merge, and review artifacts from staged changes."
    )
    parser.add_argument(
        "--commit",
        action="store_true",
        help="Emit only the commit subject/body suggestion.",
    )
    parser.add_argument(
        "--merge",
        action="store_true",
        help="Emit only the merge message template.",
    )
    parser.add_argument(
        "--comments",
        action="store_true",
        help="Emit only review/change-summary bullets.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        help="Optional file to write the generated output. Overwrites if present.",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str]) -> int:
    args = parse_args(argv)
    ctx = categorize(staged_files())

    filters = [args.commit, args.merge, args.comments]
    if not any(filters):
        include_commit = include_merge = include_comments = True
    else:
        include_commit, include_merge, include_comments = filters

    output = build_output(ctx, include_commit, include_merge, include_comments)
    if not output:
        output = "No staged changes detected. Stage files before running."

    if args.output:
        args.output.write_text(output + "\n", encoding="utf-8")
    else:
        print(output)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
