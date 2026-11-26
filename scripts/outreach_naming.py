"""Canonical English labels for outreach names in public generated documents."""

import json
from pathlib import Path

_REGISTRY = json.loads(
    (Path(__file__).resolve().parents[1] / "config/outreach-naming.json").read_text(encoding="utf-8")
)


def outreach_display_title(slug: str, fallback: str) -> str:
    entry = _REGISTRY["outreaches"].get(slug)
    if not entry:
        return fallback
    title = _REGISTRY["series"][entry["series"]]["en"]
    return f'{title} · {entry["location"]}' if entry.get("location") else title
