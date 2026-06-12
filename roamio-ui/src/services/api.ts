import type { RoamioMatch, RoamioRecommendation, RoamioRecommendationRequest } from "@/types/roamio";

const API_BASE_URL = process.env.NEXT_PUBLIC_ROAMIO_API_URL ?? "http://localhost:8000";

export async function fetchBackendRecommendations(
  payload: RoamioRecommendationRequest
): Promise<{ user_id: string; cluster: string; recommendations: RoamioRecommendation[] }> {
  const response = await fetch(`${API_BASE_URL}/api/recommendations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Cannot load ROAMIO backend recommendations. The UI will keep using local demo logic.");
  }

  return response.json();
}

export async function fetchBackendMatches(userId: string, topK = 5): Promise<{ user_id: string; matches: RoamioMatch[] }> {
  const response = await fetch(`${API_BASE_URL}/api/matches`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId, top_k: topK }),
  });

  if (!response.ok) {
    throw new Error("Cannot load ROAMIO backend matches. The UI will keep using local demo logic.");
  }

  return response.json();
}
