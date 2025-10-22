"""
Stocks Golden Cross daily analyzer using Yahoo Finance chart endpoint.

Fetches watchlist symbols, filters for sub-$20 closes, evaluates SMA-50/200
golden cross freshness, and writes consolidated attributes to
sensor.stocks_golden_cross. Also maintains a 30-day spread history per symbol.
"""

from __future__ import annotations

import json
import os
from datetime import datetime
from typing import Any
from zoneinfo import ZoneInfo

import requests

TIMEZONE = ZoneInfo("America/Chicago")
HISTORY_DIR = "/config/www/stocks_gc_history"
HISTORY_DAYS = 30
MAX_RANKED = 15
TOP_LIMIT = 3
YAHOO_URL = "https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"

DEFAULT_WATCHLIST = [
    "F",
    "PLTR",
    "NIO",
    "SOFI",
    "RUN",
    "SPWR",
    "CHPT",
    "BB",
    "SIRI",
    "DNA",
    "GPRO",
    "NKLA",
    "QS",
    "BBD",
    "GOLD",
    "SBLK",
    "AAL",
    "SAVE",
    "SWN",
    "BTG",
]


if "log" not in globals():  # pragma: no cover - fallback for linting

    class _LogStub:
        def msg(self, *_args, **_kwargs) -> None:
            pass

    log = _LogStub()  # type: ignore[assignment]


if "hass" not in globals():  # pragma: no cover

    class _StatesStub:
        def get(self, *_args, **_kwargs):
            return None

        def set(self, *_args, **_kwargs) -> None:
            pass

    class _HassStub:
        def __init__(self) -> None:
            self.states = _StatesStub()

    hass = _HassStub()  # type: ignore[assignment]


if "service" not in globals():  # pragma: no cover

    def service(func=None, **_kwargs):
        def decorator(wrapper):
            return wrapper

        if func is None:
            return decorator
        return decorator(func)


def _log(msg: str, level: str = "info") -> None:
    log.msg(msg, level=level, name="stocks_golden_cross")


def _read_watchlist() -> list[str]:
    entity_id = "input_text.stocks_watchlist"
    watchlist = hass.states.get(entity_id)
    if watchlist and watchlist.state:
        symbols = [
            token.strip().upper()
            for token in watchlist.state.split(",")
            if token.strip()
        ]
        if symbols:
            return symbols
    return DEFAULT_WATCHLIST


def _fetch_symbol_history(symbol: str) -> dict[str, Any] | None:
    params = {
        "range": "2y",
        "interval": "1d",
        "includePrePost": "false",
        "events": "div,splits",
        "includeAdjustedClose": "true",
    }
    try:
        response = requests.get(
            YAHOO_URL.format(symbol=symbol), params=params, timeout=30
        )
        response.raise_for_status()
    except requests.RequestException as exc:
        _log(f"Failed to fetch {symbol}: {exc}", level="warning")
        return None

    payload = response.json()
    result = payload.get("chart", {}).get("result")
    if not result:
        _log(f"No data returned for {symbol}", level="warning")
        return None

    data = result[0]
    timestamps = data.get("timestamp", [])
    adjclose = (
        data.get("indicators", {}).get("adjclose", [{}])[0].get("adjclose", [])
    )
    close = data.get("indicators", {}).get("quote", [{}])[0].get("close", [])

    if not timestamps or not adjclose:
        _log(f"Incomplete data for {symbol}", level="warning")
        return None

    rows = []
    for ts, price, adj in zip(timestamps, close, adjclose, strict=False):
        if price is None or adj is None:
            continue
        date = datetime.fromtimestamp(ts, tz=ZoneInfo("UTC")).date()
        rows.append({"date": date, "close": price, "adjclose": adj})

    if len(rows) < 210:
        _log(f"Not enough history for {symbol}", level="warning")
        return None

    return {"symbol": symbol, "rows": rows}


def _compute_sma(series: list[float], window: int) -> list[float | None]:
    sma: list[float | None] = [None] * len(series)
    total = 0.0
    for idx, value in enumerate(series):
        total += value
        if idx >= window:
            total -= series[idx - window]
        if idx >= window - 1:
            sma[idx] = total / window
    return sma


def _evaluate_symbol(history: dict[str, Any]) -> dict[str, Any] | None:
    rows = history["rows"]
    closes = [row["adjclose"] for row in rows]
    sma50 = _compute_sma(closes, 50)
    sma200 = _compute_sma(closes, 200)

    diffs: list[float | None] = []
    for s50, s200 in zip(sma50, sma200, strict=False):
        if s50 is None or s200 is None:
            diffs.append(None)
        else:
            diffs.append(s50 - s200)

    if not diffs or diffs[-1] is None:
        return None

    last_close = rows[-1]["close"]
    last_adj = rows[-1]["adjclose"]
    if last_adj is None:
        last_adj = last_close

    if last_adj is None:
        return None

    last_date = rows[-1]["date"]
    crossed_date: datetime.date | None = None
    previous_diff = None
    for idx in range(len(diffs)):
        current_diff = diffs[idx]
        if current_diff is None:
            continue
        if (
            previous_diff is not None
            and current_diff >= 0
            and previous_diff < 0
        ):
            crossed_date = rows[idx]["date"]
        previous_diff = current_diff

    if crossed_date is None:
        return None

    days_since_cross = (last_date - crossed_date).days
    crossed_today = days_since_cross == 0

    recent_indices = [
        idx
        for idx, value in reversed(list(enumerate(diffs)))
        if value is not None
    ][:5]
    recent_spreads = [diffs[idx] for idx in reversed(recent_indices)]
    slope = 0.0
    if recent_spreads:
        slope = (recent_spreads[-1] - recent_spreads[0]) / max(
            len(recent_spreads) - 1, 1
        )

    spread = diffs[-1]
    freshness_bonus = max(0, (30 - min(days_since_cross, 30))) / 30
    price_penalty = 0.2 if last_adj < 1 else 0.0
    slope_bonus = slope * 10
    spread_weight = spread / max(last_adj, 0.01)
    score = (
        (spread_weight * 50)
        + (freshness_bonus * 20)
        + (slope_bonus * 15)
        - (price_penalty * 10)
    )

    return {
        "symbol": history["symbol"],
        "price": round(last_adj, 2),
        "sma50": round(sma50[-1], 3) if sma50[-1] else None,
        "sma200": round(sma200[-1], 3) if sma200[-1] else None,
        "crossed_today": crossed_today,
        "days_since_cross": days_since_cross,
        "spread": round(spread, 4) if spread is not None else None,
        "slope": round(slope, 5),
        "score": round(score, 2),
        "history": rows,
    }


def _update_history(symbol: str, entries: list[dict[str, Any]]) -> None:
    os.makedirs(HISTORY_DIR, exist_ok=True)
    path = os.path.join(HISTORY_DIR, f"{symbol}.json")
    if os.path.exists(path):
        try:
            with open(path, encoding="utf-8") as handle:
                data = json.load(handle)
        except (OSError, json.JSONDecodeError):
            data = []
    else:
        data = []

    indexed = {item["date"]: item for item in data if "date" in item}
    for entry in entries:
        indexed[entry["date"]] = entry

    recent_dates = sorted(indexed.keys())[-HISTORY_DAYS:]
    trimmed = [indexed[date] for date in recent_dates]

    for item in trimmed:
        item["timestamp"] = (
            datetime.strptime(item["date"], "%Y-%m-%d")
            .replace(tzinfo=ZoneInfo("UTC"))
            .timestamp()
        )

    try:
        with open(path, "w", encoding="utf-8") as handle:
            json.dump(trimmed, handle, indent=2)
    except OSError as exc:
        _log(f"Unable to persist history for {symbol}: {exc}", level="error")


def _prepare_history_entry(symbol_result: dict[str, Any]) -> dict[str, Any]:
    return {
        "date": datetime.now(TIMEZONE).date().isoformat(),
        "spread": symbol_result["spread"],
        "sma50": symbol_result["sma50"],
        "sma200": symbol_result["sma200"],
        "price": symbol_result["price"],
    }


@service
def stocks_golden_cross_update(event_data=None) -> None:
    """Main entry point triggered by automation or manual service call."""
    watchlist = _read_watchlist()
    _log(f"Evaluating watchlist: {watchlist}")

    today = datetime.now(TIMEZONE).date()
    results: list[dict[str, Any]] = []
    universe_size = 0
    for symbol in watchlist:
        history = _fetch_symbol_history(symbol)
        if not history:
            continue
        universe_size += 1
        evaluated = _evaluate_symbol(history)
        if not evaluated:
            continue
        if evaluated["price"] is None or evaluated["price"] >= 20.0:
            continue
        results.append(evaluated)

    ranked = sorted(results, key=lambda item: item["score"], reverse=True)[
        :MAX_RANKED
    ]
    top3 = ranked[:TOP_LIMIT]

    for item in top3:
        history_entry = _prepare_history_entry(item)
        _update_history(item["symbol"], [history_entry])

    sensor_attributes = {
        "updated_date": today.isoformat(),
        "universe_size": universe_size,
        "candidates": len(ranked),
        "top3": [
            {
                "symbol": entry["symbol"],
                "price": entry["price"],
                "sma50": entry["sma50"],
                "sma200": entry["sma200"],
                "crossed_today": entry["crossed_today"],
                "days_since_cross": entry["days_since_cross"],
                "slope": entry["slope"],
                "score": entry["score"],
            }
            for entry in top3
        ],
        "ranked": [
            {
                "symbol": entry["symbol"],
                "price": entry["price"],
                "sma50": entry["sma50"],
                "sma200": entry["sma200"],
                "crossed_today": entry["crossed_today"],
                "days_since_cross": entry["days_since_cross"],
                "slope": entry["slope"],
                "score": entry["score"],
            }
            for entry in ranked
        ],
        "data_provider": "yfinance (Yahoo Finance chart API)",
        "run_mode": "auto",
    }

    hass.states.set("sensor.stocks_golden_cross", "updated", sensor_attributes)
    _log(
        f"Sensor updated: universe={sensor_attributes['universe_size']} "
        f"candidates={sensor_attributes['candidates']} top3={[item['symbol'] for item in top3]}"
    )
