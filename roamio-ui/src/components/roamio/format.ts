export function formatKm(value: number) {
  return `${value.toFixed(value < 1 ? 2 : 1)} km`;
}

export const tagOptions = ["food", "photo", "culture", "nature", "shopping", "nightlife"];
