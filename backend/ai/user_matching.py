from __future__ import annotations

import math
from typing import Any


def _interest_vector(user: dict[str, Any], keys: list[str]) -> list[float]:
    interests = set(user.get("interests", []))
    return [1.0 if key in interests else 0.0 for key in keys]


def compute_interest_similarity(user_a: dict[str, Any], user_b: dict[str, Any]) -> float:
    keys = sorted(set(user_a.get("interests", [])) | set(user_b.get("interests", [])))
    vector_a = _interest_vector(user_a, keys)
    vector_b = _interest_vector(user_b, keys)
    dot = sum(a * b for a, b in zip(vector_a, vector_b))
    mag_a = math.sqrt(sum(a * a for a in vector_a))
    mag_b = math.sqrt(sum(b * b for b in vector_b))
    return 0.0 if mag_a == 0 or mag_b == 0 else dot / (mag_a * mag_b)


def compute_budget_similarity(user_a: dict[str, Any], user_b: dict[str, Any]) -> float:
    budget_a = float(user_a.get("budget_amount", 70))
    budget_b = float(user_b.get("budget_amount", 70))
    return max(0.0, 1 - abs(budget_a - budget_b) / max(budget_a, budget_b, 1))


def compute_pace_similarity(user_a: dict[str, Any], user_b: dict[str, Any]) -> float:
    return max(0.0, 1 - abs(float(user_a.get("pace", 3)) - float(user_b.get("pace", 3))) / 4)


def compute_matching_score(user_a: dict[str, Any], user_b: dict[str, Any]) -> float:
    interest = compute_interest_similarity(user_a, user_b)
    budget = compute_budget_similarity(user_a, user_b)
    pace = compute_pace_similarity(user_a, user_b)
    companion_bonus = 0.08 if user_a.get("companion_type") == user_b.get("companion_type") else 0.0
    transport_bonus = 0.05 if user_a.get("transport") == user_b.get("transport") else 0.0
    return min(1.0, 0.55 * interest + 0.2 * budget + 0.12 * pace + companion_bonus + transport_bonus)


def find_best_matches(user: dict[str, Any], users: list[dict[str, Any]], top_k: int = 5) -> list[dict[str, Any]]:
    matches = []
    user_interests = set(user.get("interests", []))
    for candidate in users:
        if candidate["id"] == user["id"]:
            continue
        score = compute_matching_score(user, candidate)
        common_interests = sorted(user_interests.intersection(candidate.get("interests", [])))
        reason = "Ca hai co so thich chung"
        if common_interests:
            reason += f" ve {', '.join(common_interests)}"
        reason += ", ngan sach va nhip do di chuyen tuong doi phu hop."
        matches.append(
            {
                "matched_user_id": candidate["id"],
                "name": candidate["name"],
                "matching_score": round(score, 4),
                "common_interests": common_interests,
                "reason": reason,
            }
        )
    return sorted(matches, key=lambda item: item["matching_score"], reverse=True)[:top_k]
