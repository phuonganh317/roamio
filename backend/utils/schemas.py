from __future__ import annotations

from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    user_id: str = "u001"
    latitude: float = 35.6618
    longitude: float = 139.7041
    top_k: int = Field(default=5, ge=1, le=20)


class MatchRequest(BaseModel):
    user_id: str = "u001"
    top_k: int = Field(default=5, ge=1, le=20)
