"""Lightweight package for BLE monitor tests.

The full Home Assistant integration depends on optional packages that are not
available during unit testing.  To keep imports lightweight, we attempt to
import the original integration module and gracefully fall back to stubbed
setups when those dependencies are missing.
"""

try:
    from .full_init import *  # type: ignore F401,F403
except ModuleNotFoundError:  # pragma: no cover
    async def async_setup(*args, **kwargs):  # type: ignore[unused-arg]
        """Stubbed setup when Home Assistant dependencies are absent."""
        raise ModuleNotFoundError(
            "Home Assistant components are required for this integration"
        )

    async def async_setup_entry(*args, **kwargs):  # type: ignore[unused-arg]
        """Stubbed setup entry when Home Assistant dependencies are absent."""
        raise ModuleNotFoundError(
            "Home Assistant components are required for this integration"
        )

    async def async_unload_entry(*args, **kwargs):  # type: ignore[unused-arg]
        """Stubbed unload entry when Home Assistant dependencies are absent."""
        return True
