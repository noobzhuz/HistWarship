import type { Metadata } from "next";
import { Info } from "lucide-react";

import { MapLoader } from "@/components/map/map-loader";

export const metadata: Metadata = { title: "World Map" };

export default function MapPage() {
  return (
    <div className="relative">
      <MapLoader />
      <aside className="pointer-events-none absolute left-4 top-4 z-10 max-w-xs rounded-2xl bg-slate-950/90 p-4 text-white shadow-xl backdrop-blur sm:left-6 sm:top-6">
        <p className="flex items-center gap-2 font-bold"><Info className="size-4 text-amber-300" /> Museum sites and POIs</p>
        <p className="mt-1 text-sm leading-5 text-slate-300">Each marker is a place you can visit. Open it to discover the ships preserved there.</p>
      </aside>
    </div>
  );
}
