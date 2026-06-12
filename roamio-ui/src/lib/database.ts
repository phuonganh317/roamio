import { Pool, type QueryResultRow } from "pg";

import { activeTrip, itinerary, places, travelers, type ItineraryItem, type Place, type Traveler, type TripProfile } from "./roamio-data";

let pool: Pool | undefined;

function getPool() {
  if (!process.env.DATABASE_URL) {
    return undefined;
  }

  pool ??= new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 1200,
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined,
  });

  return pool;
}

async function query<T extends QueryResultRow>(sql: string, params: unknown[] = []) {
  const db = getPool();
  if (!db) {
    return undefined;
  }

  try {
    const result = await db.query<T>(sql, params);
    return result.rows;
  } catch (error) {
    console.warn("Roamio database query fell back to seed data:", error);
    return undefined;
  }
}

function mapPlace(row: QueryResultRow): Place {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    category: row.category,
    parentCategory: row.parent_category,
    lat: Number(row.latitude),
    lon: Number(row.longitude),
    popularity: Number(row.popularity),
    rating: Number(row.rating),
    priceLevel: Number(row.price_level) as Place["priceLevel"],
    tags: row.tags ?? [],
    bestHours: row.best_hours ?? [],
    rareDrop: Boolean(row.rare_drop),
  };
}

function mapTraveler(row: QueryResultRow): Traveler {
  return {
    id: Number(row.id),
    name: row.display_name,
    cluster: row.cluster,
    points: Number(row.points),
    homeCity: row.home_city,
    lat: Number(row.latitude),
    lon: Number(row.longitude),
    preferences: row.preferences ?? {},
    travelDays: Number(row.travel_days),
    pace: Number(row.pace),
    lastActiveHours: Number(row.last_active_hours),
  };
}

function mapItineraryItem(row: QueryResultRow): ItineraryItem {
  return {
    id: row.id,
    title: row.title,
    placeId: row.place_id ?? undefined,
    weight: Number(row.weight),
    done: Boolean(row.done),
    window: row.time_window,
  };
}

export async function getPlaces() {
  const rows = await query("SELECT * FROM roamio_places ORDER BY popularity DESC");
  return rows?.length ? rows.map(mapPlace) : places;
}

export async function getTravelers() {
  const rows = await query("SELECT * FROM roamio_users ORDER BY points DESC");
  return rows?.length ? rows.map(mapTraveler) : travelers;
}

export async function getTravelerByUsername(username: string) {
  const rows = await query("SELECT * FROM roamio_users WHERE username = $1 LIMIT 1", [username]);
  const row = rows?.[0];
  if (row) {
    return mapTraveler(row);
  }
  return travelers.find((traveler) => traveler.name.toLowerCase() === username.toLowerCase()) ?? travelers[0];
}

export async function getTravelerById(id: number) {
  const rows = await query("SELECT * FROM roamio_users WHERE id = $1 LIMIT 1", [id]);
  const row = rows?.[0];
  if (row) {
    return mapTraveler(row);
  }
  return travelers.find((traveler) => traveler.id === id) ?? travelers[0];
}

export async function getItineraryItems(userId: number) {
  const rows = await query("SELECT * FROM roamio_itinerary_items WHERE user_id = $1 ORDER BY time_window ASC", [userId]);
  return rows?.length ? rows.map(mapItineraryItem) : itinerary;
}

export async function getTripProfile(userId: number): Promise<TripProfile> {
  const traveler = await getTravelerById(userId);
  const rows = await query("SELECT budget_usd, selected_tags FROM roamio_users WHERE id = $1 LIMIT 1", [userId]);
  return {
    ...activeTrip,
    userId: traveler.id,
    budgetUsd: Number(rows?.[0]?.budget_usd ?? activeTrip.budgetUsd),
    selectedTags: rows?.[0]?.selected_tags ?? activeTrip.selectedTags,
    currentLocation: [traveler.lat, traveler.lon],
    city: traveler.homeCity,
  };
}

export function databaseMode() {
  return process.env.DATABASE_URL ? "postgres" : "seed-fallback";
}
