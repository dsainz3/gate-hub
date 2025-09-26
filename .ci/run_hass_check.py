# .ci/run_hass_check.py
import contextlib
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from shutil import which

repo = Path(__file__).resolve().parents[1]
fake = repo / ".ci" / "fakesecrets.yaml"
real = repo / "secrets.yaml"


def run_local_py() -> None:
    # Runs in pre-commit's venv where 'homeassistant' is installed via additional_dependencies
    cmd = [
        sys.executable,
        "-m",
        "homeassistant",
        "--script",
        "check_config",
        "--config",
        ".",
        "--info",
        "all",
        "--files",
        "--secrets",
        "secrets.yaml",
    ]
    subprocess.check_call(cmd, cwd=repo)


def run_via_docker() -> None:
    # Requires Docker Desktop on Windows; daemon must be running and drive shared.
    cmd = [
        "docker",
        "run",
        "--rm",
        "-v",
        f"{repo}:/workdir",
        "-w",
        "/workdir",
        "ghcr.io/home-assistant/home-assistant:stable",
        "python",
        "-m",
        "homeassistant",
        "--script",
        "check_config",
        "--config",
        "/workdir",
        "--info",
        "all",
        "--files",
        "--secrets",
        "/workdir/secrets.yaml",
    ]
    subprocess.check_call(cmd)


def run_via_wsl() -> None:
    # Fallback if Docker not available. Assumes HA is installed in default WSL distro.
    repo_windows = str(repo).replace("\\", "\\\\")
    wsl_repo = subprocess.check_output(
        ["wsl", "wslpath", "-a", repo_windows], text=True
    ).strip()
    cmd = [
        "wsl",
        "python3",
        "-m",
        "homeassistant",
        "--script",
        "check_config",
        "--config",
        wsl_repo,
        "--info",
        "all",
        "--files",
        "--secrets",
        f"{wsl_repo}/secrets.yaml",
    ]
    subprocess.check_call(cmd)


# --- main ---
shutil.copyfile(fake, real)
try:
    system = platform.system().lower()
    if system.startswith("win"):
        if which("docker"):
            run_via_docker()
        elif which("wsl"):
            # sanity check: is HA available in WSL?
            try:
                subprocess.check_call(
                    [
                        "wsl",
                        "python3",
                        "-c",
                        "import importlib; importlib.import_module('homeassistant')",
                    ],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
            except subprocess.CalledProcessError as err:
                raise SystemExit(
                    "Home Assistant not found in WSL. "
                    "Install it in your WSL distro (e.g. `python3 -m pip install homeassistant`) "
                    "or install Docker Desktop (recommended)."
                ) from err
            run_via_wsl()
        else:
            raise SystemExit(
                "Neither Docker nor WSL detected on Windows. "
                "Install Docker Desktop (preferred) or enable WSL."
            )
    else:
        # Linux/macOS
        run_local_py()
finally:
    with contextlib.suppress(FileNotFoundError):
        real.unlink()
