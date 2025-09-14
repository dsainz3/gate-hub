import os
import shutil
import subprocess
import sys


def run(cmd):
    return subprocess.run(cmd, check=False).returncode


def main():
    repo = os.getcwd()
    if shutil.which("docker"):
        cmd = [
            "docker",
            "run",
            "--rm",
            "-v",
            f"{repo}:/config",
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
