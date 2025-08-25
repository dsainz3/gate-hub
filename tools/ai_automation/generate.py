#!/usr/bin/env python3
"""Generate Home Assistant YAML via LLM (OpenAI or Ollama)."""

from __future__ import annotations

import argparse
import os
import re
import sys
from pathlib import Path
from textwrap import dedent
from typing import Optional

import requests
import yaml

SYSTEM = (
    "You write Home Assistant YAML (automations or blueprints) ONLY.\n"
    "- Output valid YAML only, no markdown fences or prose.\n"
    "- Prefer blueprints with !input selectors when possible.\n"
    "- No secrets; use placeholders/!input for entity_ids.\n"
)

USE_OLLAMA = os.getenv("USE_OLLAMA", "true").lower() == "true"
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def _strip_fences(txt: str) -> str:
    t = txt.strip()
    # remove ```lang ... ``` if present
    fence = re.compile(r"^```[a-zA-Z0-9_-]*\n|\n```$", re.MULTILINE)
    return fence.sub("", t).strip()


def _validate_yaml(txt: str) -> None:
    data = yaml.safe_load(txt)
    if not isinstance(data, (dict, list)):
        raise ValueError("YAML must be a mapping or a list at top level")


def _ollama_generate(prompt: str, model: str = "llama3.1") -> str:
    host = os.getenv("OLLAMA_HOST", "http://localhost:11434").rstrip("/")
    resp = requests.post(
        f"{host}/api/generate",
        json={
            "model": model,
            "prompt": f"{SYSTEM}\n\n{prompt}",
            "stream": False,
            "options": {"temperature": 0},
        },
        timeout=600,
    )
    resp.raise_for_status()
    return resp.json().get("response", "").strip()


def _openai_generate(prompt: str, model: str = "gpt-4o-mini") -> str:
    if not OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY not set (and USE_OLLAMA=false)")
    # Import locally so flake8 doesn't flag it if unused
    from openai import OpenAI  # type: ignore

    client = OpenAI(api_key=OPENAI_API_KEY)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": prompt},
        ],
        temperature=0,
    )
    return (resp.choices[0].message.content or "").strip()


def generate_yaml(
    prompt: str,
    use_ollama: bool = USE_OLLAMA,
    model: Optional[str] = None,
) -> str:
    if use_ollama:
        return _ollama_generate(prompt, model or "llama3.1")
    return _openai_generate(prompt, model or "gpt-4o-mini")


def main() -> int:
    parser = argparse.ArgumentParser(
        prog="ai-yaml-generate",
        description="Generate Home Assistant YAML from a natural language prompt.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=dedent(
            """\
            Examples:
              ai-yaml-generate --prompt "turn porch lights on at sunset" -o packages/generated/porch.yaml
              ai-yaml-generate --spec prompts/scene.txt -o packages/generated/scene.yaml
              USE_OLLAMA=false OPENAI_API_KEY=sk-... ai-yaml-generate --prompt "..." -o out.yaml
            """
        ),
    )
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--prompt", help="Prompt text.")
    src.add_argument("--spec", help="Path to a file that contains the prompt.")
    parser.add_argument(
        "-o",
        "--output",
        required=True,
        help="Where to write the YAML file (will be created/overwritten).",
    )
    parser.add_argument(
        "--model",
        help="Model name (ollama: e.g. llama3.1, openai: e.g. gpt-4o-mini).",
    )
    parser.add_argument(
        "--no-validate",
        action="store_true",
        help="Skip YAML validation (not recommended).",
    )
    args = parser.parse_args()

    try:
        if args.spec:
            prompt = Path(args.spec).read_text(encoding="utf-8")
        else:
            prompt = args.prompt or ""

        raw = generate_yaml(prompt, use_ollama=USE_OLLAMA, model=args.model)
        raw = _strip_fences(raw)

        if not args.no_validate:
            _validate_yaml(raw)

        out = Path(args.output)
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(raw.rstrip() + "\n", encoding="utf-8")
        print(f"Wrote {out}", file=sys.stderr)
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
