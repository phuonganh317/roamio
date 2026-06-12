"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Layers } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Place } from "@/lib/roamio-data";
import type { DashboardState } from "@/lib/roamio-engine";
import { formatKm } from "./format";

type LeafletMarker = {
  bindPopup: (html: string) => LeafletMarker;
  on: (event: "click", handler: () => void) => LeafletMarker;
};

type LeafletMap = {
  remove: () => void;
  setView: (latLon: [number, number], zoom: number) => void;
};

type LeafletGlobal = {
  map: (id: string, options?: object) => LeafletMap;
  tileLayer: (url: string, options?: object) => { addTo: (map: LeafletMap) => void };
  marker: (latLon: [number, number]) => { addTo: (map: LeafletMap) => LeafletMarker };
};

declare global {
  interface Window {
    L?: LeafletGlobal;
  }
}

let leafletPromise: Promise<void> | undefined;

function loadLeaflet() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  if (window.L) {
    return Promise.resolve();
  }
  leafletPromise ??= new Promise((resolve, reject) => {
    const existingCss = document.querySelector("link[data-roamio-leaflet]");
    if (!existingCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.roamioLeaflet = "true";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.body.appendChild(script);
  });

  return leafletPromise;
}

export function LiveMap({
  dashboard,
  selectedPlace,
  onSelectPlace,
}: {
  dashboard: DashboardState;
  selectedPlace: Place;
  onSelectPlace: (id: string) => void;
}) {
  const mapRef = useRef<LeafletMap | null>(null);
  const mapId = "roamio-leaflet-map";

  useEffect(() => {
    let cancelled = false;

    loadLeaflet().then(() => {
      if (cancelled || !window.L) {
        return;
      }

      mapRef.current?.remove();
      const map = window.L.map(mapId, { zoomControl: true });
      mapRef.current = map;
      map.setView([dashboard.trip.currentLocation[0], dashboard.trip.currentLocation[1]], 13);
      window.L.tileLayer("https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap contributors",
      }).addTo(map);

      window.L.marker([dashboard.trip.currentLocation[0], dashboard.trip.currentLocation[1]])
        .addTo(map)
        .bindPopup("<strong>Your current trip position</strong>");

      dashboard.places.forEach((place) => {
        window.L?.marker([place.lat, place.lon])
          .addTo(map)
          .bindPopup(`<strong>${place.name}</strong><br>${place.category}<br>${place.rating} rating`)
          .on("click", () => onSelectPlace(place.id));
      });
    });

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [dashboard.places, dashboard.trip.currentLocation, onSelectPlace]);

  useEffect(() => {
    mapRef.current?.setView([selectedPlace.lat, selectedPlace.lon], 15);
  }, [selectedPlace.lat, selectedPlace.lon]);

  const mapsUrl = `https://www.openstreetmap.org/?mlat=${selectedPlace.lat}&mlon=${selectedPlace.lon}#map=16/${selectedPlace.lat}/${selectedPlace.lon}`;

  return (
    <Card className="overflow-hidden rounded-lg py-0">
      <CardHeader className="border-b px-4 py-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Layers className="size-4" />
          Tokyo OpenStreetMap / Leaflet
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div id={mapId} className="h-[380px] bg-muted" />
        <div className="border-t p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">{selectedPlace.name}</div>
              <div className="text-sm text-muted-foreground">
                {selectedPlace.category} | rating {selectedPlace.rating} | {formatKm(dashboard.checkIn.distanceKm)} from you
              </div>
            </div>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Badge className="gap-1">
                Open map
                <ExternalLink className="size-3" />
              </Badge>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
