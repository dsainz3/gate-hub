# Stocks Golden Cross Dashboard

## Sources
- Dashboard: `/config/dashboards/stocks_golden_cross.dashboard.yaml`
- Pyscript: `/config/pyscript/stocks_golden_cross.py`
- Package: `/config/packages/stocks_golden_cross.yaml`

## Prerequisites
- Enable the **Pyscript** integration (HACS → Integrations → Pyscript, then add `pyscript:` to
  `configuration.yaml` and restart). Once Home Assistant is back up, reload the Pyscript
  integration so `pyscript.stocks_golden_cross_update` becomes available.
- Ensure the dashboard include is registered under `lovelace:` → `dashboards:` in
  `configuration.yaml`:
  ```yaml
  stocks-golden-cross-dashboard:
    mode: yaml
    title: Stocks Golden Cross
    icon: mdi:finance
    show_in_sidebar: true
    filename: dashboards/stocks_golden_cross.dashboard.yaml
  ```

## Overview
Daily market digest that ranks under-$20 equities showing a fresh SMA-50/200 golden cross.
The Pyscript uses Yahoo Finance metadata (no API key) at the close of each trading day,
records the top performers, and renders them with Mushroom summary chips, Markdown
tables, and ApexCharts history on a dedicated Lovelace view.

## Key Cards
- **Digest chips** – Updated date, universe size, and filtered candidate count map directly to
  sensor attributes for fast health checks.
- **Top 3 table** – Markdown card showing price, SMA values, cross freshness, slope, and score.
- **Ranked watchlist** – Top 15 entries exposed for deeper review with consistent formatting.
- **Controls stack** – Inline edit for `input_text.stocks_watchlist` and a manual refresh button
  wired to `script.stocks_golden_cross_run_now`.
- **Spread sparkline** – ApexCharts card loads `/local/stocks_gc_history/<symbol>.json` to chart
  the 30-day moving spread for each top symbol.

## Data Flow
1. `automation.stocks_golden_cross_daily_update` triggers weekdays at 15:10 America/Chicago.
2. `pyscript.stocks_golden_cross_update` fetches 2y of daily adjusted prices, computes SMAs,
   filters to closes < $20, scores golden crosses, and updates `sensor.stocks_golden_cross`.
3. History files are persisted under `/config/www/stocks_gc_history/` for the charts.
4. Template sensors mirror metadata for other dashboards or automations.

## Operations
- Update the watchlist through the dashboard control or the helper entity.
- Run an ad-hoc refresh via the dashboard button or Developer Tools → Services →
  `pyscript.stocks_golden_cross_update`.
- Confirm the Pyscript integration and the `custom:apexcharts-card` and `custom:mushroom-*`
  cards are installed before loading the dashboard.
