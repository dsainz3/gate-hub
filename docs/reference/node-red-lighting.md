---
title: Node-RED Lighting Reference
summary: Tab-by-tab breakdown of the Node-RED flows exported in `noderd.js` and its variants.
status: active
category: reference
updated: 2025-10-24
owner: automation-team
tags:
  - home-assistant
  - node-red
  - lighting
---

# Node-RED Lighting Reference

The lighting, safety, and show automations that previously lived in YAML now execute inside
Node-RED. Their definitions are versioned as `noderd.js` (plus the focused exports
`noderd.sun.js`, `noderd.cloudy.js`, and JSON snapshots) so reviewers can diff flows without
opening the UI. Update this page whenever a tab gains nodes, new guards, or wiring changes.

## Export Artifacts

| File | Purpose |
| --- | --- |
| `noderd.js` | Primary export containing every tab listed below. Import it into Node-RED to restore the full workspace. |
| `noderd.sun.js` / `noderd.sun.json` | Minimal export for the **Lighting Sun Automations** tab when testing sunrise/sunset adjustments. |
| `noderd.cloudy.js` / `noderd.cloudy.json` | Focused export for **Cloudy Daytime Exterior** tuning or tabletop reviews. |

All exports include the same tab IDs the catalog references, keeping notation identical between
code review, documentation, and the Node-RED editor.

## Tabs at a Glance

| Tab | Intent |
| --- | --- |
| **Cloudy Daytime Exterior** | Adjusts tracked exterior lights based on live cloud coverage, validates actual brightness/off states, and cleans up logbook/notification noise. |
| **Lighting Utility Automations** | Keeps daily LED effects and corrective automations in sync, reruns missed jobs, and enforces holiday/hold guards with logbook summaries. |
| **Safety & Maintenance** | Protects safety devices (humidor cooling, cooktop burners) and orchestrates the Reolink camera warm-up snapshots after restarts. |
| **PLighting Seasonal Shows** | Drives the permanent outdoor lighting (PLighting) palette loops with per-fixture random waits and stop-button controls. |
| **Lighting Sun Automations** | Handles sunrise/sunset schedules, applies sunrise/sunset scenes, and presses PLighting start/stop buttons around the daypart triggers. |
| **TLighting Seasonal Shows** | Runs the test-lab interior lights through monthly palettes with random waits plus a universal stop action. |
| **Test · Sun Sim Controls** | Provides manual injectors to simulate sun positions (offsets before/after sunset) while QAing the brightness subflows. |
| **TLighting · Scarlet & Cream** | Huskers-specific interior show that listens to the test game mode button and alternates scarlet/cream pulses until the stop button fires. |

## Cloudy Daytime Exterior (`df0c3d394881af2d`)

- **Triggers:** Manual inject (`Periodic check`) plus state changes from `sensor.cloud_coverage`,
  `sun.sun`, and each tracked light entity (split nodes `Each tracked light`).
- **Guards:** `binary_sensor.holiday_mode_active` and
  `binary_sensor.huskers_lighting_hold` short-circuit adjustments via the “Lighting hold active?”
  and “Sun above horizon?” checks.
- **Actions:** `Compute cloud logic` determines whether to brighten, turn off, or leave as-is.
  Each branch sets context for the target lights, applies `light.turn_on` or `light.turn_off`,
  validates the result (“Validate cloudy brightness” and “Validate cleared light”), and routes to
  paired logbook/notification nodes (`Logbook cloudy success`, `Notify cloudy failure`, etc.).
- **Observability:** Extra delays (“Wait for brightness/off”) ensure the validation samples the
  final state before emitting log entries, preventing false positives when transitions are in
  progress.

## Lighting Utility Automations (`7be417f0d3f1e35e`)

- **Triggers:** Injects for startup (`homeassistant_start`), automation reloads, fail-safe
  heartbeats, and LED availability changes.
- **Guards:** `Holiday mode off?` and `Lighting hold inactive?` nodes prevent LED effects from
  stomping over special-event lighting. `Gate on availability` keeps calls away from unavailable
  entities.
- **Actions:** `Build LED job`, `Need to apply?`, and `Need refresh?` decide whether to press the
  LED effect scenes, while `Compute fail-safe actions` schedules corrective automation triggers if
  the daily schedule misses a run. Success/failure is logged through dedicated call-service nodes
  so the Logbook mirrors what Node-RED attempted.

## Safety & Maintenance (`b0ce83b4c7194f6d`)

- **Humidor cooling guard:** `Humidor temp change` evaluates the latest reading, chooses the
  appropriate humidifier scene, and logs the action.
- **Nightly burner shutoff:** The `Nightly burner shutoff` inject ensures the kitchen burners
  receive an `off` call every night, logging and notifying only when an entity required action.
- **Reolink warm-up:** `homeassistant_start` kicks off `Build warmup queue`, sequences snapshots
  across cameras (`Prime snapshot`, `Refresh motion sensors`), and spaces the requests to avoid
  hammering the devices.

## PLighting Seasonal Shows (`5bf285a455077f62`)

- **Inputs:** Start/stop buttons mapped to `input_button.plighting_*` events.
- **Loop logic:** `Init: palette, settings` seeds the color palette and brightness targets,
  while each fixture (`Front Left`, `Front Right`, `Garage*`) owns a “next random color” function
  plus a 15–20 second randomized delay.
- **Stop handling:** The `stop_flag` lives on flow context. `Stop requested?` examines the flag and
  `set flow.stop_flag = true` responds to the stop button event so every branch stops gracefully.
- **Notifications:** Start/stop events write to the Logbook for traceability.

## Lighting Sun Automations (`234945acd17cd327`)

- **Triggers:** `sun.sun` crossing the horizon, plus state listeners for all PLighting entities so
  start/stop presses only fire when lights are actually running.
- **Daypart scenes:** Separate service nodes apply interior vs exterior scenes, each with matching
  logbook entries. The `Offset` delays model the existing YAML offsets (5 and 15 minutes).
- **Show integration:** The flow presses PLighting start/stop buttons depending on whether the
  show should run after sunset or when everything powers down at sunrise.
- **Guardrails:** Checks for holiday mode, Huskers light shows, and the lighting hold helper keep
  the automated scenes from interrupting manual events.

## TLighting Seasonal Shows (`7e180ead4ba54b28`)

- **Monthly palettes:** `Init: monthly palette, settings` and each `monthIdx` change node set the
  palette for test lighting based on the calendar.
- **Loop orchestration:** Each light (Left, Right, Office, Sunroom) rotates through a random color
  with 5–25 second randomized waits so the group stays asynchronous.
- **Controls:** Test buttons (`Start · January`, etc.) kick off the flow, and a single stop button
  flips the shared `stop_flag`.

## Test · Sun Sim Controls (`b6a2a23f1dc4SIM`)

- Provides injectors to force global context overrides that mimic “sunset in 4 minutes,” “sunset
  now,” or “sunset just happened.” This feeds the `TLighting Sun Brightness (Test)` subflow so
  QA can observe the same brightness transitions without waiting for real sun events.
- Includes a “Clear override” injector to fall back to actual `sun.sun` data.

## TLighting · Scarlet & Cream (`ac09184e85596daf`)

- Responds to `input_button.test_husker_game_mode` by seeding a scarlet + cream palette and
  sequentially moving the cream accent across the lights while scarlet remains the base color.
- The stop button (`input_button.test_lighting_stop`) sets `flow.stop_flag` and writes a “show
  stopped” log, mirroring the seasonal shows.

## Subflows

| Subflow | Purpose |
| --- | --- |
| **Independent Light Loop** (`a79b55aedfbeef10`) | Picks a color from the active palette while guaranteeing no two lights share the same color simultaneously. Accepts `ENTITY_ID` as an environment variable. |
| **TLighting Sun Brightness (Test)** (`sub_tlighting_sun_brightness_test`) | Provides tunable env vars for pre-show lead time, pre-show brightness, sunset brightness, and transition duration so the sun simulation injectors can verify smooth ramping. |

Subflows remain reusable building blocks—callers set env vars before invoking them, and the logic
stays centralized inside the export.
