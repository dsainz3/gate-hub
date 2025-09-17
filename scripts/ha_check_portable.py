"""Portable Home Assistant config check used by pre-commit and CI.

Creates a temporary secrets file when needed and shells out to Docker to run
`homeassistant --script check_config`. Falls back to a no-op when Docker is
missing so local development still passes.
"""

import shutil
import subprocess
import sys
from pathlib import Path

DEFAULT_SECRETS = """# Generated dummy secrets for CI
dummy_key: 'placeholder'
mqtt_user: 'mqtt'
mqtt_password: 'password'
govee_email: 'govee@email.'
govee_password: 'password'
govee_api_key: 'ab842a4e-74c2-4e61-b418-9c809568388f'
wunderground_api_key: '3e9b7a1c004245de9b10cfe21a9d33b7'
wunderground_station_id: 'KNEOMA19'
cfbd_bearer: 'Bearer svnMzyRM4cuG7qOQj5K8iM7Q3mWJkx66h9vKpOY4Htt3DKLi4UTeKJuXAcP03XAW'
home_latitude: 40.0000
home_longitude: -96.0000
home_elevation: 360
home_timezone: America/Chicago
github_pat: 'Bearer token'
"""


def run(cmd):
    print("[ha-check] Running:", " ".join(cmd))
    proc = subprocess.run(cmd, check=False)
    return proc.returncode


def main():
    repo = Path.cwd()

    # Ensure /config/secrets.yaml exists for the containerized check
    secrets = repo / "secrets.yaml"
    fakesecrets = repo / "fakesecrets.yaml"
    created = False
    if not secrets.exists():
        if fakesecrets.exists():
            print(
                "[ha-check] No secrets.yaml found; copying fakesecrets.yaml for validation…",
            )
            secrets.write_text(
                fakesecrets.read_text(encoding="utf-8"), encoding="utf-8"
            )
        else:
            print(
                "[ha-check] No secrets.yaml found; writing default fake secrets for validation…",
            )
            secrets.write_text(DEFAULT_SECRETS, encoding="utf-8")
        created = True

    if shutil.which("docker"):
        cmd = [
            "docker",
            "run",
            "--rm",
            "-v",
            f"{repo!s}:/config",
            "ghcr.io/home-assistant/home-assistant:stable",
            "python",
            "-m",
            "homeassistant",
            "--script",
            "check_config",
            "-c",
            "/config",
        ]
        rc = run(cmd)
        if created and secrets.exists():
            secrets.unlink()
        sys.exit(rc)

    print("hass-config-check: Docker not found; skipping locally (OK).")
    if created and secrets.exists():
        secrets.unlink()
    sys.exit(0)


if __name__ == "__main__":
    main()
