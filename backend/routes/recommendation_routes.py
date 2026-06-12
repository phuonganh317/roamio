from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ai.clustering import assign_cluster
from ai.hybrid_recommender import recommend_places
from utils.data_loader import find_user, load_checkins, load_places, load_users
from utils.schemas import RecommendationRequest

router = APIRouter(prefix="/api", tags=["recommendations"])


@router.get("/places")
def get_places():
    return load_places()


@router.post("/recommendations")
def post_recommendations(payload: RecommendationRequest):
    try:
        user = dict(find_user(payload.user_id))
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    user["current_latitude"] = payload.latitude
    user["current_longitude"] = payload.longitude
    cluster = assign_cluster(user, load_users())
    user["cluster"] = cluster
    return {
        "user_id": user["id"],
        "cluster": cluster,
        "recommendations": recommend_places(user, load_places(), load_checkins(), top_k=payload.top_k),
    }
