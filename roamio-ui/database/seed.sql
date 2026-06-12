DELETE FROM roamio_itinerary_items WHERE id IN ('t1', 't2', 't3', 't4', 't5');
DELETE FROM roamio_places WHERE id IN (
  '4b0587a6f964a520529e22e3',
  '4b7b884ff964a5207d662fe3',
  '4c178638c2dfc928651ea869',
  '4ea281c302d529c116a57755',
  '4cca7bd67965b60c80f0858a',
  '4e538e91483b944199dede7a',
  '4ba88a28f964a52028df39e3',
  '4d69a46cde28224b27ff45be'
);

INSERT INTO roamio_users (
  id, username, password_hash, display_name, home_city, cluster, points, budget_usd,
  selected_tags, latitude, longitude, preferences, travel_days, pace, last_active_hours
) VALUES
  (822, 'panh', 'demo-password', 'Panh', 'Tokyo', 'urban-food-photo', 2140, 65, ARRAY['food','photo','culture'], 35.6618, 139.7041, '{"food":9,"culture":7,"nature":7,"shopping":4,"nightlife":6}', 4, 3, 1),
  (1701, 'linh', 'demo-password', 'Linh', 'Tokyo', 'urban-food-photo', 3200, 70, ARRAY['food','culture'], 35.6718, 139.7030, '{"food":8,"culture":8,"nature":5,"shopping":5,"nightlife":6}', 3, 3, 2),
  (537, 'minh', 'demo-password', 'Minh', 'Tokyo', 'urban-food-photo', 2900, 75, ARRAY['food','shopping'], 35.6581, 139.7017, '{"food":9,"culture":6,"nature":5,"shopping":7,"nightlife":4}', 5, 4, 4),
  (1960, 'an', 'demo-password', 'An', 'Tokyo', 'nature-slow', 2450, 55, ARRAY['nature','culture'], 35.6860, 139.7104, '{"food":5,"culture":7,"nature":10,"shopping":3,"nightlife":2}', 6, 2, 13),
  (556, 'khai', 'demo-password', 'Khai', 'Tokyo', 'urban-food-photo', 1800, 62, ARRAY['culture','photo'], 35.6990, 139.7737, '{"food":7,"culture":8,"nature":6,"shopping":4,"nightlife":5}', 3, 3, 12),
  (91, 'trang', 'demo-password', 'Trang', 'Tokyo', 'night-market', 1600, 58, ARRAY['food','nightlife','shopping'], 35.6942, 139.7001, '{"food":8,"culture":4,"nature":3,"shopping":8,"nightlife":8}', 2, 4, 3)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  password_hash = EXCLUDED.password_hash,
  display_name = EXCLUDED.display_name,
  home_city = EXCLUDED.home_city,
  cluster = EXCLUDED.cluster,
  points = EXCLUDED.points,
  budget_usd = EXCLUDED.budget_usd,
  selected_tags = EXCLUDED.selected_tags,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  preferences = EXCLUDED.preferences,
  travel_days = EXCLUDED.travel_days,
  pace = EXCLUDED.pace,
  last_active_hours = EXCLUDED.last_active_hours;

INSERT INTO roamio_places (
  id, name, city, category, parent_category, latitude, longitude, popularity, rating, price_level, tags, best_hours, rare_drop
) VALUES
  ('tokyo-tower', 'Tokyo Tower', 'Tokyo', 'Landmark / Observatory', 'culture', 35.6586, 139.7454, 95, 4.6, 3, ARRAY['culture','photo','nightlife'], ARRAY[10,11,17,18,19], TRUE),
  ('shibuya-crossing', 'Shibuya Crossing', 'Tokyo', 'Attraction / Shopping', 'shopping', 35.6595, 139.7005, 98, 4.7, 1, ARRAY['shopping','photo','nightlife'], ARRAY[16,17,18,19,20], TRUE),
  ('meiji-jingu', 'Meiji Jingu Shrine', 'Tokyo', 'Culture / Park', 'culture', 35.6764, 139.6993, 92, 4.8, 1, ARRAY['culture','nature','photo'], ARRAY[8,9,10,15,16], FALSE),
  ('sensoji-temple', 'Senso-ji Temple', 'Tokyo', 'Historic Temple', 'culture', 35.7148, 139.7967, 94, 4.7, 1, ARRAY['culture','history','shopping','photo'], ARRAY[8,9,10,17], TRUE),
  ('ueno-park', 'Ueno Park', 'Tokyo', 'Park / Museums', 'nature', 35.7156, 139.7730, 86, 4.7, 1, ARRAY['nature','culture','photo'], ARRAY[9,10,14,15], TRUE),
  ('akihabara-electric-town', 'Akihabara Electric Town', 'Tokyo', 'Electronics / Anime District', 'shopping', 35.6984, 139.7730, 88, 4.5, 2, ARRAY['shopping','nightlife','photo'], ARRAY[13,14,15,18,19], FALSE),
  ('tsukiji-outer-market', 'Tsukiji Outer Market', 'Tokyo', 'Food Market', 'food', 35.6655, 139.7707, 89, 4.5, 2, ARRAY['food','shopping','local'], ARRAY[7,8,9,10,11], FALSE),
  ('shinjuku-gyoen', 'Shinjuku Gyoen National Garden', 'Tokyo', 'Garden', 'nature', 35.6852, 139.7101, 84, 4.7, 1, ARRAY['nature','photo','culture'], ARRAY[9,10,14,15,16], TRUE),
  ('omoide-yokocho', 'Omoide Yokocho', 'Tokyo', 'Food Alley', 'nightlife', 35.6938, 139.7006, 81, 4.4, 2, ARRAY['nightlife','food','local','photo'], ARRAY[18,19,20,21,22], FALSE)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  city = EXCLUDED.city,
  category = EXCLUDED.category,
  parent_category = EXCLUDED.parent_category,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude,
  popularity = EXCLUDED.popularity,
  rating = EXCLUDED.rating,
  price_level = EXCLUDED.price_level,
  tags = EXCLUDED.tags,
  best_hours = EXCLUDED.best_hours,
  rare_drop = EXCLUDED.rare_drop;

INSERT INTO roamio_itinerary_items (id, user_id, title, place_id, weight, done, time_window) VALUES
  ('t1', 822, 'Morning reset at Meiji Jingu Shrine', 'meiji-jingu', 2, TRUE, '08:30'),
  ('t2', 822, 'Street energy and photos at Shibuya Crossing', 'shibuya-crossing', 1, TRUE, '10:30'),
  ('t3', 822, 'Seafood lunch checkpoint at Tsukiji Outer Market', 'tsukiji-outer-market', 1, FALSE, '12:30'),
  ('t4', 822, 'Late afternoon observatory stop at Tokyo Tower', 'tokyo-tower', 2, FALSE, '17:20'),
  ('t5', 822, 'Evening food alley and social lane in Shinjuku', 'omoide-yokocho', 2, FALSE, '20:00')
ON CONFLICT (id) DO UPDATE SET
  user_id = EXCLUDED.user_id,
  title = EXCLUDED.title,
  place_id = EXCLUDED.place_id,
  weight = EXCLUDED.weight,
  done = EXCLUDED.done,
  time_window = EXCLUDED.time_window;
