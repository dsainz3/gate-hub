#!/usr/bin/env python3
"""Generate Gretna Sanitation pickup schedule for Buccaneer Bay.

Outputs JSON for Home Assistant command_line sensors covering trash, recycling,
and yard waste. Handles holiday delays and yard-waste seasonal windows.
"""

from __future__ import annotations

import json
from collections.abc import Iterable, Sequence
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

TZ = ZoneInfo("America/Chicago")
TRASH_WEEKDAY = 2  # Wednesday (Monday=0)
RECYCLING_START = date(2024, 7, 10)
RECYCLING_INTERVAL = 14  # days
YARD_SEASON_START_MONTH = 4
YARD_SEASON_END_MONTH = 11
DEFAULT_HORIZON_DAYS = 365
UPCOMING_COUNT = 10


@dataclass(frozen=True)
class Holiday:
    name: str
    actual: date
    observed: date


def nth_weekday_of_month(
    year: int, month: int, weekday: int, occurrence: int
) -> date:
    """Return the date of the nth occurrence of weekday (0=Mon) in given month."""
    if occurrence < 1:
        raise ValueError("occurrence must be >= 1")
    d = date(year, month, 1)
    days_ahead = (weekday - d.weekday()) % 7
    d += timedelta(days=days_ahead + 7 * (occurrence - 1))
    return d


def last_weekday_of_month(year: int, month: int, weekday: int) -> date:
    """Return the date of the last weekday (0=Mon) in given month."""
    if month == 12:
        d = date(year, month, 31)
    else:
        d = date(year, month + 1, 1) - timedelta(days=1)
    while d.weekday() != weekday:
        d -= timedelta(days=1)
    return d


def observed_date(actual: date) -> date:
    """Return the observed holiday date following typical US rules."""
    if actual.weekday() == 5:  # Saturday observed previous Friday
        return actual - timedelta(days=1)
    if actual.weekday() == 6:  # Sunday observed Monday
        return actual + timedelta(days=1)
    return actual


def build_holidays(year: int) -> Sequence[Holiday]:
    """Assemble the holiday set for the specified year."""
    return [
        Holiday(
            "New Year's Day",
            actual=date(year, 1, 1),
            observed=observed_date(date(year, 1, 1)),
        ),
        Holiday(
            "Memorial Day",
            actual=last_weekday_of_month(year, 5, 0),
            observed=observed_date(last_weekday_of_month(year, 5, 0)),
        ),
        Holiday(
            "Independence Day",
            actual=date(year, 7, 4),
            observed=observed_date(date(year, 7, 4)),
        ),
        Holiday(
            "Labor Day",
            actual=nth_weekday_of_month(year, 9, 0, 1),
            observed=observed_date(nth_weekday_of_month(year, 9, 0, 1)),
        ),
        Holiday(
            "Thanksgiving",
            actual=nth_weekday_of_month(year, 11, 3, 4),
            observed=observed_date(nth_weekday_of_month(year, 11, 3, 4)),
        ),
        Holiday(
            "Christmas Day",
            actual=date(year, 12, 25),
            observed=observed_date(date(year, 12, 25)),
        ),
    ]


def build_holiday_lookup(years: Iterable[int]) -> dict[date, list[Holiday]]:
    lookup: dict[date, list[Holiday]] = {}
    for year in years:
        for holiday in build_holidays(year):
            if holiday.observed.weekday() >= 5:
                # Observed on weekend - does not cause a weekday delay.
                continue
            lookup.setdefault(holiday.observed, []).append(holiday)
    return lookup


def next_weekday_on_or_after(start: date, weekday: int) -> date:
    days_ahead = (weekday - start.weekday()) % 7
    return start + timedelta(days=days_ahead)


def apply_holiday_delay(
    pickup: date, observed_lookup: dict[date, list[Holiday]]
) -> tuple[date, str | None]:
    """Shift pickup to next day if a holiday occurs earlier in the same work week."""
    monday = pickup - timedelta(days=pickup.weekday())
    check_days = pickup.weekday() + 1  # inclusive of pickup day
    for offset in range(check_days):
        candidate = monday + timedelta(days=offset)
        holidays = observed_lookup.get(candidate)
        if holidays:
            # A single-day delay covers all subsequent routes.
            names = ", ".join(h.name for h in holidays)
            return pickup + timedelta(days=1), names
    return pickup, None


def is_in_yard_season(candidate: date) -> bool:
    start = date(candidate.year, YARD_SEASON_START_MONTH, 1)
    end = date(candidate.year, YARD_SEASON_END_MONTH, 30)
    return start <= candidate <= end


def yard_season_window(reference: date) -> tuple[date, date]:
    """Return the current or next yard season window covering reference."""
    this_year_start = date(reference.year, YARD_SEASON_START_MONTH, 1)
    this_year_end = date(reference.year, YARD_SEASON_END_MONTH, 30)
    if reference <= this_year_end:
        return this_year_start, this_year_end
    next_year_start = date(reference.year + 1, YARD_SEASON_START_MONTH, 1)
    next_year_end = date(reference.year + 1, YARD_SEASON_END_MONTH, 30)
    return next_year_start, next_year_end


def generate_weekly_schedule(
    today: date,
    weekday: int,
    observed_lookup: dict[date, list[Holiday]],
    count: int,
) -> list[dict]:
    upcoming: list[dict] = []
    cursor = today
    horizon = today + timedelta(days=DEFAULT_HORIZON_DAYS)
    while len(upcoming) < count and cursor <= horizon:
        scheduled = next_weekday_on_or_after(cursor, weekday)
        actual, holiday_name = apply_holiday_delay(scheduled, observed_lookup)
        if actual < today:
            cursor = scheduled + timedelta(days=7)
            continue
        upcoming.append(
            {
                "scheduled_date": scheduled.isoformat(),
                "pickup_date": actual.isoformat(),
                "weekday": actual.strftime("%A"),
                "holiday_delay": bool(holiday_name),
                "delay_reason": holiday_name,
            }
        )
        cursor = scheduled + timedelta(days=7)
    return upcoming


def generate_biweekly_schedule(
    today: date,
    start_date: date,
    interval_days: int,
    observed_lookup: dict[date, list[Holiday]],
    count: int,
) -> list[dict]:
    upcoming: list[dict] = []
    if interval_days <= 0:
        raise ValueError("interval_days must be positive")
    # Determine first candidate on or after today.
    delta_days = (today - start_date).days
    if delta_days <= 0:
        cycles = 0
    else:
        cycles = delta_days // interval_days
        if start_date + timedelta(days=cycles * interval_days) < today:
            cycles += 1
    candidate = start_date + timedelta(days=cycles * interval_days)
    horizon = today + timedelta(days=DEFAULT_HORIZON_DAYS)

    while len(upcoming) < count and candidate <= horizon:
        scheduled = candidate
        actual, holiday_name = apply_holiday_delay(scheduled, observed_lookup)
        if actual >= today:
            upcoming.append(
                {
                    "scheduled_date": scheduled.isoformat(),
                    "pickup_date": actual.isoformat(),
                    "weekday": actual.strftime("%A"),
                    "holiday_delay": bool(holiday_name),
                    "delay_reason": holiday_name,
                }
            )
        candidate += timedelta(days=interval_days)
    return upcoming


def filter_in_season(events: list[dict]) -> list[dict]:
    filtered: list[dict] = []
    for event in events:
        pickup = date.fromisoformat(event["pickup_date"])
        if is_in_yard_season(pickup):
            filtered.append(event)
    return filtered


def build_payload(reference_date: date | None = None) -> dict:
    now = datetime.now(TZ)
    today = reference_date or now.date()
    years = {today.year - 1, today.year, today.year + 1}
    observed_lookup = build_holiday_lookup(years)

    trash_events = generate_weekly_schedule(
        today, TRASH_WEEKDAY, observed_lookup, UPCOMING_COUNT
    )
    recycling_events = generate_biweekly_schedule(
        today,
        RECYCLING_START,
        RECYCLING_INTERVAL,
        observed_lookup,
        UPCOMING_COUNT,
    )
    yard_events = filter_in_season(trash_events)

    season_start, season_end = yard_season_window(today)
    season_active = season_start <= today <= season_end
    if season_active:
        next_season_start = date(today.year + 1, YARD_SEASON_START_MONTH, 1)
        next_season_end = date(today.year + 1, YARD_SEASON_END_MONTH, 30)
    else:
        next_season_start = season_start
        next_season_end = season_end

    def summarize(events: list[dict]) -> dict:
        next_event = events[0] if events else None
        return {
            "next_pickup": next_event["pickup_date"] if next_event else None,
            "next_pickup_scheduled": next_event["scheduled_date"]
            if next_event
            else None,
            "next_pickup_weekday": next_event["weekday"]
            if next_event
            else None,
            "holiday_delay": next_event["holiday_delay"]
            if next_event
            else False,
            "holiday_reason": next_event["delay_reason"]
            if next_event
            else None,
            "days_until": (
                date.fromisoformat(next_event["pickup_date"]) - today
            ).days
            if next_event
            else None,
            "upcoming": events,
        }

    return {
        "status": "ok",
        "generated_at": now.isoformat(),
        "reference_date": today.isoformat(),
        "trash": summarize(trash_events),
        "recycling": summarize(recycling_events),
        "yard_waste": {
            **summarize(yard_events),
            "season_active": season_active,
            "season_start": season_start.isoformat(),
            "season_end": season_end.isoformat(),
            "next_season_start": next_season_start.isoformat(),
            "next_season_end": next_season_end.isoformat(),
        },
        "metadata": {
            "timezone": str(TZ),
            "holiday_years": sorted(years),
            "source": {
                "recycling_seed": RECYCLING_START.isoformat(),
                "holiday_page": "https://www.gretnasanitation.com/holidayschedule",
                "service_page": "https://www.gretnasanitation.com/buccaneer-bay",
            },
        },
    }


def main() -> None:
    import argparse
    import sys

    parser = argparse.ArgumentParser(
        description="Emit Gretna Sanitation pickup schedule as JSON."
    )
    parser.add_argument(
        "--reference-date",
        type=date.fromisoformat,
        help="Override 'today' for testing (format: YYYY-MM-DD)",
    )
    args = parser.parse_args()

    payload = build_payload(reference_date=args.reference_date)
    json.dump(payload, sys.stdout)


if __name__ == "__main__":
    main()
