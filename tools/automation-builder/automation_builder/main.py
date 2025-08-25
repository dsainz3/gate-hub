import argparse
import os
import sys
from pathlib import Path
import textwrap

import requests
import yaml


SYSTEM = (
    "You write Home Assistant YAML (automations or blueprints) ONLY.\n"
    "- Output valid YAML only, no markdown fences or prose.\n"
    "- Prefer blueprints with !input selectors when possible.\n"
    "- No secrets; use placeholders/!input for entity_ids.\n"
)


def call_ollama(prompt: str, model: str = "llama3.1") -> str:
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


def strip_fences(txt: str) -> str:
    t = txt.strip()
    if t.startswith("```") and t.endswith("```"):
        # remove ```lang ... ``` fences if present
        t = t.strip("`")
        parts = t.split("\n", 1)
        if len(parts) == 2:
            return parts[1].rstrip()
    return t


def validate_yaml(txt: str) -> None:
    data = yaml.safe_load(txt)
    if not isinstance(data, (dict, list)):
        raise ValueError("YAML must be a mapping or list")


def write_text(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    # Enforce LF and single trailing newline for the hooks
    path.write_text(content.rstrip() + "\n", encoding="utf-8")


def main() -> int:
    ap = argparse.ArgumentParser(
        prog="automation-builder",
        description="Generate Home Assistant YAML from a prompt or a spec file.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent(
            """
            Examples:
              automation-builder --prompt "turn porch lights on at sunset" -o out.yaml
              automation-builder --spec prompts/spec.txt -o packages/generated/porch.yaml
            """
        ),
    )
    ap.add_argument(
        "--prompt",
        help="Direct prompt to send to the model (mutually exclusive with --spec).",
    )
    ap.add_argument(
        "--spec",
        help="Path to a text file that contains the prompt.",
    )
    ap.add_argument(
        "-o",
        "--output",
        required=True,
        help="Output YAML file to write.",
    )
    ap.add_argument(
        "--model",
        default="llama3.1",
        help="Ollama model name (default: %(default)s).",
    )
    args = ap.parse_args()

    if not args.prompt and not args.spec:
        ap.error("you must provide --prompt or --spec")

    try:
        if args.spec:
            prompt = Path(args.spec).read_text(encoding="utf-8")
        else:
            prompt = args.prompt

        raw = call_ollama(prompt, model=args.model)
        raw = strip_fences(raw)
        validate_yaml(raw)
        write_text(Path(args.output), raw)
        print(f"Wrote {args.output}")
        return 0
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
