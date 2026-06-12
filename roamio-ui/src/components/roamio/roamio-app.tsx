"use client";

import { useCallback, useMemo, useState } from "react";
import { Compass, Database, Route, Users } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ItineraryItem, Place } from "@/lib/roamio-data";
import { checkInEligibility, itineraryProgress, recommendPlaces, type DashboardState } from "@/lib/roamio-engine";
import { AppHeader } from "./app-header";
import { LiveMap } from "./live-map";
import {
  CheckInPanel,
  DataPanel,
  ItineraryPanel,
  PreferencePanel,
  Recommendations,
  ReviewPanel,
  SocialPanel,
  WeatherPanel,
} from "./panels";
import { StatStrip } from "./stat-strip";

export function RoamioApp({ initialDashboard }: { initialDashboard: DashboardState }) {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [username, setUsername] = useState(initialDashboard.user.name.toLowerCase());
  const [budget, setBudget] = useState(initialDashboard.trip.budgetUsd);
  const [tags, setTags] = useState(initialDashboard.trip.selectedTags);
  const [itinerary, setItinerary] = useState(initialDashboard.itinerary);
  const [selectedPlaceId, setSelectedPlaceId] = useState<Place["id"]>(
    initialDashboard.itinerary.find((item) => !item.done)?.placeId ?? initialDashboard.places[0].id
  );

  const refreshDashboard = useCallback(async () => {
    const response = await fetch("/api/me", { cache: "no-store" });
    const nextDashboard = (await response.json()) as DashboardState;
    setDashboard(nextDashboard);
    setBudget(nextDashboard.trip.budgetUsd);
    setTags(nextDashboard.trip.selectedTags);
    setItinerary(nextDashboard.itinerary);
    setSelectedPlaceId(nextDashboard.itinerary.find((item) => !item.done)?.placeId ?? nextDashboard.places[0].id);
  }, []);

  async function login() {
    await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });
    await refreshDashboard();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    await refreshDashboard();
  }

  function addPlaceToPlan(place: Place) {
    setSelectedPlaceId(place.id);
    setItinerary((currentItinerary) => {
      if (currentItinerary.some((item) => item.placeId === place.id)) {
        return currentItinerary;
      }

      const nextItem: ItineraryItem = {
        id: `plan-${place.id}`,
        title: `Visit ${place.name}`,
        placeId: place.id,
        weight: place.rareDrop ? 2 : 1,
        done: false,
        window: "Flexible",
      };

      return [...currentItinerary, nextItem];
    });
  }

  function togglePlanItem(id: string, done: boolean) {
    setItinerary((currentItinerary) => currentItinerary.map((item) => (item.id === id ? { ...item, done } : item)));
  }

  function removePlanItem(id: string) {
    const item = itinerary.find((planItem) => planItem.id === id);
    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `Remove "${item.title}" from your plan? This will update your itinerary and completion progress.`
    );

    if (!confirmed) {
      return;
    }

    setItinerary((currentItinerary) => currentItinerary.filter((planItem) => planItem.id !== id));
  }

  const selectedPlace = dashboard.places.find((place) => place.id === selectedPlaceId) ?? dashboard.places[0];
  const recommendations = useMemo(
    () => recommendPlaces(tags, budget, dashboard.places, dashboard.trip),
    [budget, dashboard.places, dashboard.trip, tags]
  );
  const plannedPlaceIds = useMemo(
    () => new Set(itinerary.map((item) => item.placeId).filter((placeId): placeId is string => Boolean(placeId))),
    [itinerary]
  );
  const dashboardForSelection = useMemo(
    () => ({
      ...dashboard,
      itinerary,
      progress: itineraryProgress(itinerary),
      recommendations,
      checkIn: checkInEligibility(selectedPlace.id, 0.45, dashboard.places, dashboard.trip),
    }),
    [dashboard, itinerary, recommendations, selectedPlace.id]
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader dashboard={dashboardForSelection} username={username} setUsername={setUsername} onLogin={login} onLogout={logout} />
      <StatStrip dashboard={dashboardForSelection} />

      <div className="px-4 pb-8 sm:px-6">
        <Tabs defaultValue="command" className="gap-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 rounded-lg sm:grid-cols-4 lg:w-fit">
            <TabsTrigger value="command">
              <Compass className="size-4" />
              Command
            </TabsTrigger>
            <TabsTrigger value="plan">
              <Route className="size-4" />
              Plan
            </TabsTrigger>
            <TabsTrigger value="social">
              <Users className="size-4" />
              Social
            </TabsTrigger>
            <TabsTrigger value="data">
              <Database className="size-4" />
              Data
            </TabsTrigger>
          </TabsList>

          <TabsContent value="command" className="mt-4 space-y-4">
            <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
              <LiveMap dashboard={dashboardForSelection} selectedPlace={selectedPlace} onSelectPlace={setSelectedPlaceId} />
              <div className="space-y-4">
                <PreferencePanel budget={budget} setBudget={setBudget} tags={tags} setTags={setTags} />
                <WeatherPanel dashboard={dashboardForSelection} />
              </div>
            </div>
            <div className="grid gap-4 xl:grid-cols-[1fr_0.85fr]">
              <Recommendations
                recommendations={recommendations}
                onSelectPlace={setSelectedPlaceId}
                onAddToPlan={addPlaceToPlan}
                plannedPlaceIds={plannedPlaceIds}
              />
              <CheckInPanel selectedPlace={selectedPlace} dashboard={dashboardForSelection} />
            </div>
          </TabsContent>

          <TabsContent value="plan" className="mt-4 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <ItineraryPanel dashboard={dashboardForSelection} onToggleItem={togglePlanItem} onRemoveItem={removePlanItem} />
            <ReviewPanel />
          </TabsContent>

          <TabsContent value="social" className="mt-4">
            <SocialPanel dashboard={dashboardForSelection} />
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <DataPanel dashboard={dashboardForSelection} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
