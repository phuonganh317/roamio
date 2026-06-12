from __future__ import annotations

from fastapi import APIRouter

from utils.data_loader import load_users

router = APIRouter(prefix="/api", tags=["users"])


@router.get("/users")
def get_users():
    return load_users()
