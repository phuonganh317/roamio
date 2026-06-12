# ROAMIO

ROAMIO is an AI Travel Companion demo. The app helps a traveler discover nearby places, rank them by personal fit, and find compatible travel companions. The current frontend is a Next.js app in `roamio-ui`; the new Python backend in `backend` contains the AI modules, sample data, API routes, and terminal demo script.

## Problem

Travelers often face too much scattered information, weak personalization, unclear budget fit, and difficulty finding people with similar travel styles. ROAMIO turns a user profile, current location, sample places, and check-in history into ranked recommendations that are easy to explain in a presentation.

## Main Features

- User clustering with K-Means.
- Nearby place filtering with BallTree + Haversine distance.
- Personal place scoring with Logistic Regression.
- Social scoring with Jaccard Similarity over check-in history.
- Hybrid final ranking with Personal, Cluster, Social, and Distance scores.
- User matching with cosine interest similarity, budget similarity, and pace similarity.
- Next.js frontend demo with map, preference form, Top 5 recommendations, companion matches, and AI explanation.

## Architecture

```text
roamio/
  backend/
    app.py
    demo_run.py
    routes/
    ai/
    data/
    utils/
  roamio-ui/
    src/app/
    src/components/
    src/services/
    src/types/
    src/lib/
  map.html
  PRESENTATION_NOTES.md
  README.md
```

## AI Data Flow

```text
User Profile
  -> K-Means Cluster
  -> BallTree Candidate Filtering
  -> Logistic Regression Personal Score
  -> Jaccard Social Score
  -> Hybrid Final Score
  -> Top-K Places + Explanation
```

## Algorithm Notes

- **K-Means** groups users into readable segments such as Budget Explorer, Food & Culture Lover, Luxury Relaxer, and Weekend Traveler.
- **Haversine** computes distance between latitude/longitude points on Earth.
- **BallTree** quickly finds the nearest candidate places using the Haversine metric.
- **Logistic Regression** predicts the probability that a user will like a place from distance, type match, budget match, cluster fit, and rating.
- **Jaccard Similarity** compares check-in sets: `|A intersection B| / |A union B|`.
- **Hybrid Scoring** ranks places with `personal * 0.5 + cluster * 0.2 + social * 0.2 + distance * 0.1`.
- **User Matching** uses cosine similarity for interests, then blends budget and pace compatibility.

The current demo uses Logistic Regression because it is simple, explainable, and easy to run. In the future, ROAMIO can upgrade to LightGBM when a larger real dataset is available.

## Run Backend

```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app:app --reload
```

Backend URL: `http://localhost:8000`

Useful endpoints:

- `GET /`
- `GET /api/places`
- `GET /api/users`
- `POST /api/recommendations`
- `POST /api/matches`
- `GET /api/explain`

Example recommendation request:

```json
{
  "user_id": "u001",
  "latitude": 35.6618,
  "longitude": 139.7041,
  "top_k": 5
}
```

## Run Frontend

```powershell
cd roamio-ui
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

The frontend has local demo logic, so it can still present the flow if the Python backend is not running. `roamio-ui/src/services/api.ts` is ready for calls to the backend through `NEXT_PUBLIC_ROAMIO_API_URL`.

## Terminal Demo

```powershell
cd backend
python demo_run.py
```

The script prints the demo user, cluster, Top 5 places, component scores, Top 5 user matches, and short reasons. This output is designed for slide screenshots.

## Demo Flow For Presentation

1. Open the frontend and introduce ROAMIO as an AI travel companion.
2. Show the User Preference Form: budget, interests, travel style, companion type, transport, outdoor level, and hidden-gem preference.
3. Show the map and Top 5 recommendations.
4. Explain one recommendation by reading the Personal / Cluster / Social / Distance score breakdown.
5. Open Social and show compatible travel companions.
6. Open Data and explain the AI pipeline.
7. Run `python demo_run.py` to prove the backend AI modules produce the same kind of result.

## Mock Data vs Real AI

Mock/sample data:

- `backend/data/sample_users.json`
- `backend/data/sample_places.json`
- `backend/data/sample_checkins.json`
- Existing frontend seed data in `roamio-ui/src/lib/roamio-data.ts`

Real AI/algorithm logic that runs:

- `sklearn.cluster.KMeans` in `backend/ai/clustering.py`
- `sklearn.neighbors.BallTree` with Haversine in `backend/ai/spatial_search.py`
- `sklearn.linear_model.LogisticRegression` in `backend/ai/personal_recommender.py`
- Jaccard Similarity in `backend/ai/social_recommender.py`
- Hybrid scoring in `backend/ai/hybrid_recommender.py`
- Cosine-based user matching in `backend/ai/user_matching.py`

## Limitations

- Data is synthetic and curated for demo clarity.
- Logistic Regression is trained from generated labels, not production user feedback.
- The frontend still uses local fallback logic by default.
- FastAPI and Uvicorn must be installed before running the API server.
- No production authentication or persistent write database is included in the Python backend.

## Future Improvements

- Add real user, place, and check-in data.
- Upgrade Logistic Regression to LightGBM after collecting enough labeled data.
- Connect the Next.js frontend directly to the Python API for all recommendation flows.
- Add richer maps, route planning, and automatic itinerary generation.
- Add user reviews and feedback loops for model retraining.
