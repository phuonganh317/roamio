import { NextResponse } from "next/server";
import { getTravelers } from "@/lib/database";
import { companionMatches, leaderboard } from "@/lib/roamio-engine";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  const travelers = await getTravelers();
  const userId = await getSessionUserId();
  return NextResponse.json({
    leaderboard: leaderboard(travelers),
    companions: companionMatches(userId, travelers),
  });
}
