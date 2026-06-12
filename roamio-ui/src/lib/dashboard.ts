import { databaseMode, getItineraryItems, getPlaces, getTravelerById, getTravelers, getTripProfile } from "./database";
import {
  checkInEligibility,
  companionMatches,
  itineraryProgress,
  leaderboard,
  recommendPlaces,
  reviewScore,
  tokenBucketRemaining,
  weatherSnapshot,
  type DashboardState,
} from "./roamio-engine";

export async function getDashboardState(userId: number): Promise<DashboardState> {
  const user = await getTravelerById(userId);
  const trip = await getTripProfile(user.id);
  const sourcePlaces = await getPlaces();
  const sourceTravelers = await getTravelers();
  const userItinerary = await getItineraryItems(user.id);
  const selectedPlaceId = userItinerary.find((item) => !item.done)?.placeId ?? sourcePlaces[0]?.id;

  return {
    user,
    trip,
    places: sourcePlaces,
    itinerary: userItinerary,
    recommendations: recommendPlaces(trip.selectedTags, trip.budgetUsd, sourcePlaces, trip),
    progress: itineraryProgress(userItinerary),
    checkIn: checkInEligibility(selectedPlaceId, 0.45, sourcePlaces, trip),
    scoring: reviewScore(trip.reviewChars, trip.photos),
    leaderboard: leaderboard(sourceTravelers),
    companions: companionMatches(user.id, sourceTravelers),
    weather: weatherSnapshot(trip.currentHour, trip.city),
    tokenBucketRemaining: tokenBucketRemaining(trip.checkInsToday, trip.bucketCap),
    databaseMode: databaseMode(),
  };
}
