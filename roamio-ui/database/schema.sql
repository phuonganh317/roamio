CREATE TABLE IF NOT EXISTS roamio_users (
  id BIGINT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  home_city TEXT NOT NULL,
  cluster TEXT NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  budget_usd INTEGER NOT NULL DEFAULT 45,
  selected_tags TEXT[] NOT NULL DEFAULT ARRAY['food', 'photo', 'culture'],
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  preferences JSONB NOT NULL DEFAULT '{}'::jsonb,
  travel_days INTEGER NOT NULL DEFAULT 3,
  pace INTEGER NOT NULL DEFAULT 3,
  last_active_hours INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS roamio_places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  parent_category TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  popularity INTEGER NOT NULL DEFAULT 50,
  rating DOUBLE PRECISION NOT NULL DEFAULT 4.0,
  price_level INTEGER NOT NULL DEFAULT 2,
  tags TEXT[] NOT NULL DEFAULT '{}',
  best_hours INTEGER[] NOT NULL DEFAULT '{}',
  rare_drop BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS roamio_itinerary_items (
  id TEXT PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES roamio_users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  place_id TEXT REFERENCES roamio_places(id) ON DELETE SET NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  done BOOLEAN NOT NULL DEFAULT FALSE,
  time_window TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS roamio_check_ins (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES roamio_users(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL REFERENCES roamio_places(id) ON DELETE CASCADE,
  review_chars INTEGER NOT NULL DEFAULT 0,
  photos INTEGER NOT NULL DEFAULT 0,
  points INTEGER NOT NULL DEFAULT 20,
  created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS roamio_places_city_idx ON roamio_places(city);
CREATE INDEX IF NOT EXISTS roamio_places_parent_category_idx ON roamio_places(parent_category);
CREATE INDEX IF NOT EXISTS roamio_check_ins_user_created_idx ON roamio_check_ins(user_id, created_at DESC);
