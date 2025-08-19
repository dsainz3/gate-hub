# Huskers Scoring – Project README

This document describes the Huskers scoring test harness and outlines the path to a full, game‑time experience in Home Assistant.

---

## 1) Goal

Provide a clean, reliable flow to:
- Fire **test scoring events** for Nebraska and the opponent.
- Confirm **notifications/logbook** appear and **entities update**.
- Establish a foundation for **live game‑time tracking**, **schedule awareness**, and a **Huskers dashboard**.

---

## 2) What’s included (current state)

> Target platform: Home Assistant 2025.8+  
> Branch: `feature/huskers-scoring`  
> Packages: **not** used (we load via standard includes)

**Helpers (in `configuration.yaml`):**
- `input_number.huskers_pregame_minutes`
- `input_number.huskers_postgame_minutes`
- `input_boolean.huskers_debug`
- `input_text.huskers_last_score`

**Scripts (in `scripts.yaml`):**
- `script.huskers_test_our_score` — simulates Nebraska TD (+6)
- `script.huskers_test_opponent_score` — simulates Opponent FG (+3)

**Automation (in `automations.yaml`):**
- `huskers_update_last_score_on_event` — listens for `huskers_score` and writes a summary to `input_text.huskers_last_score`.

**Template Sensor (in `templates.yaml`):**
- `sensor.huskers_last_score_test` — mirrors `input_text.huskers_last_score` for dashboards and quick visibility.

---

## 3) Event schema

All scoring logic hinges on a single custom event:

```yaml
event_type: huskers_score
event_data:
  team: "Nebraska" | "Opponent"
  points: <int>           # e.g., 6, 3, 1, 2
  play: "touchdown" | "field_goal" | "safety" | "pat" | "two_point"
  source: "test" | "live" | "import"
```

- **Scripts** fire this event.
- **Automations** and future logic should listen for it.

---

## 4) How it works (end‑to‑end)

1. Run a test script.
2. Script fires `huskers_score` with the payload above.
3. Automation catches the event and writes a timestamped line to `input_text.huskers_last_score`.
4. `sensor.huskers_last_score_test` mirrors that line.
5. Script also raises a **persistent notification** and a **logbook** entry.

---

## 5) File layout (where to edit)

- `configuration.yaml`  
  Adds helpers (input_*). Packages line is commented out.
- `scripts.yaml`  
  Contains both test scripts.
- `automations.yaml`  
  Contains the event→input_text mirror automation.
- `templates.yaml`  
  Contains `sensor.huskers_last_score_test` and other template sensors as needed.

> We intentionally keep the Huskers bits isolated in those four places to simplify troubleshooting and future migration back to packages if desired.

---

## 6) Validate & reload (no restart needed except where noted)

1. **Config check**  
   *Developer Tools → YAML → Check configuration* (or `ha core check`).

2. **Reload**  
   - Helpers, Scripts, Template Entities, Automations (Developer Tools → YAML).

3. **Run tests**  
   *Settings → Automations & Scenes → Scripts*  
   - Run **Huskers – Test: Our Score** and **Huskers – Test: Opponent Score**.

4. **Verify**  
   - Notifications appear.  
   - `input_text.huskers_last_score` updates.  
   - `sensor.huskers_last_score_test` mirrors the new text.

5. **Event bus (optional)**  
   - *Developer Tools → Events → Listen to events* → `huskers_score` → Start listening → run a script to see the payload.

> **Feedreader** is UI-only. Configure it in *Settings → Devices & Services*. It emits events only for **new** items; simulate via *Developer Tools → Events → Fire event* with `event_type: feedreader` and a dummy payload for testing.

---

## 7) Usage patterns (extend me later)

- Add more scripts for other scoring plays (PAT, 2‑pt, safety) with the same `huskers_score` event and distinct `points`/`play`.
- In automations, branch on `trigger.event.data.team`, `points`, and `play` to update score totals, TTS, lights, etc.

---

## 8) Roadmap

**A. Schedule + game‑time awareness**
- Source: CSV/ICS/API of the Nebraska football schedule.
- Entities:
  - `sensor.huskers_next_game_start` (timestamp)
  - `binary_sensor.huskers_pregame_window` / `postgame_window`
  - `binary_sensor.huskers_game_in_progress`
  - `sensor.huskers_kickoff_in` (relative timer)

**B. Live game tracking**
- Real-time input (manual or API) to produce `huskers_score` events with `source: "live"`.
- Running totals, quarter, clock, possession.

**C. Dashboard**
- Upcoming schedule
- In-game status (score, quarter/clock, possession)
- News panel (Feedreader sensors)
- Test controls (the two scripts + any future ones)

**D. Notifications**
- Persistent notifications and/or mobile push for:
  - Scoring plays
  - Game start / halftime / final
  - Breaking news (via Feedreader events)

---

## 9) Troubleshooting

- **Scripts don’t appear**  
  Check `configuration.yaml` contains `script: !include scripts.yaml` (exact filename). Run *Reload Scripts*. Look at *Settings → System → Logs* for YAML errors.

- **Automation not firing**  
  Ensure it’s enabled. Verify event name is exactly `huskers_score`. Use Events listener to confirm scripts emit the payload.

- **Template sensor shows `unknown`**  
  Reload Template Entities, run a script again, confirm `input_text.huskers_last_score` has content.

- **Feedreader shows nothing**  
  Add via **UI** (not YAML). It only emits events for **new** items; to test, fire a manual `feedreader` event.

---

## 10) Conventions

- **Event-first design:** all scoring runs through `huskers_score`.  
- **Separation of concerns:** helpers (state), scripts (emit), automations (react), templates (display).  
- **Idempotence:** avoid duplicating helper names across files.  
- **HA 2025.8+ syntax:** modern `action:` blocks, no deprecated service syntax.

---

## 11) Quick snippets

**Listen to event (for debugging):**
```
Developer Tools → Events → Listen to events → "huskers_score"
```

**Manual Fire (to mimic any score):**
```yaml
event_type: huskers_score
event_data:
  team: "Nebraska"
  points: 2
  play: "safety"
  source: "test"
```

---

## 12) Next steps (when you’re ready)

1. Wire a schedule source and implement the pregame/postgame/game-in-progress sensors.
2. Add score aggregation sensors and a simple “current score” entity.
3. Build the Lovelace dashboard section for Huskers (controls + status + news).
4. Optional: mobile notifications and light effects on scoring plays.

---

_Last updated: 2025-08-19_
