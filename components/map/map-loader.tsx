"use client";

import dynamic from "next/dynamic";

const AtlasMap = dynamic(() => import("@/components/map/atlas-map").then((module) => module.AtlasMap), {
  ssr: false,
  loading: () => <div className="grid h-full min-h-[430px] w-full place-items-center bg-slate-200 font-semibold text-slate-600">Loading atlas map...</div>,
});

type MapLoaderProps = {
  compact?: boolean;
  hero?: boolean;
  selectedSiteSlug?: string;
};

export function MapLoader({ compact = false, hero = false, selectedSiteSlug }: MapLoaderProps) {
  return <AtlasMap compact={compact} hero={hero} selectedSiteSlug={selectedSiteSlug} />;
}
