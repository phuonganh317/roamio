"use client";

import { LogOut, MapPin, Users } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { datasetStats } from "@/lib/roamio-data";
import type { DashboardState } from "@/lib/roamio-engine";

export function AppHeader({
  dashboard,
  username,
  setUsername,
  onLogin,
  onLogout,
}: {
  dashboard: DashboardState;
  username: string;
  setUsername: (value: string) => void;
  onLogin: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="border-b border-[#e5c8c5] bg-white py-5 shadow-sm">
      <div className="flex w-full flex-col gap-4">
        <div className="relative aspect-[3/1] w-full overflow-hidden border-y border-[#d999a8] bg-[#f8f1df] shadow-sm">
          <Image
            src="/roamio-heading.png"
            alt="ROAMIO"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1280px"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant="outline" className="gap-1 border-[#d999a8] bg-[#f8f1df] text-[#790832]">
              {datasetStats.checkIns.toLocaleString()} check-ins
            </Badge>
            <Badge variant="outline" className="gap-1 border-[#d999a8] bg-[#f8f1df] text-[#790832]">
              <MapPin className="size-3" />
              {dashboard.places.length} loaded
            </Badge>
            <Badge variant="outline" className="gap-1 border-[#d999a8] bg-[#f8f1df] text-[#790832]">
              <Users className="size-3" />
              {dashboard.leaderboard.length} travelers
            </Badge>
          </div>
          <div className="flex gap-2">
            <input
              className="h-9 w-36 rounded-md border border-[#d999a8] bg-[#fffaf0] px-3 text-sm outline-none ring-[#cf6687]/50 focus-visible:ring-2"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="panh"
            />
            <Button variant="secondary" onClick={onLogin}>
              Switch user
            </Button>
            <Button variant="outline" size="icon" onClick={onLogout} aria-label="Log out">
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
