export type RoamioRecommendationRequest = {
  user_id: string;
  latitude: number;
  longitude: number;
  top_k: number;
};

export type RoamioRecommendation = {
  place_id: string;
  place_name: string;
  category: string;
  distance_km: number;
  final_score: number;
  personal_score: number;
  cluster_score: number;
  social_score: number;
  distance_score: number;
  short_reason: string;
};

export type RoamioMatch = {
  matched_user_id: string;
  name: string;
  matching_score: number;
  common_interests: string[];
  reason: string;
};
