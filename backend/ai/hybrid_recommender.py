from __future__ import annotations

from typing import Any

from .clustering import assign_cluster
from .personal_recommender import (
    CLUSTER_CATEGORY_FIT,
    build_recommendation_features,
    predict_personal_score,
    synthetic_training_data,
    train_logistic_model,
)
from .social_recommender import build_user_history, compute_social_score
from .spatial_search import find_nearby_places


def _distance_score(distance_km: float) -> float:
    return max(0.0, min(1.0, 1 / (1 + distance_km / 3)))


def _cluster_score(user: dict[str, Any], place: dict[str, Any]) -> float:
    cluster = user.get("cluster") or assign_cluster(user)
    return 1.0 if place.get("category") in CLUSTER_CATEGORY_FIT.get(cluster, set()) else 0.35


def explain_recommendation(user: dict[str, Any], place: dict[str, Any], scores: dict[str, float]) -> str:
    cluster = user.get("cluster") or assign_cluster(user)
    interests = set(user.get("interests", []))
    matched_tags = sorted(interests.intersection(place.get("tags", [])))
    reason_bits = []
    if place.get("distance_km", 99) <= 3:
        reason_bits.append("gan vi tri hien tai")
    if matched_tags:
        reason_bits.append(f"khop so thich {', '.join(matched_tags)}")
    if scores["social_score"] > 0:
        reason_bits.append("duoc nhom user tuong tu check-in")
    if scores["cluster_score"] >= 0.8:
        reason_bits.append(f"phu hop nhom {cluster}")
    return "Phu hop vi " + ", ".join(reason_bits[:3]) + "."


def recommend_places(
    user: dict[str, Any],
    places: list[dict[str, Any]],
    checkins: list[dict[str, Any]],
    top_k: int = 5,
) -> list[dict[str, Any]]:
    user = dict(user)
    user["cluster"] = assign_cluster(user)
    user_location = (float(user["current_latitude"]), float(user["current_longitude"]))
    candidates = find_nearby_places(user_location, places, k=min(20, len(places)))
    model = train_logistic_model(synthetic_training_data([user], candidates))
    user_history = build_user_history(checkins)

    recommendations = []
    for place in candidates:
        personal_score = predict_personal_score(user, place, model)
        cluster_score = _cluster_score(user, place)
        social_score = compute_social_score(user["id"], place["id"], user_history)
        distance_score = _distance_score(float(place["distance_km"]))
        final_score = personal_score * 0.5 + cluster_score * 0.2 + social_score * 0.2 + distance_score * 0.1
        scores = {
            "personal_score": round(personal_score, 4),
            "cluster_score": round(cluster_score, 4),
            "social_score": round(social_score, 4),
            "distance_score": round(distance_score, 4),
        }
        recommendations.append(
            {
                "place_id": place["id"],
                "place_name": place["name"],
                "category": place["category"],
                "distance_km": round(float(place["distance_km"]), 2),
                "final_score": round(final_score, 4),
                **scores,
                "short_reason": explain_recommendation(user, place, scores),
                "feature_vector": [round(value, 3) for value in build_recommendation_features(user, place)],
            }
        )

    return sorted(recommendations, key=lambda item: item["final_score"], reverse=True)[:top_k]
