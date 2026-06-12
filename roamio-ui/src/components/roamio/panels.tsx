"use client";

import {
  BarChart3,
  Camera,
  CheckCircle2,
  CloudSun,
  Image as ImageIcon,
  Layers3,
  ListChecks,
  Plus,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { datasetStats, type Place } from "@/lib/roamio-data";
import type { DashboardState } from "@/lib/roamio-engine";
import { formatKm, tagOptions } from "./format";

export function PreferencePanel({
  budget,
  setBudget,
  tags,
  setTags,
}: {
  budget: number;
  setBudget: (value: number) => void;
  tags: string[];
  setTags: (value: string[]) => void;
}) {
  function toggleTag(tag: string) {
    setTags(tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag]);
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="size-4" />
          User Preference Form
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>Budget per day</span>
            <span className="font-medium">${budget}</span>
          </div>
          <Slider value={[budget]} min={15} max={160} step={5} onValueChange={(value) => setBudget(value[0])} />
        </div>
        <div className="flex flex-wrap gap-2">
          {tagOptions.map((tag) => (
            <button key={tag} type="button" onClick={() => toggleTag(tag)} aria-pressed={tags.includes(tag)}>
              <Badge variant={tags.includes(tag) ? "default" : "outline"}>{tag}</Badge>
            </button>
          ))}
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="mb-2 font-medium">Travel style</div>
            <div className="flex flex-wrap gap-2">
              {["food_culture", "explorer", "relax"].map((item) => (
                <Badge key={item} variant={item === "food_culture" ? "default" : "outline"}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="mb-2 font-medium">Demo profile</div>
            <div className="text-muted-foreground">friends | train | outdoor 6/10 | hidden gems 7/10 | Tokyo</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Recommendations({
  recommendations,
  onSelectPlace,
  onAddToPlan,
  plannedPlaceIds,
}: {
  recommendations: DashboardState["recommendations"];
  onSelectPlace: (id: string) => void;
  onAddToPlan: (place: Place) => void;
  plannedPlaceIds: Set<string>;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="size-4" />
          Top 5 Place Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.map(({ place, score, distanceKm, timeScore, personalScore, clusterScore, socialScore, distanceScore }) => {
          const isPlanned = plannedPlaceIds.has(place.id);

          return (
            <div
              key={place.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelectPlace(place.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectPlace(place.id);
                }
              }}
              className="grid w-full cursor-pointer gap-3 rounded-lg border p-3 text-left transition hover:border-emerald-500 hover:bg-emerald-50 sm:grid-cols-[1fr_auto]"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{place.name}</span>
                  <Badge variant="outline">{place.parentCategory}</Badge>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {place.category} | {formatKm(distanceKm)} | final score {(score * 100).toFixed(0)}%
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
                  {[
                    ["Personal", personalScore],
                    ["Cluster", clusterScore],
                    ["Social", socialScore],
                    ["Distance", distanceScore],
                  ].map(([label, value]) => (
                    <div key={label as string} className="rounded-md bg-muted px-2 py-1">
                      <div className="font-semibold">{((value as number) * 100).toFixed(0)}%</div>
                      <div className="text-muted-foreground">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <Badge variant={timeScore >= 0.7 ? "default" : "secondary"}>{timeScore >= 0.7 ? "Good timing" : "Flexible"}</Badge>
                <Button
                  type="button"
                  size="sm"
                  variant={isPlanned ? "secondary" : "outline"}
                  disabled={isPlanned}
                  onClick={(event) => {
                    event.stopPropagation();
                    onAddToPlan(place);
                  }}
                >
                  <Plus className="size-4" />
                  {isPlanned ? "Added" : "Add to Plan"}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export function CheckInPanel({ selectedPlace, dashboard }: { selectedPlace: Place; dashboard: DashboardState }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Camera className="size-4" />
          Check-in Gate
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium">{selectedPlace.name}</div>
          <div className={dashboard.checkIn.eligible ? "text-sm text-emerald-700" : "text-sm text-amber-700"}>
            {dashboard.checkIn.eligible ? "Within geofence and bucket available" : "Move closer or wait for bucket refill"} |{" "}
            {formatKm(dashboard.checkIn.distanceKm)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button disabled={!dashboard.checkIn.eligible}>
            <Camera className="size-4" />
            Check in
          </Button>
          <Button variant="outline">
            <ImageIcon className="size-4" />
            Add photo
          </Button>
        </div>
        <Separator />
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            ["base", dashboard.scoring.base],
            ["review", dashboard.scoring.reviewBonus],
            ["photo", dashboard.scoring.photoBonus],
            ["drop", dashboard.scoring.rareBonus],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-muted p-2">
              <div className="font-semibold">+{value}</div>
              <div className="text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function ItineraryPanel({
  dashboard,
  onToggleItem,
  onRemoveItem,
}: {
  dashboard: DashboardState;
  onToggleItem: (id: string, done: boolean) => void;
  onRemoveItem: (id: string) => void;
}) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ListChecks className="size-4" />
          Weighted Itinerary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>{dashboard.progress.completion}% completed</span>
            <span className="text-muted-foreground">ETA {dashboard.progress.etaMinutes} min</span>
          </div>
          <Progress value={dashboard.progress.completion} />
        </div>
        <div className="space-y-2">
          {dashboard.itinerary.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
              <Switch checked={item.done} onCheckedChange={(checked) => onToggleItem(item.id, checked)} />
              <div className="min-w-0 flex-1">
                <div className={item.done ? "truncate text-sm font-medium text-muted-foreground line-through" : "truncate text-sm font-medium"}>
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground">{item.window}</div>
              </div>
              <Badge variant="outline">w{item.weight}</Badge>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={`Remove ${item.title} from plan`}
                onClick={() => onRemoveItem(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherPanel({ dashboard }: { dashboard: DashboardState }) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <CloudSun className="size-4" />
          Weather-Aware Planning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">{dashboard.weather.condition}</div>
            <div className="text-sm text-muted-foreground">
              {dashboard.weather.city} | humidity {dashboard.weather.humidity}%
            </div>
          </div>
          <div className="text-3xl font-semibold">{dashboard.weather.temperatureC}C</div>
        </div>
        <p className="rounded-lg bg-sky-50 p-3 text-sm text-sky-950">{dashboard.weather.planningHint}</p>
      </CardContent>
    </Card>
  );
}

export function SocialPanel({ dashboard }: { dashboard: DashboardState }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="size-4" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dashboard.leaderboard.map((traveler, index) => (
            <div key={traveler.id} className="flex items-center gap-3 rounded-lg border p-3">
              <div className="w-7 text-center font-semibold">{index + 1}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{traveler.name}</div>
                <div className="text-xs text-muted-foreground">
                  {traveler.points} pts | {traveler.cluster}
                </div>
              </div>
              {index === 0 ? <Badge>Weekly top</Badge> : <Badge variant="outline">{traveler.homeCity}</Badge>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="size-4" />
            User Matching - Top 5 Companions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {dashboard.companions.map(({ traveler, score, distanceKm, reason }) => (
            <div key={traveler.id} className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="font-medium">{traveler.name}</div>
                <Badge variant="secondary">{(score * 100).toFixed(0)}%</Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {formatKm(distanceKm)} | Cosine interest + budget + pace | {reason}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function DataPanel({ dashboard }: { dashboard: DashboardState }) {
  return (
    <div className="grid gap-4">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Layers3 className="size-4" />
            AI Explanation
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["K-Means", "Groups travelers into Budget Explorer, Food & Culture Lover, Luxury Relaxer, and Weekend Traveler."],
            ["BallTree + Haversine", "Filters nearby places by real geographic distance before ranking."],
            ["Logistic Regression", "Predicts the chance a user will like each candidate place."],
            ["Jaccard Similarity", "Finds users with overlapping check-in histories for social proof."],
            ["Hybrid Scoring", "Combines personal, cluster, social, and distance signals into the final Top-K."],
            ["User Matching", "Uses cosine interest similarity plus budget and pace compatibility."],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-lg border p-3">
              <div className="font-medium">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{detail}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="size-4" />
            Integration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Python AI backend", "FastAPI modules added in /backend with JSON sample data"],
            ["Frontend fallback", `Next.js demo mode: ${dashboard.databaseMode}`],
            ["OpenStreetMap", "Leaflet markers and popups active"],
            ["Seed data", `${datasetStats.tables.length} mapped tables plus Tokyo sample places`],
          ].map(([title, detail]) => (
            <div key={title} className="rounded-lg border p-3">
              <CheckCircle2 className="mb-3 size-5 text-emerald-700" />
              <div className="font-medium">{title}</div>
              <div className="text-sm text-muted-foreground">{detail}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function ReviewPanel() {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Star className="size-4" />
          Quick Review
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input placeholder="Review title" defaultValue="Great hidden stop" />
          <Input placeholder="Rating" defaultValue="5" />
        </div>
        <Textarea defaultValue="Compact, friendly, and worth the walk. The route timing was good, and this stop added a nice local texture to the day." />
        <Button>
          <Zap className="size-4" />
          Submit and earn
        </Button>
      </CardContent>
    </Card>
  );
}
