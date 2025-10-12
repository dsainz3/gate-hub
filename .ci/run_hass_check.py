# .ci/run_hass_check.py
import contextlib
import importlib.util
import os
import platform
import shutil
import subprocess
import sys
from pathlib import Path
from shutil import which

_HA_PACKAGE = os.environ.get("HA_CHECK_PACKAGE", "homeassistant")


def _ensure_homeassistant() -> bool:
    """Install Home Assistant locally when the module is missing."""

    if _module_available("homeassistant"):
        return True

    print("[ha-check] Installing Home Assistant Python package…", flush=True)
    try:
        subprocess.check_call(
            [sys.executable, "-m", "pip", "install", _HA_PACKAGE]
        )
    except subprocess.CalledProcessError:
        print(
            "[ha-check] Failed to install Home Assistant via pip; falling back to Docker.",
            flush=True,
        )
        return False

    return _module_available("homeassistant")


repo = Path.cwd().resolve()
fake = repo / ".ci" / "fakesecrets.yaml"
real = repo / "secrets.yaml"


def _module_available(name: str) -> bool:
    return importlib.util.find_spec(name) is not None


def run_local_py() -> None:
    # Reuses the current interpreter where the Home Assistant package is available
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
    ]
    subprocess.check_call(cmd, cwd=repo)


def run_via_docker() -> None:
    # Prefer using the running Supervisor container when inside HA OS.
    if Path("/.dockerenv").exists() and Path("/config").resolve() == repo:
        cmd = [
            "docker",
            "exec",
            "homeassistant",
            "python",
            "-m",
            "homeassistant",
            "--script",
            "check_config",
            "--config",
            "/config",
            "--info",
            "all",
            "--files",
        ]
    else:
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
    ]
    subprocess.check_call(cmd)


# --- main ---
created_secrets = False
if not real.exists():
    shutil.copyfile(fake, real)
    created_secrets = True

try:
    system = platform.system().lower()
    if system.startswith("win"):
        if _ensure_homeassistant():
            run_local_py()
        elif which("docker"):
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
        if _ensure_homeassistant():
            run_local_py()
        elif which("docker"):
            run_via_docker()
        else:
            raise SystemExit(
                "Home Assistant Python package not available and Docker not found. "
                "Install the package (e.g. `python3 -m pip install homeassistant`) or "
                "install Docker to run the config check."
            )
finally:
    if created_secrets:
        with contextlib.suppress(FileNotFoundError):
            real.unlink()
