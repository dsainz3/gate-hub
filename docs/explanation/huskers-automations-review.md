# Huskers Automations Review

## Scope
This review looks at the Nebraska Huskers Home Assistant automations defined in `packages/huskers.yaml`, with a focus on the game mode window, pregame showtime, touchdown celebration, and postgame cleanup routines.

## Strengths
- **Clear triggers and logging.** Each automation has explicit triggers, and most actions end with a `logbook.log` call for traceability, which aids troubleshooting during gameday flows. 【F:packages/huskers.yaml†L1402-L1443】【F:packages/huskers.yaml†L1496-L1548】【F:packages/huskers.yaml†L1550-L1578】【F:packages/huskers.yaml†L1580-L1644】
- **Defensive conditions around score-based triggers.** The touchdown celebration verifies the score actually increased before firing the light show, which avoids false positives when the sensor refreshes with the same value. 【F:packages/huskers.yaml†L1550-L1578】

## Corrections implemented
1. **Game mode window honors the master toggle when enabling.** The enable automation now checks `input_boolean.huskers_automations_enabled` before flipping `input_boolean.huskers_game_mode`, while the disable logic stays active so it can still shut things down when you turn the master switch off. 【F:packages/huskers.yaml†L1398-L1494】

2. **Postgame cleanup has defensive fallbacks.** The cleanup automation listens for the postgame sensor dropping to `off`, `unknown`, or `unavailable`, watches for manual game mode shutdowns, and includes a five-minute watchdog that stops runaway chase loops if they have been active for 15 minutes without fresh postgame data. 【F:packages/huskers.yaml†L1580-L1644】

3. **Pregame showtime has a safety net.** A minute-based poll keeps the pregame chase ready to fire whenever kickoff is within 25 minutes, covering countdown skips while still honoring the “only run once” protections. 【F:packages/huskers.yaml†L1496-L1548】

## Next steps
Monitor a full game cycle to confirm the new safety triggers fire only when appropriate, then consider expanding the watchdog pattern to other long-running effects if needed.
