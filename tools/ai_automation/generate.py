#!/usr/bin/env python3
import argparse
import os
import re
import sys
import time
import pathlib
import yaml
from textwrap import dedent

try:
    from openai import OpenAI
except ImportError:
    print(
        "Missing openai package; install with `pip install openai`",
        file=sys.stderr,
    )
    sys.exit(2)

SYSTEM_PROMPT = dedent(
    """
    You generate Home Assistant *package* YAML files.
    Output must be **pure YAML only**, no code fences.

    Rules:
    - Top-level must be a HA package mapping (e.g., may include: `automation:`, `script:`, `input_*:` etc.)
    - Prefer a single `automation:` list item unless more are clearly needed.
    - Use existing entities by name (do not invent), or write generic placeholders with clear TODO comments like
      `# TODO: replace with your sensor entity_id`.
    - Be conservative with services; common ones: light.turn_on/off, notify.*, switch.turn_on/off, scene.turn_on, script.turn_on.
    - Use `mode: single` (or `queued` if you must) and add `alias:` for readability.
    - Triggers/conditions/actions must be valid HA schema.
    - Do **not** include secrets or shell_command calling external URLs.
    - Keep it minimal and readable.

    Return only the YAML document.
    """
).strip()

USER_WRAPPER = """Goal: {prompt}

Constraints:
- This will be saved under a Home Assistant *packages* directory (merged into configuration).
- Prefer a single automation unless multiple are obviously required.
- If you use placeholders, mark them with `# TODO`.

Produce a single valid YAML document for a package.
"""


def slugify(s: str) -> str:
    s = s.strip().lower()
    s = re.sub(r"[^a-z0-9\-_.]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s.strip("-") or "automation"


def strip_fences(s: str) -> str:
    s = re.sub(r"^```[a-zA-Z]*\s*", "", s.strip())
    s = re.sub(r"\s*```$", "", s.strip())
    return s.strip()


def ensure_package_mapping(data):
    """Accepts a dict/list; returns a dict package.

    - If dict has 'automation' key, assume it's a package.
    - If list looks like a list of automations, wrap under 'automation'.
    - If dict looks like a single automation (has 'alias' and 'trigger'), wrap into a list under 'automation'.
    """
    if isinstance(data, dict):
        if "automation" in data:
            return data
        if ("alias" in data) and ("trigger" in data) and ("action" in data):
            return {"automation": [data]}
        return data
    if isinstance(data, list):
        return {"automation": data}
    raise ValueError("YAML did not parse into a dict or list.")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--prompt", required=True)
    ap.add_argument("--outdir", default="packages/ai")
    ap.add_argument("--slug", default="ai_automation")
    ap.add_argument("--model", default="gpt-4o-mini")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print("ERROR: OPENAI_API_KEY is not set", file=sys.stderr)
        sys.exit(1)

    client = OpenAI(api_key=api_key)
    user_msg = USER_WRAPPER.format(prompt=args.prompt)

    resp = client.chat.completions.create(
        model=args.model,
        temperature=0.2,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_msg},
        ],
    )

    content = resp.choices[0].message.content or ""
    yaml_txt = strip_fences(content)

    try:
        loaded = yaml.safe_load(yaml_txt)
        if loaded is None:
            raise ValueError("Empty YAML from model")
        package = ensure_package_mapping(loaded)
    except Exception as e:
        print("Model output:", content, file=sys.stderr)
        print(f"ERROR: YAML validation failed: {e}", file=sys.stderr)
        sys.exit(3)

    outdir = pathlib.Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)
    base = slugify(args.slug)
    ts = time.strftime("%Y%m%d-%H%M%S")
    fname = f"{base}.yaml" if args.dry_run else f"{base}-{ts}.yaml"
    outpath = outdir / fname

    with open(outpath, "w", encoding="utf-8") as f:
        yaml.safe_dump(package, f, sort_keys=False, allow_unicode=True)

    print(f"Wrote: {outpath}")
    if args.dry_run:
        print("Dry run complete — no PR will be opened.")
    else:
        print("File ready for PR.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
