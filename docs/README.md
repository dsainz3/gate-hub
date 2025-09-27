---
title: Documentation Style Guide
summary: Conventions, review checklist, and tooling for the gate-hub documentation set.
status: active
category: reference
updated: 2025-09-27
owner: docs-team
tags:
  - docs
  - style-guide
---

# Documentation Style Guide

Follow these rules to keep the documentation consistent, reviewable, and ready for static-site publishing.

## Structure
- Use the Divio model: **tutorials** (coming soon), **how-to**, **reference**, **explanation**, and **archive**.
- Place files in the matching directory (`how-to/`, `reference/`, etc.).
- Name files with hyphenated lowercase titles (e.g., `husker-led-mqtt.md`).

## Front Matter
Every Markdown file (except templates) must start with YAML front matter:

```yaml
---
title: Descriptive Title
summary: One-line synopsis in sentence case.
status: active | archived
category: how-to | reference | explanation | tutorial | archive
updated: YYYY-MM-DD
owner: team-or-role
tags:
  - keyword
---
```

Update `updated` whenever you make a meaningful change. Keep `owner` aligned with the responsible team.

## Writing Conventions
- Prefer imperative headings for how-to guides (e.g., “Install and Configure”).
- Keep paragraphs short; use bullet lists for steps and checklists.
- Link to related documents with relative paths (e.g., `../reference/automations.md`).
- Use fenced code blocks with language hints (`yaml`, `bash`, `json`).
- For alerts or callouts, use Markdown blockquotes (`>`). Avoid raw HTML.

## Review Checklist
1. Correct folder and filename.
2. Front matter present and accurate.
3. Links resolve and categories make sense.
4. Commands verified or noted if environment-specific.
5. Spelling and grammar pass (run `pre-commit run --all-files`).

## Tooling
- Run `pre-commit run --all-files` before committing.
- When adding navigation, update `mkdocs.yml` (see repository root).
- Preview locally with `mkdocs serve` after installing `mkdocs-material` (optional).

## Contributing
- For major structural changes, open or update an ADR in `docs/adr/`.
- Keep the [Documentation Index](index.md) in sync with new pages.
- Archive obsolete content instead of deleting when historical context matters.
