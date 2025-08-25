#!/usr/bin/env bash
# ha_optimization_issues.sh
# Create/ensure issues exist in GitHub; optionally add them to a Project v2.
# Designed to be robust in Git Bash (MINGW64) and mixed gh versions.
# Requires: GitHub CLI (gh) with scopes: repo, workflow, read:org, gist, project
# NOTE: Project linking is optional; set PROJECT_ID to enable.

set -Eeuo pipefail

# =========================
# ==== CONFIG (editme) ====
# Override via environment, e.g.:
#   export OWNER="dsainz3"
#   export REPO="gate-hub"
#   export PROJECT_ID="PVT_kwHOBOLd8c4BBFBV"   # optional; GraphQL Project v2 ID
# =========================
OWNER="${OWNER:-dsainz3}"
REPO="${REPO:-gate-hub}"
PROJECT_ID="${PROJECT_ID:-}"   # leave empty to skip project linking

# List of issues to ensure exist.
# Format per entry: "Title|Body|labels,comma,separated"
ISSUES=(
  "[P0] Recorder Optimization|Optimize recorder include/exclude, DB retention, purge schedule, and index checks for minimal I/O and DB size. Add weekly purge task and compress database on HA restart.|performance,home-assistant,P0"
  "[P0] Logger Optimization|Right-size logging levels/filters; reduce noisy integrations; add rotating logs where applicable and ensure debug scopes are scoped to troubleshooting only.|performance,home-assistant,P0"
  # Example:
  # "[P1] MQTT Monitoring|Create sensors/alerts for MQTT drops and backlog, include HA watchdog automation.|monitoring,home-assistant,P1"
)

# =========================
# ====== PRE-FLIGHT =======
# =========================
require() {
  for c in "$@"; do
    if ! command -v "$c" >/dev/null 2>&1; then
      echo "ERROR: Missing dependency: $c" >&2
      exit 1
    fi
  done
}

echo "== Preflight =="
require gh
if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

# We will *attempt* to use --json/--jq where available, but we also have fallbacks.
if ! gh issue list --help 2>/dev/null | grep -q -- "--jq"; then
  echo "WARN: Your gh may not support --jq; JSON shortcuts will be skipped."
fi

# =========================
# ======= HELPERS =========
# =========================

# Find an existing issue by exact title; prints "number|url" or nothing if not found
find_existing_issue() {
  local title="$1"
  # Prefer JSON (clean and fast) if supported
  if gh issue list --help 2>/dev/null | grep -q -- "--jq"; then
    gh issue list \
      --repo "$OWNER/$REPO" \
      --search "in:title \"$title\"" \
      --json number,title,url \
      --jq '.[] | select(.title == "'"$title"'") | "\(.number)|\(.url)"' \
      || true
  else
    # Fallback: parse human-readable output (less reliable)
    gh issue list --repo "$OWNER/$REPO" --search "in:title \"$title\"" 2>/dev/null \
      | awk -v t="$title" '$0 ~ t {print $1}' \
      | head -n1 \
      | while read -r num; do
          [[ -n "$num" ]] && echo "${num}|https://github.com/${OWNER}/${REPO}/issues/${num}"
        done
  fi
}

# Create an issue; prints "number|url"
create_issue_safe() {
  local title="$1" body="$2" labels_csv="$3"
  local out

  # First try modern JSON path for a clean "number|url" line
  if gh issue create --help 2>/dev/null | grep -q -- "--json"; then
    if out=$(gh issue create \
              --repo "$OWNER/$REPO" \
              --title "$title" \
              --body "$body" \
              --label "$labels_csv" \
              --json number,url \
              --jq '"\(.number)|\(.url)"' 2>/dev/null); then
      if [[ -n "$out" ]]; then
        echo "$out"
        return 0
      fi
    fi
  fi

  # Fallback: create without JSON and parse the URL from stdout
  out=$(gh issue create \
          --repo "$OWNER/$REPO" \
          --title "$title" \
          --body "$body" \
          --label "$labels_csv" 2>&1) || {
    echo "ERROR: gh issue create failed for '$title' : $out" >&2
    return 1
  }

  # Expect a URL like: https://github.com/OWNER/REPO/issues/123
  local issue_url issue_num
  issue_url=$(echo "$out" | grep -o 'https://github.com/[^ ]\+/issues/[0-9]\+' || true)
  issue_num=$(echo "$issue_url" | grep -o '[0-9]\+$' || true)

  if [[ -z "$issue_url" || -z "$issue_num" ]]; then
    echo "ERROR: Could not parse created issue URL/number for '$title'. Output: $out" >&2
    return 1
  fi

  echo "${issue_num}|${issue_url}"
}

# Add an issue to a Project v2 using GraphQL API with PROJECT_ID (non-fatal on failure)
project_add_issue_graphql() {
  local issue_url="$1"
  [[ -z "${PROJECT_ID}" ]] && return 0  # linking is optional

  echo "DEBUG: Linking $issue_url to project (${PROJECT_ID})"

  # Extract numeric issue number from URL
  local num
  num=$(echo "$issue_url" | grep -o '[0-9]\+$' || true)
  if [[ -z "$num" ]]; then
    echo "WARN: Could not extract issue number from URL: $issue_url (skipping link)"
    return 0
  fi

  # Get issue's GraphQL node ID
  local node_id
  if ! node_id=$(gh api graphql -f query='
    query($owner: String!, $repo: String!, $n: Int!) {
      repository(owner: $owner, name: $repo) {
        issue(number: $n) { id }
      }
    }' -f owner="$OWNER" -f repo="$REPO" -f n="$num" --jq '.data.repository.issue.id' 2>&1); then
    echo "WARN: Failed to fetch node ID for $issue_url : $node_id"
    return 0
  fi
  if [[ -z "$node_id" || "$node_id" == "null" ]]; then
    echo "WARN: Empty node ID for $issue_url (skipping link)"
    return 0
  fi

  # Add to project
  local add_out
  if ! add_out=$(gh api graphql -f query='
    mutation($projectId: ID!, $contentId: ID!) {
      addProjectV2ItemById(input: { projectId: $projectId, contentId: $contentId }) {
        item { id }
      }
    }' -f projectId="$PROJECT_ID" -f contentId="$node_id" --jq '.data.addProjectV2ItemById.item.id' 2>&1); then
    echo "WARN: Project link failed for $issue_url : $add_out"
    return 0
  fi

  if [[ -z "$add_out" || "$add_out" == "null" ]]; then
    echo "WARN: Project link returned empty ID for $issue_url"
  else
    echo "OK: Linked to project (${PROJECT_ID})."
  fi
}

# =========================
# ========= MAIN ==========
# =========================
echo "== Creating issues =="

for row in "${ISSUES[@]}"; do
  title="${row%%|*}"
  rest="${row#*|}"
  body="${rest%%|*}"
  labels="${row##*|}"

  existing="$(find_existing_issue "$title")"
  if [[ -n "$existing" ]]; then
    inum="${existing%%|*}"
    iurl="${existing##*|}"
    echo "Exists: $title -> $iurl"
    echo "OK: $title -> $iurl"
    project_add_issue_graphql "$iurl" || true
    continue
  fi

  echo "Creating: $title"
  created="$(create_issue_safe "$title" "$body" "$labels")" || {
    echo "ERROR: Failed to create issue: $title" >&2
    continue
  }
  inum="${created%%|*}"
  iurl="${created##*|}"

  echo "OK: $title -> $iurl"
  project_add_issue_graphql "$iurl" || true
done

echo "== Done =="
