"""Generate GitHub repository health metrics and supporting artifacts.

This script fetches commit, pull request and GitHub Actions data using the
GitHub GraphQL and REST APIs. It then produces visualisations, Markdown and
HTML reports that can be embedded in a Home Assistant dashboard.

Usage example (matching the scheduled workflow):

    python scripts/metrics.py \
        --repo dsainz3/gate-hub \
        --output www/metrics \
        --markdown --html --summary-html --update-readme

Environment variables:
    GITHUB_TOKEN (recommended)

The script is intentionally light on third-party dependencies - only
``requests``, ``matplotlib`` and ``markdown`` are required. When
``GITHUB_TOKEN`` is unavailable, it falls back to unauthenticated REST requests
with reduced detail but still produces dashboard artefacts.
"""

from __future__ import annotations

import argparse
import datetime as dt
import importlib
import json
import math
import os
import sys
from collections import defaultdict
from collections.abc import Iterable
from dataclasses import dataclass
from pathlib import Path
from types import ModuleType

import matplotlib.pyplot as plt
import requests
from matplotlib.figure import Figure


def _load_markdown() -> ModuleType | None:
    try:
        return importlib.import_module("markdown")
    except Exception:  # pragma: no cover - optional dependency handled upstream
        return None


IMAGE_FORMAT = "svg"


plt.switch_backend("Agg")


markdown = _load_markdown()


GRAPHQL_ENDPOINT = "https://api.github.com/graphql"
COMMITS_URL_TEMPLATE = "https://api.github.com/repos/{owner}/{repo}/commits"
PULLS_URL_TEMPLATE = "https://api.github.com/repos/{owner}/{repo}/pulls"
ACTIONS_URL_TEMPLATE = (
    "https://api.github.com/repos/{owner}/{repo}/actions/runs"
)


@dataclass
class Commit:
    sha: str
    committed_at: dt.datetime
    author: str
    message: str
    additions: int
    deletions: int
    changed_files: int


@dataclass
class PullRequest:
    number: int
    created_at: dt.datetime
    closed_at: dt.datetime | None
    merged_at: dt.datetime | None
    additions: int
    deletions: int
    changed_files: int


@dataclass
class WorkflowRun:
    conclusion: str | None
    created_at: dt.datetime


class GitHubMetricsClient:
    """Small helper around the GitHub GraphQL + REST APIs."""

    def __init__(
        self, token: str | None, session: requests.Session | None = None
    ) -> None:
        self._token = token
        self._session = session or requests.Session()
        self._session.headers.update(
            {
                "Accept": "application/vnd.github+json",
                "User-Agent": "repo-metrics-automation",
            }
        )
        if token:
            self._session.headers["Authorization"] = f"Bearer {token}"

    def graphql(
        self, query: str, variables: dict[str, object]
    ) -> dict[str, object]:
        if not self._token:
            raise RuntimeError("GraphQL endpoint requires authentication")

        response = self._session.post(
            GRAPHQL_ENDPOINT,
            json={"query": query, "variables": variables},
            timeout=30,
        )
        response.raise_for_status()
        payload = response.json()
        if payload.get("errors"):
            raise RuntimeError(payload["errors"])
        return payload["data"]

    def _iter_commit_history_graphql(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[Commit]:
        query = """
        query($owner: String!, $name: String!, $since: GitTimestamp!, $page: Int!, $cursor: String) {
          repository(owner: $owner, name: $name) {
            defaultBranchRef {
              target {
                ... on Commit {
                  history(first: $page, after: $cursor, since: $since) {
                    pageInfo { hasNextPage endCursor }
                    edges {
                      node {
                        oid
                        committedDate
                        messageHeadline
                        additions
                        deletions
                        changedFiles
                        author {
                          user { login }
                          name
                          email
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        """

        cursor: str | None = None
        page = 100
        while True:
            data = self.graphql(
                query,
                {
                    "owner": owner,
                    "name": repo,
                    "since": since.isoformat(),
                    "page": page,
                    "cursor": cursor,
                },
            )
            history = (
                data.get("repository", {})
                .get("defaultBranchRef", {})
                .get("target", {})
                .get("history")
            )
            if not history:
                return

            for edge in history.get("edges", []):
                node = edge.get("node", {})
                committed_at = dt.datetime.fromisoformat(
                    node["committedDate"].replace("Z", "+00:00")
                )
                author = (
                    node.get("author", {}).get("user", {}).get("login")
                    or node.get("author", {}).get("name")
                    or node.get("author", {}).get("email")
                    or "unknown"
                )
                yield Commit(
                    sha=node["oid"],
                    committed_at=committed_at,
                    author=author,
                    message=node.get("messageHeadline", ""),
                    additions=node.get("additions") or 0,
                    deletions=node.get("deletions") or 0,
                    changed_files=node.get("changedFiles") or 0,
                )

            page_info = history.get("pageInfo", {})
            if not page_info.get("hasNextPage"):
                break
            cursor = page_info.get("endCursor")

    def _iter_commit_history_rest(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[Commit]:
        page = 1
        while True:
            response = self._session.get(
                COMMITS_URL_TEMPLATE.format(owner=owner, repo=repo),
                params={
                    "since": since.isoformat(),
                    "per_page": 100,
                    "page": page,
                },
                timeout=30,
            )
            response.raise_for_status()
            payload = response.json()
            if not payload:
                break
            for item in payload:
                commit_payload = item.get("commit", {})
                author_payload = commit_payload.get("author", {}) or {}
                committed_at = author_payload.get("date")
                if not committed_at:
                    continue
                committed_dt = dt.datetime.fromisoformat(
                    committed_at.replace("Z", "+00:00")
                )
                if committed_dt < since:
                    return
                author_login = None
                if item.get("author") and item["author"].get("login"):
                    author_login = item["author"]["login"]
                author = author_login or author_payload.get("name") or "unknown"
                message = commit_payload.get("message", "").splitlines()[0]
                yield Commit(
                    sha=item.get("sha", ""),
                    committed_at=committed_dt,
                    author=author,
                    message=message,
                    additions=0,
                    deletions=0,
                    changed_files=0,
                )
            page += 1

    def iter_commit_history(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[Commit]:
        if self._token:
            try:
                yield from self._iter_commit_history_graphql(owner, repo, since)
                return
            except requests.HTTPError as exc:
                if exc.response is None or exc.response.status_code not in {
                    401,
                    403,
                }:
                    raise
            except RuntimeError:
                pass

        print(
            "Falling back to REST commit history (reduced detail).",
            file=sys.stderr,
        )
        yield from self._iter_commit_history_rest(owner, repo, since)

    def _iter_pull_requests_graphql(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[PullRequest]:
        query = """
        query($owner: String!, $name: String!, $page: Int!, $cursor: String) {
          repository(owner: $owner, name: $name) {
            pullRequests(states: CLOSED, orderBy: {field: UPDATED_AT, direction: DESC}, first: $page, after: $cursor) {
              pageInfo { hasNextPage endCursor }
              nodes {
                number
                createdAt
                closedAt
                mergedAt
                additions
                deletions
                changedFiles
              }
            }
          }
        }
        """

        cursor: str | None = None
        page = 50
        while True:
            data = self.graphql(
                query,
                {
                    "owner": owner,
                    "name": repo,
                    "page": page,
                    "cursor": cursor,
                },
            )
            pr_data = data.get("repository", {}).get("pullRequests", {})
            if not pr_data:
                return

            for node in pr_data.get("nodes", []):
                created_at = dt.datetime.fromisoformat(
                    node["createdAt"].replace("Z", "+00:00")
                )
                if created_at < since:
                    return
                closed_at = node.get("closedAt") and dt.datetime.fromisoformat(
                    node["closedAt"].replace("Z", "+00:00")
                )
                merged_at = node.get("mergedAt") and dt.datetime.fromisoformat(
                    node["mergedAt"].replace("Z", "+00:00")
                )
                yield PullRequest(
                    number=node["number"],
                    created_at=created_at,
                    closed_at=closed_at,
                    merged_at=merged_at,
                    additions=node.get("additions") or 0,
                    deletions=node.get("deletions") or 0,
                    changed_files=node.get("changedFiles") or 0,
                )

            page_info = pr_data.get("pageInfo", {})
            if not page_info.get("hasNextPage"):
                break
            cursor = page_info.get("endCursor")

    def _iter_pull_requests_rest(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[PullRequest]:
        page = 1
        while True:
            response = self._session.get(
                PULLS_URL_TEMPLATE.format(owner=owner, repo=repo),
                params={
                    "state": "all",
                    "sort": "created",
                    "direction": "desc",
                    "per_page": 100,
                    "page": page,
                },
                timeout=30,
            )
            response.raise_for_status()
            payload = response.json()
            if not payload:
                break
            for item in payload:
                created_at = dt.datetime.fromisoformat(
                    item["created_at"].replace("Z", "+00:00")
                )
                if created_at < since:
                    return
                closed_at = (
                    dt.datetime.fromisoformat(item["closed_at"].replace("Z", "+00:00"))
                    if item.get("closed_at")
                    else None
                )
                merged_at = (
                    dt.datetime.fromisoformat(item["merged_at"].replace("Z", "+00:00"))
                    if item.get("merged_at")
                    else None
                )
                yield PullRequest(
                    number=item["number"],
                    created_at=created_at,
                    closed_at=closed_at,
                    merged_at=merged_at,
                    additions=item.get("additions", 0),
                    deletions=item.get("deletions", 0),
                    changed_files=item.get("changed_files", 0),
                )
            page += 1

    def iter_pull_requests(
        self, owner: str, repo: str, since: dt.datetime
    ) -> Iterable[PullRequest]:
        if self._token:
            try:
                yield from self._iter_pull_requests_graphql(owner, repo, since)
                return
            except requests.HTTPError as exc:
                if exc.response is None or exc.response.status_code not in {
                    401,
                    403,
                }:
                    raise
            except RuntimeError:
                pass

        print(
            "Falling back to REST pull request history (reduced detail).",
            file=sys.stderr,
        )
        yield from self._iter_pull_requests_rest(owner, repo, since)

    def list_workflow_runs(
        self, owner: str, repo: str, since: dt.datetime
    ) -> list[WorkflowRun]:
        runs: list[WorkflowRun] = []
        page = 1
        while True:
            response = self._session.get(
                ACTIONS_URL_TEMPLATE.format(owner=owner, repo=repo),
                params={"per_page": 100, "page": page},
                timeout=30,
            )
            response.raise_for_status()
            payload = response.json()
            for run in payload.get("workflow_runs", []):
                created_at = dt.datetime.fromisoformat(
                    run["created_at"].replace("Z", "+00:00")
                )
                if created_at < since:
                    return runs
                runs.append(
                    WorkflowRun(
                        conclusion=run.get("conclusion"),
                        created_at=created_at,
                    )
                )
            if (
                not payload.get("workflow_runs")
                or len(payload["workflow_runs"]) < 100
            ):
                break
            page += 1
        return runs


def start_of_week(value: dt.datetime) -> dt.date:
    monday = value - dt.timedelta(days=value.weekday())
    return monday.date()


def start_of_month(value: dt.datetime) -> dt.date:
    return dt.date(value.year, value.month, 1)


def iso_date(value: dt.datetime) -> dt.date:
    return value.date()


def sum_period(
    values: Iterable[tuple[dt.datetime, int]], bucket_fn
) -> dict[dt.date, int]:
    counter: dict[dt.date, int] = defaultdict(int)
    for timestamp, count in values:
        counter[bucket_fn(timestamp)] += count
    return dict(sorted(counter.items()))


def rolling_delta(series: dict[dt.date, int], periods: int = 3) -> float:
    if not series:
        return 0.0
    ordered = list(series.values())
    if len(ordered) < 2:
        return 0.0
    recent = ordered[-1]
    previous = sum(ordered[:-1][-periods:]) / min(len(ordered) - 1, periods)
    if previous == 0:
        return float("inf") if recent > 0 else 0.0
    return (recent - previous) / previous


def summarise_trend(
    values: list[tuple[dt.datetime, int]], window: int
) -> dict[str, float]:
    if not values:
        return {"current": 0, "previous": 0, "delta": 0.0}
    sorted_values = sorted(values, key=lambda item: item[0])
    cutoff_current = sorted_values[-1][0] - dt.timedelta(days=window - 1)
    cutoff_previous = cutoff_current - dt.timedelta(days=window)

    current = sum(v for ts, v in sorted_values if ts >= cutoff_current)
    previous = sum(
        v for ts, v in sorted_values if cutoff_previous <= ts < cutoff_current
    )
    delta = 0.0
    if previous:
        delta = (current - previous) / previous
    elif current:
        delta = float("inf")

    return {"current": current, "previous": previous, "delta": delta}


def render_trend(delta: float) -> str:
    if math.isinf(delta):
        return "∞"
    return f"{delta:+.1%}"


def ensure_directory(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def save_figure(fig: Figure, output: Path) -> None:
    fig.savefig(output, format=IMAGE_FORMAT, bbox_inches="tight")
    plt.close(fig)


def write_placeholder_chart(title: str, output: Path, message: str) -> None:
    fig, ax = plt.subplots(figsize=(10, 3))
    fig.suptitle(title)
    ax.axis("off")
    ax.text(0.5, 0.5, message, ha="center", va="center", fontsize=14)
    fig.tight_layout()
    save_figure(fig, output)


def plot_series(
    title: str, series: dict[dt.date, int], output: Path, ylabel: str
) -> None:
    if not series:
        write_placeholder_chart(title, output, "No data available yet")
        return
    dates = list(series.keys())
    values = list(series.values())

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(dates, values, marker="o")
    ax.set_title(title)
    ax.set_ylabel(ylabel)
    ax.set_xlabel("Period")
    ax.grid(True, linestyle="--", alpha=0.3)
    fig.tight_layout()
    save_figure(fig, output)


def plot_failure_rate(
    title: str, series: dict[dt.date, tuple[int, int]], output: Path
) -> None:
    if not series:
        write_placeholder_chart(title, output, "No workflow runs in range")
        return
    dates = list(series.keys())
    totals = [total for total, _ in series.values()]
    failure_rates = [
        (failures / total) * 100 if total else 0
        for total, failures in series.values()
    ]

    fig, ax1 = plt.subplots(figsize=(10, 5))
    ax1.bar(dates, totals, color="#a6cee3", label="Total runs")
    ax1.set_ylabel("Workflow runs")

    ax2 = ax1.twinx()
    ax2.plot(
        dates,
        failure_rates,
        color="#b15928",
        marker="o",
        label="Failure rate (%)",
    )
    ax2.set_ylabel("Failure rate (%)")
    ax2.set_ylim(0, max(5, max(failure_rates) * 1.2))

    fig.suptitle(title)
    fig.tight_layout()
    save_figure(fig, output)


def format_markdown_report(
    repo: str,
    generated_at: dt.datetime,
    commit_weekly: dict[dt.date, int],
    contributor_weekly: dict[dt.date, int],
    revert_weekly: dict[dt.date, int],
    failure_weekly: dict[dt.date, tuple[int, int]],
    pr_latency_days: float,
    pr_churn: float,
    lines_added: int,
    lines_deleted: int,
    daily_trend: dict[str, float],
    weekly_trend: dict[str, float],
    monthly_trend: dict[str, float],
) -> str:
    lines = [
        f"# Repository metrics for `{repo}`",
        "",
        f"_Generated {generated_at.isoformat()}Z_",
        "",
        "## Highlights",
        "",
        "| Metric | Daily | Weekly | Monthly |",
        "| --- | ---: | ---: | ---: |",
        f"| Commits | {daily_trend['current']} ({render_trend(daily_trend['delta'])}) | {weekly_trend['current']} ({render_trend(weekly_trend['delta'])}) | {monthly_trend['current']} ({render_trend(monthly_trend['delta'])}) |",
        "",
        "## Charts",
        "",
        "![Commits per week](./commits_per_week.svg)",
        "",
        "![Contributors per week](./contributors_per_week.svg)",
        "",
        "![Reverts per week](./reverts_per_week.svg)",
        "",
        "![CI health](./ci_failure_rate.svg)",
        "",
        "## Pull request quality",
        "",
        f"* Median time to merge: `{pr_latency_days:.2f}` days",
        f"* Average files changed per PR: `{pr_churn:.1f}`",
        f"* Lines added vs deleted: `+{lines_added:,}` / `-{lines_deleted:,}`",
    ]
    return "\n".join(lines)


def format_html_report(markdown_content: str, inline_css: bool = False) -> str:
    if markdown is None:
        raise RuntimeError(
            "The markdown package is required to build the HTML report"
        )

    html_body = markdown.markdown(markdown_content, extensions=["tables"])
    if not inline_css:
        return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <title>Repository Metrics</title>
</head>
<body>
{html_body}
</body>
</html>
"""

    css = """
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 1.5rem;
  background: #fff;
  color: #111;
}
@media (prefers-color-scheme: dark) {
  body { background: #111; color: #f1f1f1; }
  a { color: #7aa2f7; }
}
img { max-width: 100%; height: auto; }
table { border-collapse: collapse; }
th, td { padding: 0.4rem 0.8rem; border: 1px solid #9993; }
"""
    return f"""<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"utf-8\" />
  <title>Repository Metrics</title>
  <style>{css}</style>
</head>
<body>
{html_body}
</body>
</html>
"""


def format_summary_html(highlights: dict[str, object]) -> str:
    rows = "".join(
        f"<tr><th>{name}</th><td>{value}</td></tr>"
        for name, value in highlights.items()
    )
    return f"""<!DOCTYPE html>
<html lang=\"en\">
  <head>
    <meta charset=\"utf-8\" />
    <title>Metrics summary</title>
    <style>
      body {{ margin: 0; font-family: system-ui, sans-serif; font-size: 14px; }}
      table {{ width: 100%; border-collapse: collapse; }}
      th, td {{ padding: 0.3rem 0.5rem; text-align: left; }}
      th {{ background: #f5f5f5; }}
      tr:nth-child(even) td {{ background: #fafafa; }}
    </style>
  </head>
  <body>
    <table>
      {rows}
    </table>
  </body>
</html>
"""


def update_readme_summary(readme_path: Path, summary_lines: list[str]) -> None:
    start_marker = "<!-- METRICS:START -->"
    end_marker = "<!-- METRICS:END -->"

    if not readme_path.exists():
        return

    content = readme_path.read_text(encoding="utf-8")
    summary = "\n".join(summary_lines)

    if start_marker in content and end_marker in content:
        pre, _, remainder = content.partition(start_marker)
        _, _, post = remainder.partition(end_marker)
        updated = f"{pre}{start_marker}\n{summary}\n{end_marker}{post}"
    else:
        updated = f"{content}\n\n{start_marker}\n{summary}\n{end_marker}\n"

    readme_path.write_text(updated, encoding="utf-8")


def build_summary_lines(
    generated_at: dt.datetime,
    daily: dict[str, float],
    weekly: dict[str, float],
    monthly: dict[str, float],
    latency_days: float,
) -> list[str]:
    return [
        "## Repository health snapshot",
        f"_Updated {generated_at.isoformat()}Z_",
        "",
        f"- Daily commits: **{daily['current']}** ({render_trend(daily['delta'])})",
        f"- Weekly commits: **{weekly['current']}** ({render_trend(weekly['delta'])})",
        f"- Monthly commits: **{monthly['current']}** ({render_trend(monthly['delta'])})",
        f"- Median PR merge time: **{latency_days:.2f} days**",
    ]


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate GitHub metrics for Home Assistant dashboards"
    )
    parser.add_argument(
        "--repo", required=True, help="Repository in owner/name format"
    )
    parser.add_argument(
        "--output",
        default="www/metrics",
        help="Directory for generated assets",
    )
    parser.add_argument(
        "--markdown", action="store_true", help="Render a Markdown report"
    )
    parser.add_argument(
        "--html", action="store_true", help="Render an HTML report"
    )
    parser.add_argument(
        "--inline-css",
        action="store_true",
        help="Include inline CSS in the HTML report",
    )
    parser.add_argument(
        "--summary-html",
        action="store_true",
        help="Create a compact summary.html snippet",
    )
    parser.add_argument(
        "--update-readme",
        action="store_true",
        help="Inject a summary into README.md between metric markers",
    )
    parser.add_argument(
        "--lookback-days",
        type=int,
        default=120,
        help="How many days of history to analyse",
    )
    args = parser.parse_args()

    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        print(
            "Warning: GITHUB_TOKEN is not set. Falling back to unauthenticated "
            "GitHub API requests with limited detail.",
            file=sys.stderr,
        )

    owner, repo_name = args.repo.split("/", 1)
    since = dt.datetime.utcnow().replace(tzinfo=dt.UTC) - dt.timedelta(
        days=args.lookback_days
    )

    client = GitHubMetricsClient(token)
    commits = list(client.iter_commit_history(owner, repo_name, since))
    pull_requests = list(client.iter_pull_requests(owner, repo_name, since))
    workflow_runs = client.list_workflow_runs(owner, repo_name, since)

    # Aggregate commit-based metrics
    commit_daily_points = [(c.committed_at, 1) for c in commits]
    daily_counts = sum_period(commit_daily_points, iso_date)
    weekly_counts = sum_period(commit_daily_points, start_of_week)
    monthly_counts = sum_period(commit_daily_points, start_of_month)

    contributors_weekly: dict[dt.date, int] = defaultdict(int)
    weekly_authors: dict[dt.date, set] = defaultdict(set)
    for commit in commits:
        week = start_of_week(commit.committed_at)
        weekly_authors[week].add(commit.author)
    for week, authors in weekly_authors.items():
        contributors_weekly[week] = len(authors)
    contributors_weekly = dict(sorted(contributors_weekly.items()))

    revert_weekly_points = [
        (commit.committed_at, 1)
        for commit in commits
        if commit.message.lower().startswith("revert")
    ]
    revert_weekly = sum_period(revert_weekly_points, start_of_week)

    failure_weekly: dict[dt.date, tuple[int, int]] = defaultdict(
        lambda: (0, 0)
    )
    for run in workflow_runs:
        week = start_of_week(run.created_at)
        total, failed = failure_weekly[week]
        total += 1
        if run.conclusion and run.conclusion.lower() not in {
            "success",
            "neutral",
            "skipped",
        }:
            failed += 1
        failure_weekly[week] = (total, failed)
    failure_weekly = dict(sorted(failure_weekly.items()))

    # Pull request analytics
    merged_prs = [pr for pr in pull_requests if pr.merged_at]
    if merged_prs:
        latencies = [
            (pr.merged_at - pr.created_at).total_seconds() / 86400
            for pr in merged_prs
            if pr.merged_at
        ]
        latencies.sort()
        mid = len(latencies) // 2
        if len(latencies) % 2:
            median_latency = latencies[mid]
        else:
            median_latency = (latencies[mid - 1] + latencies[mid]) / 2
    else:
        median_latency = 0.0

    avg_churn = (
        sum(pr.changed_files for pr in merged_prs) / len(merged_prs)
        if merged_prs
        else 0.0
    )
    total_additions = sum(commit.additions for commit in commits)
    total_deletions = sum(commit.deletions for commit in commits)

    daily_trend = summarise_trend(commit_daily_points, window=1)
    weekly_trend = summarise_trend(commit_daily_points, window=7)
    monthly_trend = summarise_trend(commit_daily_points, window=30)

    generated_at = dt.datetime.utcnow().replace(tzinfo=dt.UTC)

    output_dir = Path(args.output)
    ensure_directory(output_dir)

    plot_series(
        "Commits per week",
        weekly_counts,
        output_dir / "commits_per_week.svg",
        "Commits",
    )
    plot_series(
        "Commits per day",
        daily_counts,
        output_dir / "commits_per_day.svg",
        "Commits",
    )
    plot_series(
        "Commits per month",
        monthly_counts,
        output_dir / "commits_per_month.svg",
        "Commits",
    )
    plot_series(
        "Contributors per week",
        contributors_weekly,
        output_dir / "contributors_per_week.svg",
        "Contributors",
    )
    plot_series(
        "Reverts per week",
        revert_weekly,
        output_dir / "reverts_per_week.svg",
        "Reverts",
    )
    plot_failure_rate(
        "Workflow runs and failure rate",
        failure_weekly,
        output_dir / "ci_failure_rate.svg",
    )

    markdown_report = format_markdown_report(
        args.repo,
        generated_at,
        weekly_counts,
        contributors_weekly,
        revert_weekly,
        failure_weekly,
        median_latency,
        avg_churn,
        total_additions,
        total_deletions,
        daily_trend,
        weekly_trend,
        monthly_trend,
    )

    if args.markdown:
        (output_dir / "metrics.md").write_text(
            markdown_report, encoding="utf-8"
        )

    if args.html:
        html_report = format_html_report(
            markdown_report, inline_css=args.inline_css
        )
        (output_dir / "metrics.html").write_text(html_report, encoding="utf-8")

    highlights = {
        "Daily commits": f"{daily_trend['current']} ({render_trend(daily_trend['delta'])})",
        "Weekly commits": f"{weekly_trend['current']} ({render_trend(weekly_trend['delta'])})",
        "Monthly commits": f"{monthly_trend['current']} ({render_trend(monthly_trend['delta'])})",
        "Median PR merge time": f"{median_latency:.2f} days",
    }

    summary_payload = {
        "generated_at": generated_at.isoformat() + "Z",
        "highlights": highlights,
        "lines_added": total_additions,
        "lines_deleted": total_deletions,
        "contributors_last_week": list(contributors_weekly.values())[-1]
        if contributors_weekly
        else 0,
    }
    (output_dir / "summary.json").write_text(
        json.dumps(summary_payload, indent=2), encoding="utf-8"
    )

    if args.summary_html:
        summary_html = format_summary_html(highlights)
        (output_dir / "summary.html").write_text(
            summary_html, encoding="utf-8"
        )

    if args.update_readme:
        summary_lines = build_summary_lines(
            generated_at,
            daily_trend,
            weekly_trend,
            monthly_trend,
            median_latency,
        )
        update_readme_summary(Path("README.md"), summary_lines)


if __name__ == "__main__":
    main()
