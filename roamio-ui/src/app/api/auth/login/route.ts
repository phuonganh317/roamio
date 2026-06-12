import { NextRequest, NextResponse } from "next/server";

import { getTravelerByUsername } from "@/lib/database";
import { setSessionUserId } from "@/lib/session";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const username = typeof body.username === "string" && body.username.trim() ? body.username.trim() : "panh";
  const traveler = await getTravelerByUsername(username);

  await setSessionUserId(traveler.id);

  return NextResponse.json({
    ok: true,
    user: traveler,
  });
}
