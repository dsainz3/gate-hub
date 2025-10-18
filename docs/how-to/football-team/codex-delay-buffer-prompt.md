---
title: Codex Prompt – Huskers Dashboard 30-Second Delay
summary: Credits-optimized instructions for generating a 30-second spoiler buffer on the football dashboards and refreshing the supporting documentation.
status: active
category: how-to
updated: 2025-10-17
owner: playbook-team
tags:
  - codex
  - football
  - dashboards
  - automation
---

# Codex Prompt – Huskers Dashboard 30-Second Delay

Use this compact prompt when you need Codex (or another code-generation assistant) to wire a 30-second scoreboard buffer into the Huskers dashboards without overspending credits. Paste it directly into the assistant and answer the inline TODOs before submission.

> **Scope**: Work happens inside this repository (`gate-hub`). The delay must apply to both Home Assistant sensors and the dashboards that read them.

## Prompt

```text
You are a senior Home Assistant engineer collaborating on the `gate-hub` repo.

Goal: add an optional 30-second delay to the Huskers TeamTracker presentation so streaming viewers avoid spoilers.

Implementation requirements:
1. Automations & helpers
   - Reuse the existing manual override helpers: `input_boolean.huskers_use_manual_score`, `input_number.huskers_our_score_manual`, `input_number.huskers_opponent_score_manual`, and any clock-related helpers already defined.
   - Add the delay automations inside `packages/huskers.yaml` alongside the existing Huskers helpers; trigger whenever `sensor.husker_team` updates score, clock, or period attributes.
   - The automation must wait 30 seconds (`delay: "00:00:30"`) before copying live values into the manual helpers and run in `mode: parallel` with a high `max` so rapid clock ticks queue instead of cancelling the spoiler window.
   - Ensure manual helpers revert to live values instantly when the delay boolean is off.
   - Introduce a new `input_boolean.huskers_use_score_delay` so operators can toggle the buffer. Default to `off`.
2. Dashboards
   - Update Huskers dashboards (`dashboards/huskers-teamtracker.yaml` and any derived views) so scoreboard cards read from the "effective" sensors that respect the delay flag.
   - Surface a visible toggle (prefer Lovelace `entity-button`) so users can switch the delay on/off from the Game Day view.
3. Documentation
   - Update `docs/how-to/football-team/dashboard.md` with an "Anti-Spoiler Delay" subsection covering how the automation works, how to enable it, and fallback behaviour.
   - Add a changelog entry or release note if an appropriate doc exists; otherwise append to the existing Huskers package note.
4. Testing
   - Add or update tests in `tests/` that validate the automation logic (mock delayed copy, toggle off behaviour).
   - Provide step-by-step manual validation notes in the PR description.

Constraints:
- Preserve existing entity ids.
- Follow repository style guides (YAML anchors, doc front-matter, etc.).
- Keep diff minimal; update only files needed for this feature.

Deliverables: committed changes, passing tests, updated documentation, and a PR message summarizing the delay feature.

Before you begin, confirm the automation block placement in `packages/huskers.yaml` (TODO: confirm or adjust line range) and note any extra helpers required (TODO: list additional helpers or confirm none).
```

## Usage Notes
- Replace the inline TODOs with concrete answers before invoking the model so it does not pause to re-ask them.
- If Codex suggests adding new helpers, make sure they live alongside the existing Huskers helpers (`input_number.yaml`, etc.) and include them in the documentation update.
- After Codex returns a patch, review the diff to ensure only the required files changed and that YAML indentation matches the repository conventions.

## Related Topics
- [Football Team Dashboard Guide](dashboard.md)
- [Football Team Dashboard History](../../explanation/football-team-dashboard-history.md)
