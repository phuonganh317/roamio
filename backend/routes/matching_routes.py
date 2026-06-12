from __future__ import annotations

from fastapi import APIRouter, HTTPException

from ai.user_matching import find_best_matches
from utils.data_loader import find_user, load_users
from utils.schemas import MatchRequest

router = APIRouter(prefix="/api", tags=["matches"])


@router.post("/matches")
def post_matches(payload: MatchRequest):
    try:
        user = find_user(payload.user_id)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
    return {"user_id": user["id"], "matches": find_best_matches(user, load_users(), top_k=payload.top_k)}
