# Football Team Automations Review

## Scope
This review looks at the Football Team Home Assistant automations defined in `packages/huskers.yaml` (file name retained for compatibility), with a focus on the pregame showtime, touchdown celebration, and postgame cleanup routines. Swap entity names to match your club before deploying to production.

## Strengths
- **Clear triggers and logging.** Each automation has explicit triggers, and most actions end with a `logbook.log` call for traceability, which aids troubleshooting during gameday flows. 【F:packages/huskers.yaml†L1402-L1443】【F:packages/huskers.yaml†L1496-L1548】【F:packages/huskers.yaml†L1550-L1578】【F:packages/huskers.yaml†L1580-L1644】
- **Defensive conditions around score-based triggers.** The touchdown celebration verifies the score actually increased before firing the light show, which avoids false positives when the sensor refreshes with the same value. 【F:packages/huskers.yaml†L1550-L1578】

## Corrections implemented
1. **Game mode toggling is now manual.** The audit sensor and dashboards no longer reference enable/disable automations, so on-call staff can focus on manually managing `input_boolean.huskers_game_mode` while the remaining automations handle lighting and celebrations. 【F:packages/huskers.yaml†L1411-L1467】【F:dashboards/huskers.dashboard.yaml†L34-L53】【F:dashboards/automations.dashboard.yaml†L59-L110】

2. **Postgame cleanup has defensive fallbacks.** The cleanup automation listens for the postgame sensor dropping to `off`, `unknown`, or `unavailable`, watches for manual game mode shutdowns, and includes a five-minute watchdog that stops runaway chase loops if they have been active for 15 minutes without fresh postgame data. 【F:packages/huskers.yaml†L1580-L1644】

3. **Pregame showtime has a safety net.** A minute-based poll keeps the pregame chase ready to fire whenever kickoff is within 25 minutes, covering countdown skips while still honoring the “only run once” protections. 【F:packages/huskers.yaml†L1496-L1548】

## Next steps
Monitor a full game cycle to confirm the new safety triggers fire only when appropriate, then consider expanding the watchdog pattern to other long-running effects if needed.
