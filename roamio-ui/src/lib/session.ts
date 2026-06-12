import { cookies } from "next/headers";

const cookieName = "roamio_user";

export async function getSessionUserId() {
  const value = (await cookies()).get(cookieName)?.value;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 822;
}

export async function setSessionUserId(userId: number) {
  (await cookies()).set(cookieName, String(userId), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSession() {
  (await cookies()).delete(cookieName);
}
