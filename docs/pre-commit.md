Hypermodern Pre-Commit Training (for this Home Assistant repo)

Goal: make every commit “production-ready” before it hits CI, while teaching contributors the why and how behind our guardrails.

0) Learning outcomes

By the end you’ll be able to:

Explain why local pre-commit gates are essential (“shift-left” validation).

Run, interpret, and fix our pre-commit checks in seconds.

Know which files each hook touches (and which it deliberately doesn’t).

Adjust rules safely for Home Assistant (HA) specifics and cross-platform dev.

1) Why pre-commit at all?

Shift-left: Catch format/config mistakes before you push.

Speed: Instant feedback vs waiting on CI.

Consistency: One toolchain; same rules on Windows/macOS/Linux.

Safety: Our HA config gets validated locally (or in CI if you’re on Windows).

Result: smaller diffs, fewer reviews on nits, merges that just work.

2) What runs here (and why)

Below is the intent of each hook we run and why we chose it. We purposely avoid running generic parsers on HA-specific YAML that uses custom tags like !include/!input.

A. Prettier (YAML only)

Purpose: Consistent formatting (indentation, lists, quoting keys with colons like name: "Scene: Cream Theater").

Why: Clean diffs; no style debates.

Behavior: If it changes a file, the hook fails so you can stage the fix.

B. Core hygiene

mixed-line-ending: normalizes CRLF/CR → LF (cross-platform sanity).

end-of-file-fixer: ensures a single trailing newline.

trailing-whitespace: trims accidental spaces.

Why: Prevents noisy diffs and merge conflicts (especially on Windows).

C. check-yaml (generic syntax check)

What: Validates YAML structure with a generic loader.

Exclusions: HA/Vendor files that use custom tags: configuration.yaml, ui-lovelace/**, blueprints/**, custom_components/**/services.yaml, zigbee2mqtt/**, etc.

Why: Catch real YAML typos without false-failing on HA’s custom tags.

D. yamllint (style, tuned for HA)

What: Gentle style rules (line length relaxed to 140, HA-unfriendly rules disabled).

Why: Enforces readability without fighting Lovelace/blueprints.

E. Black (Python formatter)

What: Opinionated formatting for our Python (scripts/tools/custom code).

Why: Predictable diffs; no style bikeshedding.

Scope: Excludes vendor integrations to avoid churn.

F. Flake8 (+ bugbear, builtins)

What: Lints Python for sharp edges (unused imports, risky patterns).

Why: Finds issues Black can’t (logic smells).

Scope: Again, excludes vendor directories.

G. Home Assistant config check (portable)

What: Runs homeassistant --script check_config via Docker when available. On Windows (no Docker), it prints a friendly note and passes.

Why: Reality check that the repo actually boots in HA. CI still runs the real check.

3) How to use it (daily flow)

Install once

pre-commit install


Run across repo (first day / before PR)

pre-commit run --all-files
# If anything was auto-fixed:
git add -A && pre-commit run --all-files


Normal commits

git add -A
git commit -m "feat: your change"
# hooks run automatically


Update hooks occasionally

pre-commit autoupdate
git add .pre-commit-config.yaml
git commit -m "chore(pre-commit): autoupdate hooks"

4) Editor & Git setup (cross-platform)

Add/keep a .gitattributes like:

*      text=auto eol=lf
*.yaml text eol=lf
*.yml  text eol=lf
*.sh   text eol=lf


Then renormalize once:

git add --renormalize .
git commit -m "chore: enforce LF endings"


VS Code tips

// .vscode/settings.json (optional)
{
  "files.eol": "\n",
  "[yaml]": { "editor.formatOnSave": true }
}

5) What should be checked (and not)
Area	Checked by	Included	Excluded (why)
YAML format	Prettier	All YAML	None (Prettier understands YAML; safe everywhere)
YAML syntax	check-yaml	Generic YAML	HA files with !include/!input (generic parser can’t handle)
YAML style	yamllint	Most YAML	Rules tuned to avoid HA conflicts
Newlines/trailing space	hygiene hooks	All	None
Python format	Black	Our scripts/tooling	Vendor integrations (don’t reformat upstream code)
Python lint	Flake8	Our scripts/tooling	Vendor integrations
HA validity	HA config check	Whole config	Portable mode skips heavy run on Windows; real check in CI

Design principle: Validate everything we own; skip vendor/HA-special bits where a generic tool would lie.

6) Common fixes (copy-paste friendly)

Prettier modified files

git add -A && pre-commit run --all-files


“wrong new line character: expected \n” (Windows)

Ensure .gitattributes (above), then:

git add --renormalize .
git commit -m "chore: normalize line endings"


In VS Code, switch the status-bar to LF.

“could not determine a constructor for the tag !include/!input”

Add an exclude: for that path under check-yaml in .pre-commit-config.yaml (HA will still be validated by the HA config hook/CI).

Names with colons in Lovelace

Quote them: name: "Scene: Cream Theater".

7) Quick labs (10 minutes)

Lab A — Prettier in action
Break a Lovelace YAML (add a colon in a key without quotes). Run pre-commit run --all-files. Observe that Prettier fixes and fails; stage changes, re-run.

Lab B — YAML parser vs HA
Point check-yaml at a blueprint using !input. Watch it complain. Add an exclude: for that path. Re-run—green.

Lab C — Windows CRLF
Switch a file to CRLF. Run hooks; note the yamllint error. Fix with .gitattributes + renormalize; re-run—green.

8) Advanced: tailoring the gate

Tighten or relax yamllint rules in .yamllint.yml (we default to HA-friendly).

Add focused hooks (e.g., markdownlint for docs, shellcheck for scripts, hadolint for Dockerfiles).

Limit Python hooks to your subpackages with files: to keep runs fast.

9) Troubleshooting cheatsheet
Symptom	Likely cause	Quick fix
“Files were modified by this hook”	Auto-fix changed files	git add -A && pre-commit run --all-files
“wrong new line character: expected \n”	CRLF	.gitattributes + renormalize; VS Code → LF
“No files matching the given patterns were found” (Prettier)	Nothing to format this pass	Harmless; continue
“could not determine constructor for !include/!input”	Generic parser on HA YAML	Exclude file from check-yaml
HA config hook fails on Windows	No Docker/bash	That hook is portable; rely on CI or install Docker locally
10) One-liners you’ll use a lot
# Run everything on the repo
pre-commit run --all-files

# Stage all auto-fixes and re-run
git add -A && pre-commit run --all-files

# Update hook versions
pre-commit autoupdate && git add .pre-commit-config.yaml && git commit -m "chore: autoupdate hooks"

# Temporarily skip selected hooks (rarely needed)
SKIP=prettier,yamllint pre-commit run --all-files

Closing note

This repo doubles as a training environment. The hooks don’t just block mistakes—they teach the habits that make HA projects boring-to-maintain (the highest compliment). Keep the gate tight, the feedback fast, and your future self will thank you.
