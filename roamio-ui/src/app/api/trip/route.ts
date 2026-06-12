import { NextResponse } from "next/server";
import { getItineraryItems, getPlaces, getTripProfile } from "@/lib/database";
import { checkInEligibility, itineraryProgress, reviewScore, tokenBucketRemaining, weatherSnapshot } from "@/lib/roamio-engine";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const userId = await getSessionUserId();
  const trip = await getTripProfile(userId);
  const itinerary = await getItineraryItems(userId);
  const places = await getPlaces();
  const selectedPlaceId = itinerary.find((item) => !item.done)?.placeId ?? places[0]?.id;

  return NextResponse.json({
    trip,
    itinerary,
    progress: itineraryProgress(itinerary),
    checkIn: checkInEligibility(selectedPlaceId, 0.45, places, trip),
    scoring: reviewScore(trip.reviewChars, trip.photos),
    tokenBucketRemaining: tokenBucketRemaining(trip.checkInsToday, trip.bucketCap),
    weather: weatherSnapshot(trip.currentHour, trip.city),
  });
}
