from pathlib import Path
import shutil
import subprocess
import sys


def run(cmd):
    print("[ha-check] Running:", " ".join(cmd))
    proc = subprocess.run(cmd, check=False)
    return proc.returncode


def main():
    repo = Path.cwd()

    # Ensure /config/secrets.yaml exists for the containerized check
    secrets = repo / "secrets.yaml"
    fakesecrets = repo / "fakesecrets.yaml"
    if not secrets.exists() and fakesecrets.exists():
        print(
            "[ha-check] No secrets.yaml found; copying fakesecrets.yaml for validation…"
        )
        secrets.write_text(
            fakesecrets.read_text(encoding="utf-8"), encoding="utf-8"
        )

    if shutil.which("docker"):
        cmd = [
            "docker",
            "run",
            "--rm",
            "-v",
            f"{str(repo)}:/config",
            "ghcr.io/home-assistant/home-assistant:stable",
            "python",
            "-m",
            "homeassistant",
            "--script",
            "check_config",
            "-c",
            "/config",
        ]
        sys.exit(run(cmd))

    print("hass-config-check: Docker not found; skipping locally (OK).")
    sys.exit(0)


if __name__ == "__main__":
    main()
