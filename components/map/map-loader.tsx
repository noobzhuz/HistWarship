"use client";

import dynamic from "next/dynamic";

const AtlasMap = dynamic(() => import("@/components/map/atlas-map").then((module) => module.AtlasMap), {
  ssr: false,
  loading: () => <div className="grid h-[430px] w-full place-items-center rounded-3xl bg-slate-200 font-semibold text-slate-600">Loading atlas map...</div>,
});

export function MapLoader({ compact = false }: { compact?: boolean }) {
  return <AtlasMap compact={compact} />;
}
