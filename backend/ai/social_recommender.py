from __future__ import annotations

from collections import defaultdict
from typing import Any


def build_user_history(checkins: list[dict[str, Any]]) -> dict[str, set[str]]:
    history: dict[str, set[str]] = defaultdict(set)
    for checkin in checkins:
        history[checkin["user_id"]].add(checkin["place_id"])
    return dict(history)


def jaccard_similarity(set_a: set[str], set_b: set[str]) -> float:
    union = set_a | set_b
    if not union:
        return 0.0
    return len(set_a & set_b) / len(union)


def find_similar_users(user_id: str, user_history: dict[str, set[str]], top_k: int = 5) -> list[tuple[str, float]]:
    target_history = user_history.get(user_id, set())
    scored_users = [
        (candidate_id, jaccard_similarity(target_history, history))
        for candidate_id, history in user_history.items()
        if candidate_id != user_id
    ]
    return sorted(scored_users, key=lambda item: item[1], reverse=True)[:top_k]


def compute_social_score(user_id: str, place_id: str, user_history: dict[str, set[str]]) -> float:
    similar_users = find_similar_users(user_id, user_history, top_k=5)
    if not similar_users:
        return 0.0
    weighted_hits = sum(score for candidate_id, score in similar_users if place_id in user_history.get(candidate_id, set()))
    total_weight = sum(score for _, score in similar_users)
    return 0.0 if total_weight == 0 else weighted_hits / total_weight
