from __future__ import annotations

import math
from typing import Any

import numpy as np
from sklearn.neighbors import BallTree

EARTH_RADIUS_KM = 6371.0


def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    r_lat1 = math.radians(lat1)
    r_lat2 = math.radians(lat2)
    value = math.sin(d_lat / 2) ** 2 + math.cos(r_lat1) * math.cos(r_lat2) * math.sin(d_lon / 2) ** 2
    return EARTH_RADIUS_KM * 2 * math.atan2(math.sqrt(value), math.sqrt(1 - value))


def build_place_balltree(places: list[dict[str, Any]]) -> BallTree:
    coordinates = np.radians([[place["latitude"], place["longitude"]] for place in places])
    return BallTree(coordinates, metric="haversine")


def find_nearby_places(
    user_location: tuple[float, float],
    places: list[dict[str, Any]],
    k: int = 20,
) -> list[dict[str, Any]]:
    tree = build_place_balltree(places)
    query_point = np.radians([[user_location[0], user_location[1]]])
    distances, indices = tree.query(query_point, k=min(k, len(places)))
    nearby_places: list[dict[str, Any]] = []
    for distance_rad, place_index in zip(distances[0], indices[0]):
        place = dict(places[int(place_index)])
        place["distance_km"] = float(distance_rad * EARTH_RADIUS_KM)
        nearby_places.append(place)
    return nearby_places
