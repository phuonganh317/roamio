import { activeTrip, itinerary, places, travelers, type ItineraryItem, type LatLon, type Place, type Traveler, type TripProfile } from "./roamio-data";

export function pct(n: number, d: number) {
  return Math.min(100, Math.round((n / Math.max(1, d)) * 100));
}

export function ewma(series: number[], lambda = 0.3) {
  return series.reduce((acc, x) => lambda * x + (1 - lambda) * acc, series[0] ?? 0);
}

export function haversine(a: LatLon, b: LatLon) {
  const radiusKm = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return radiusKm * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

export function tokenBucketRemaining(checkInsToday = activeTrip.checkInsToday, cap = activeTrip.bucketCap) {
  return Math.max(0, cap - checkInsToday);
}

export function scorePlace(place: Place, location: LatLon, tags: string[], budgetUsd: number, hour = activeTrip.currentHour) {
  const distanceKm = haversine(location, [place.lat, place.lon]);
  const tagScore = tags.length ? tags.filter((tag) => place.tags.includes(tag) || place.parentCategory === tag).length / tags.length : 0.5;
  const budgetScore = place.priceLevel * 15 <= budgetUsd ? 1 : 0.35;
  const timeScore = place.bestHours.includes(hour) ? 1 : place.bestHours.some((h) => Math.abs(h - hour) <= 2) ? 0.7 : 0.35;
  const geoScore = Math.exp(-distanceKm / 3);
  const popularityScore = place.popularity / 100;
  const ratingScore = place.rating / 5;
  const distanceScore = geoScore;
  const personalScore = 0.4 * tagScore + 0.25 * budgetScore + 0.2 * ratingScore + 0.15 * timeScore;
  const clusterScore = tags.includes(place.parentCategory) ? 1 : place.tags.some((tag) => tags.includes(tag)) ? 0.75 : 0.35;
  const socialScore = 0.7 * popularityScore + 0.3 * (place.rareDrop ? 1 : 0.55);

  const score =
    0.5 * personalScore +
    0.2 * clusterScore +
    0.2 * socialScore +
    0.1 * distanceScore;

  return { score, distanceKm, tagScore, budgetScore, timeScore, personalScore, clusterScore, socialScore, distanceScore };
}

export function recommendPlaces(tags = activeTrip.selectedTags, budgetUsd = activeTrip.budgetUsd, sourcePlaces = places, trip = activeTrip) {
  return sourcePlaces
    .map((place) => ({ place, ...scorePlace(place, trip.currentLocation, tags, budgetUsd, trip.currentHour) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

export function checkInEligibility(placeId = places[1].id, radiusKm = 0.3, sourcePlaces = places, trip = activeTrip) {
  const place = sourcePlaces.find((item) => item.id === placeId) ?? sourcePlaces[0];
  const distanceKm = haversine(trip.currentLocation, [place.lat, place.lon]);
  return {
    place,
    radiusKm,
    distanceKm,
    eligible: distanceKm <= radiusKm && tokenBucketRemaining(trip.checkInsToday, trip.bucketCap) > 0,
  };
}

export function reviewScore(reviewChars = activeTrip.reviewChars, photos = activeTrip.photos) {
  const reviewBonus = reviewChars >= 120 ? 5 : 0;
  const photoBonus = Math.min(10, photos * 5);
  const rareBonus = places.some((place) => place.rareDrop) ? 3 : 0;
  return {
    base: 20,
    reviewBonus,
    photoBonus,
    rareBonus,
    total: 20 + reviewBonus + photoBonus + rareBonus,
  };
}

export function itineraryProgress(sourceItinerary = itinerary) {
  const totalWeight = sourceItinerary.reduce((sum, item) => sum + item.weight, 0);
  const doneWeight = sourceItinerary.filter((item) => item.done).reduce((sum, item) => sum + item.weight, 0);
  const completion = pct(doneWeight, totalWeight);
  const recent = sourceItinerary.map((item) => (item.done ? 1 : 0));
  const speed = Math.round(ewma(recent) * 100);
  const etaMinutes = Math.max(12, Math.ceil(((100 - completion) / Math.max(1, speed)) * 45));
  return { totalWeight, doneWeight, completion, speed, etaMinutes };
}

export function leaderboard(sourceTravelers = travelers) {
  return [...sourceTravelers].sort((a, b) => b.points - a.points);
}

function cosinePreference(a: Traveler, b: Traveler) {
  const keys = Array.from(new Set([...Object.keys(a.preferences), ...Object.keys(b.preferences)]));
  const dot = keys.reduce((sum, key) => sum + (a.preferences[key] ?? 0) * (b.preferences[key] ?? 0), 0);
  const magA = Math.sqrt(keys.reduce((sum, key) => sum + (a.preferences[key] ?? 0) ** 2, 0));
  const magB = Math.sqrt(keys.reduce((sum, key) => sum + (b.preferences[key] ?? 0) ** 2, 0));
  return dot / Math.max(1, magA * magB);
}

export function companionMatches(userId = activeTrip.userId, sourceTravelers = travelers) {
  const user = sourceTravelers.find((item) => item.id === userId) ?? sourceTravelers[0];
  return sourceTravelers
    .filter((candidate) => candidate.id !== user.id)
    .map((candidate) => {
      const preference = cosinePreference(user, candidate);
      const distanceKm = haversine([user.lat, user.lon], [candidate.lat, candidate.lon]);
      const clusterBoost = user.cluster === candidate.cluster ? 0.18 : 0;
      const pacePenalty = Math.abs(user.pace - candidate.pace) * 0.04;
      const freshness = Math.max(0, 1 - candidate.lastActiveHours / 24);
      const score = Math.min(1, 0.58 * preference + 0.17 * Math.exp(-distanceKm / 8) + 0.12 * freshness + clusterBoost - pacePenalty);
      return {
        traveler: candidate,
        score,
        distanceKm,
        preference,
        reason: buildCompanionReason(user, candidate, distanceKm),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function buildCompanionReason(user: Traveler, candidate: Traveler, distanceKm: number) {
  const shared = Object.keys(user.preferences)
    .filter((key) => (user.preferences[key] ?? 0) >= 7 && (candidate.preferences[key] ?? 0) >= 7)
    .slice(0, 2);
  const parts = [
    shared.length ? `Shared taste: ${shared.join(" and ")}` : "Complementary travel profile",
    distanceKm < 2 ? "nearby right now" : "same city radius",
    candidate.lastActiveHours <= 4 ? "recently active" : "stable trip cadence",
  ];
  return parts.join(" | ");
}

export function weatherSnapshot(hour = activeTrip.currentHour, city = activeTrip.city) {
  const raining = hour >= 15 && hour <= 17;
  const hot = hour >= 11 && hour <= 15;
  return {
    city,
    condition: raining ? "Light rain window" : hot ? "Warm and bright" : "Clear travel weather",
    temperatureC: hot ? 31 : raining ? 27 : 25,
    humidity: raining ? 82 : 68,
    planningHint: raining
      ? "Move indoor culture and cafe stops earlier; keep sunset flexible."
      : hot
        ? "Prioritize shade, hydration, and shorter walking legs."
        : "Good conditions for photo walks and outdoor check-ins.",
  };
}

export type DashboardState = {
  user: Traveler;
  trip: TripProfile;
  places: Place[];
  itinerary: ItineraryItem[];
  recommendations: ReturnType<typeof recommendPlaces>;
  progress: ReturnType<typeof itineraryProgress>;
  checkIn: ReturnType<typeof checkInEligibility>;
  scoring: ReturnType<typeof reviewScore>;
  leaderboard: Traveler[];
  companions: ReturnType<typeof companionMatches>;
  weather: ReturnType<typeof weatherSnapshot>;
  tokenBucketRemaining: number;
  databaseMode: string;
};
