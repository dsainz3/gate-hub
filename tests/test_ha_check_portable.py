"""Tests for scripts.ha_check_portable."""

from pathlib import Path

import pytest

import scripts.ha_check_portable as ha_check_portable


@pytest.fixture(autouse=True)
def _reset_default_secrets(monkeypatch):
    # Ensure each test can tweak the default without affecting others.
    monkeypatch.setattr(
        ha_check_portable,
        "DEFAULT_SECRETS",
        "placeholder-secret\n",
        raising=False,
    )


def test_main_creates_and_cleans_default_secrets(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(ha_check_portable.shutil, "which", lambda _: None)

    captured = {}
    original_unlink = Path.unlink

    def spy_unlink(self, *args, **kwargs):
        captured["content"] = self.read_text(encoding="utf-8")
        return original_unlink(self, *args, **kwargs)

    monkeypatch.setattr(Path, "unlink", spy_unlink)

    with pytest.raises(SystemExit) as exc:
        ha_check_portable.main()

    assert exc.value.code == 0
    assert captured["content"] == "placeholder-secret\n"
    assert not (tmp_path / "secrets.yaml").exists()


def test_main_uses_existing_fakesecrets(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    (tmp_path / "fakesecrets.yaml").write_text(
        "override-secret\n", encoding="utf-8"
    )
    monkeypatch.setattr(ha_check_portable.shutil, "which", lambda _: None)

    captured = {}
    original_unlink = Path.unlink

    def spy_unlink(self, *args, **kwargs):
        captured["content"] = self.read_text(encoding="utf-8")
        return original_unlink(self, *args, **kwargs)

    monkeypatch.setattr(Path, "unlink", spy_unlink)

    with pytest.raises(SystemExit) as exc:
        ha_check_portable.main()

    assert exc.value.code == 0
    assert captured["content"] == "override-secret\n"
    assert not (tmp_path / "secrets.yaml").exists()


def test_main_invokes_docker_when_available(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(ha_check_portable.shutil, "which", lambda _: "docker")

    recorded = {}

    def fake_run(cmd):
        recorded["cmd"] = cmd
        return 42

    monkeypatch.setattr(ha_check_portable, "run", fake_run)

    original_unlink = Path.unlink

    def spy_unlink(self, *args, **kwargs):
        recorded["unlinked"] = True
        return original_unlink(self, *args, **kwargs)

    monkeypatch.setattr(Path, "unlink", spy_unlink)

    with pytest.raises(SystemExit) as exc:
        ha_check_portable.main()

    assert exc.value.code == 42
    assert recorded["cmd"][:4] == ["docker", "run", "--rm", "-v"]
    assert recorded["cmd"][4].endswith(":/config")
    assert recorded["unlinked"] is True
