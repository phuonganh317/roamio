"use client";

import { BadgeCheck, CloudSun, Route, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { DashboardState } from "@/lib/roamio-engine";

export function StatStrip({ dashboard }: { dashboard: DashboardState }) {
  const stats = [
    { label: "Trip progress", value: `${dashboard.progress.completion}%`, icon: Route, tone: "text-[#790832]" },
    { label: "Check-ins left", value: `${dashboard.tokenBucketRemaining}/${dashboard.trip.bucketCap}`, icon: BadgeCheck, tone: "text-[#cf6687]" },
    { label: "Next earn", value: `+${dashboard.scoring.total}`, icon: Trophy, tone: "text-[#9c3159]" },
    { label: "Weather", value: `${dashboard.weather.temperatureC}C`, icon: CloudSun, tone: "text-[#790832]" },
  ];

  return (
    <section className="grid gap-3 px-4 py-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-6">
      {stats.map((item) => (
        <Card key={item.label} className="rounded-lg border-[#e5c8c5] bg-[#fffaf0] py-4 shadow-sm">
          <CardContent className="flex items-center justify-between px-4">
            <div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="text-2xl font-semibold">{item.value}</p>
            </div>
            <item.icon className={`size-6 ${item.tone}`} />
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
