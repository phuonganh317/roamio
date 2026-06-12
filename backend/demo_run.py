from __future__ import annotations

from ai.clustering import assign_cluster
from ai.hybrid_recommender import recommend_places
from ai.user_matching import find_best_matches
from utils.data_loader import find_user, load_checkins, load_places, load_users


def main() -> None:
    users = load_users()
    places = load_places()
    checkins = load_checkins()
    user = dict(find_user("u001"))
    user["cluster"] = assign_cluster(user, users)

    print("ROAMIO AI DEMO")
    print("=" * 48)
    print(f"User demo: {user['name']} ({user['id']})")
    print(f"Cluster: {user['cluster']}")
    print(f"So thich: {', '.join(user['interests'])}")
    print()

    print("Top 5 dia diem goi y")
    print("-" * 48)
    for index, item in enumerate(recommend_places(user, places, checkins, top_k=5), start=1):
        print(f"{index}. {item['place_name']} [{item['category']}] - {item['distance_km']} km")
        print(f"   final={item['final_score']:.3f} personal={item['personal_score']:.3f} cluster={item['cluster_score']:.3f} social={item['social_score']:.3f} distance={item['distance_score']:.3f}")
        print(f"   Ly do: {item['short_reason']}")
    print()

    print("Top 5 user matching")
    print("-" * 48)
    for index, match in enumerate(find_best_matches(user, users, top_k=5), start=1):
        common = ", ".join(match["common_interests"]) or "bo sung so thich"
        print(f"{index}. {match['name']} ({match['matched_user_id']}) - {match['matching_score']:.3f}")
        print(f"   Chung: {common}")
        print(f"   Ly do: {match['reason']}")


if __name__ == "__main__":
    main()
