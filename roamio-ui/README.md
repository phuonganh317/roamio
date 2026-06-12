Roamio UI

Roamio is a Next.js app for AI-assisted travel planning. The current app integrates local Roamio data, map-style exploration, weather-aware planning, check-in scoring, itinerary progress, leaderboard, and companion recommendations.

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

```bash
npm run lint
npm run build
npm run start
```

## Data Notes

The app can connect to Postgres through `DATABASE_URL`. When `DATABASE_URL` is missing, it falls back to curated seed data so local development still works.

```bash
cp .env.example .env.local
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

The recommendation, scoring, geofence, weather, and companion logic lives in `src/lib/roamio-engine.ts`. Large research artifacts remain outside the deploy bundle and are ignored by Vercel.
