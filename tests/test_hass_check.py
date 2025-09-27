"""Tests for scripts.hass_check."""

import pytest

import scripts.hass_check as hass_check


def test_main_invokes_docker_when_available(monkeypatch, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(hass_check.shutil, "which", lambda _: "docker")

    recorded = {}

    def fake_run(cmd):
        recorded["cmd"] = cmd
        return 3

    monkeypatch.setattr(hass_check, "run", fake_run)

    with pytest.raises(SystemExit) as exc:
        hass_check.main()

    assert exc.value.code == 3
    assert recorded["cmd"][:4] == ["docker", "run", "--rm", "-v"]
    assert recorded["cmd"][4].endswith(":/config")


def test_main_skips_when_docker_missing(monkeypatch, capsys, tmp_path):
    monkeypatch.chdir(tmp_path)
    monkeypatch.setattr(hass_check.shutil, "which", lambda _: None)

    with pytest.raises(SystemExit) as exc:
        hass_check.main()

    assert exc.value.code == 0
    captured = capsys.readouterr()
    assert "Docker not found" in captured.out
