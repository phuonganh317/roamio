from __future__ import annotations

import os
from typing import Any

os.environ.setdefault("LOKY_MAX_CPU_COUNT", "2")

from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

CLUSTER_NAMES = ["Budget Explorer", "Food & Culture Lover", "Luxury Relaxer", "Weekend Traveler"]
INTERESTS = ["food", "culture", "nature", "shopping", "nightlife", "photo", "history", "local", "wellness"]
TRAVEL_STYLES = ["explorer", "food_culture", "culture", "relax", "night_market", "luxury_relax", "weekend"]
COMPANIONS = ["solo", "friends", "family", "couple"]
TRANSPORTS = ["walk", "train", "taxi", "bike"]


def _one_hot(value: str, options: list[str]) -> list[float]:
    return [1.0 if value == option else 0.0 for option in options]


def _budget_number(user: dict[str, Any]) -> float:
    if "budget_amount" in user:
        return float(user["budget_amount"])
    return {"low": 35.0, "medium": 70.0, "high": 140.0}.get(user.get("budget_level"), 70.0)


def build_user_feature_vector(user: dict[str, Any]) -> list[float]:
    interests = set(user.get("interests", []))
    return [
        _budget_number(user) / 160,
        float(user.get("travel_days", 3)) / 7,
        float(user.get("pace", 3)) / 5,
        float(user.get("outdoor_level", 5)) / 10,
        float(user.get("hidden_gem_preference", 5)) / 10,
        float(user.get("safety_priority", 5)) / 10,
        float(user.get("checkin_count", 0)) / 30,
        float(user.get("avg_hour", 12)) / 24,
        float(user.get("weekend_ratio", 0.5)),
        float(user.get("category_diversity", 0.5)),
        *_one_hot(user.get("travel_style", ""), TRAVEL_STYLES),
        *_one_hot(user.get("companion_type", ""), COMPANIONS),
        *_one_hot(user.get("transport", ""), TRANSPORTS),
        *[1.0 if interest in interests else 0.0 for interest in INTERESTS],
    ]


def train_user_clusters(users: list[dict[str, Any]]) -> tuple[KMeans, StandardScaler]:
    vectors = [build_user_feature_vector(user) for user in users]
    scaler = StandardScaler()
    scaled_vectors = scaler.fit_transform(vectors)
    model = KMeans(n_clusters=4, random_state=42, n_init=10)
    model.fit(scaled_vectors)
    return model, scaler


def _name_cluster(user: dict[str, Any]) -> str:
    interests = set(user.get("interests", []))
    budget = _budget_number(user)
    if budget >= 110:
        return "Luxury Relaxer"
    if "food" in interests and ("culture" in interests or "history" in interests):
        return "Food & Culture Lover"
    if user.get("travel_days", 3) <= 2 or user.get("travel_style") == "weekend":
        return "Weekend Traveler"
    return "Budget Explorer"


def assign_cluster(user: dict[str, Any], users: list[dict[str, Any]] | None = None) -> str:
    # The K-Means model is trained for the demo; the human-readable label is derived
    # from profile traits so the presentation remains stable and easy to explain.
    if users and len(users) >= 4:
        model, scaler = train_user_clusters(users)
        model.predict(scaler.transform([build_user_feature_vector(user)]))[0]
    return _name_cluster(user)
