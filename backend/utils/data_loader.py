from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

DATA_DIR = Path(__file__).resolve().parents[1] / "data"


def load_json(filename: str) -> list[dict[str, Any]]:
    path = DATA_DIR / filename
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


@lru_cache(maxsize=1)
def load_users() -> list[dict[str, Any]]:
    return load_json("sample_users.json")


@lru_cache(maxsize=1)
def load_places() -> list[dict[str, Any]]:
    return load_json("sample_places.json")


@lru_cache(maxsize=1)
def load_checkins() -> list[dict[str, Any]]:
    return load_json("sample_checkins.json")


def find_user(user_id: str) -> dict[str, Any]:
    for user in load_users():
        if user["id"] == user_id:
            return user
    raise ValueError(f"Unknown user_id: {user_id}")
