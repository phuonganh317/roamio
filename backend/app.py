from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.matching_routes import router as matching_router
from routes.recommendation_routes import router as recommendation_router
from routes.user_routes import router as user_router

app = FastAPI(title="ROAMIO AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(recommendation_router)
app.include_router(matching_router)


@app.get("/")
def read_root():
    return {
        "name": "ROAMIO",
        "description": "AI Travel Companion demo for personalized place recommendations and travel companion matching.",
        "ai_flow": [
            "K-Means user clustering",
            "BallTree + Haversine nearby filtering",
            "Logistic Regression personal score",
            "Jaccard social score",
            "Hybrid final ranking",
        ],
    }


@app.get("/api/explain")
def explain_ai():
    return {
        "k_means": "Phan nhom user theo budget, so thich, pace, transport va hanh vi check-in.",
        "balltree_haversine": "Tim cac dia diem gan toa do hien tai bang khoang cach dia ly tren mat cau.",
        "logistic_regression": "Du doan xac suat user thich mot dia diem tu distance, type, budget, cluster va rating.",
        "jaccard": "So sanh lich su check-in de tim user co hanh vi giong nhau.",
        "hybrid_scoring": "Ket hop personal, cluster, social va distance score de xep hang Top-K.",
        "user_matching": "Dung cosine similarity, budget similarity va pace similarity de goi y ban dong hanh.",
    }
