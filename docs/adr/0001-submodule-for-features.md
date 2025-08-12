# ADR-0001: Use a Git submodule for feature specs

- **Status:** Accepted
- **Date:** 2025-08-12
- **Deciders:** Maintainers
- **Tags:** repo-structure, submodule, home-assistant

## Context
We want to evolve feature specifications independently from the production Home Assistant configuration while keeping a single deployment anchor. Splitting the repos allows stable ops in `gate-hub` and faster iteration in `haos-features`.

## Options
1. Keep everything in a single repo
2. Separate repos and vendor in copies
3. **Separate repo referenced as a Git submodule** ✅

## Decision
Adopt a Git submodule at `external/haos` pointing to `dsainz3/haos-features@main`.

## Consequences
- **Pros**
  - Clear separation of concerns; stable main config vs. evolving features.
  - Exact commit pinning per deployment; reproducible builds.
  - Easy to bump via PR with review.
- **Cons**
  - Requires `--recurse-submodules` or CI `submodules: true`.
  - Some contributors are less familiar with submodules.

## Implementation Notes
- Initialized submodule at `external/haos`.
- CI checkout uses `actions/checkout@v4` with `submodules: true` and `fetch-depth: 0`.
- Optional scheduled workflow will open a PR when the submodule advances.

## Links
- Submodule: `external/haos` → `https://github.com/dsainz3/haos-features`
