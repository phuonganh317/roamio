from __future__ import annotations

from typing import Any

from sklearn.linear_model import LogisticRegression

from .clustering import assign_cluster

CLUSTER_CATEGORY_FIT = {
    "Budget Explorer": {"local", "nature", "food", "culture"},
    "Food & Culture Lover": {"food", "culture", "local"},
    "Luxury Relaxer": {"shopping", "nature", "culture"},
    "Weekend Traveler": {"nature", "local", "shopping", "food"},
}


def _distance_score(distance_km: float) -> float:
    return max(0.0, min(1.0, 1 / (1 + distance_km / 3)))


def _budget_score(user: dict[str, Any], place: dict[str, Any]) -> float:
    budget = float(user.get("budget_amount", 70))
    cost = float(place.get("average_cost", 30))
    if cost <= budget:
        return 1.0
    return max(0.0, 1 - (cost - budget) / max(budget, 1))


def build_recommendation_features(user: dict[str, Any], place: dict[str, Any]) -> list[float]:
    interests = set(user.get("interests", []))
    tags = set(place.get("tags", []))
    category = place.get("category", "")
    cluster = user.get("cluster") or assign_cluster(user)
    type_match = 1.0 if category in interests or tags.intersection(interests) else 0.0
    cluster_score = 1.0 if category in CLUSTER_CATEGORY_FIT.get(cluster, set()) else 0.35
    rating_score = float(place.get("rating", 0)) / 5
    return [
        _distance_score(float(place.get("distance_km", 3))),
        type_match,
        _budget_score(user, place),
        cluster_score,
        rating_score,
    ]


def train_logistic_model(training_data: list[tuple[list[float], int]]) -> LogisticRegression:
    features = [row[0] for row in training_data]
    labels = [row[1] for row in training_data]
    model = LogisticRegression(random_state=42)
    model.fit(features, labels)
    return model


def synthetic_training_data(users: list[dict[str, Any]], places: list[dict[str, Any]]) -> list[tuple[list[float], int]]:
    rows: list[tuple[list[float], int]] = []
    for user in users:
        user = dict(user)
        user["cluster"] = assign_cluster(user)
        for place in places:
            demo_place = dict(place)
            demo_place["distance_km"] = 2.0
            features = build_recommendation_features(user, demo_place)
            liked = int(features[1] == 1.0 and features[2] >= 0.7 and features[4] >= 0.86)
            rows.append((features, liked))
    return rows


def predict_personal_score(user: dict[str, Any], place: dict[str, Any], model: LogisticRegression | None = None) -> float:
    if model is None:
        # Fallback keeps the function usable in notebooks or isolated imports.
        features = build_recommendation_features(user, place)
        return round(0.35 * features[0] + 0.25 * features[1] + 0.2 * features[2] + 0.1 * features[3] + 0.1 * features[4], 4)
    return float(model.predict_proba([build_recommendation_features(user, place)])[0][1])
