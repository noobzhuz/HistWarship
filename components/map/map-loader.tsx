"use client";

import dynamic from "next/dynamic";
import type { AtlasMapSite } from "@/lib/map-data";

const AtlasMap = dynamic(() => import("@/components/map/atlas-map").then((module) => module.AtlasMap), {
  ssr: false,
  loading: () => <div className="grid h-full min-h-[430px] w-full place-items-center bg-slate-200 font-semibold text-slate-600">Loading atlas map...</div>,
});

type MapLoaderProps = {
  sites: AtlasMapSite[];
  compact?: boolean;
  hero?: boolean;
  selectedSiteSlug?: string;
};

export function MapLoader({ sites, compact = false, hero = false, selectedSiteSlug }: MapLoaderProps) {
  return <AtlasMap sites={sites} compact={compact} hero={hero} selectedSiteSlug={selectedSiteSlug} />;
}
