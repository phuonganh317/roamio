import { NextResponse } from "next/server";

import { getDashboardState } from "@/lib/dashboard";
import { getSessionUserId } from "@/lib/session";

export async function GET() {
  return NextResponse.json(await getDashboardState(await getSessionUserId()));
}
