import { NextResponse } from "next/server";
import { getPlaces, getTripProfile } from "@/lib/database";
import { datasetStats } from "@/lib/roamio-data";
import { recommendPlaces } from "@/lib/roamio-engine";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const trip = await getTripProfile(await getSessionUserId());
  const places = await getPlaces();
  return NextResponse.json({
    stats: datasetStats,
    trip,
    places,
    recommendations: recommendPlaces(trip.selectedTags, trip.budgetUsd, places, trip),
  });
}
