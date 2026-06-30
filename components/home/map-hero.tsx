"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Ship, Shuffle } from "lucide-react";
import { useState } from "react";

import { HeroSearch } from "@/components/home/hero-search";
import { MapLoader } from "@/components/map/map-loader";
import { Button } from "@/components/ui/button";
import type { DiscoveryShip } from "@/lib/home-data";
import type { AtlasMapSite } from "@/lib/map-data";

const discoveryPageSize = 3;

export function MapHero({ sites, discoveryShips }: { sites: AtlasMapSite[]; discoveryShips: DiscoveryShip[] }) {
  const [selectedSiteSlug, setSelectedSiteSlug] = useState<string>();
  const [discoveryOffset, setDiscoveryOffset] = useState(0);
  const visibleDiscoveryShips = Array.from(
    { length: Math.min(discoveryPageSize, discoveryShips.length) },
    (_, index) => discoveryShips[(discoveryOffset + index) % discoveryShips.length],
  );

  return (
    <section className="bg-white lg:grid lg:h-[calc(100svh-4rem)] lg:min-h-[680px] lg:grid-cols-[minmax(360px,42%)_1fr]" aria-labelledby="homepage-heading">
      <div className="order-1 overflow-y-auto border-b border-slate-200 px-5 py-8 sm:px-8 lg:max-h-[calc(100svh-4rem)] lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
        <div className="mx-auto max-w-xl lg:mx-0">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-sky-800">Warship Explorer</p>
          <h1 id="homepage-heading" className="mt-3 text-4xl font-black tracking-tight text-slate-950 xl:text-5xl">Explore naval history around the world</h1>
          <p className="mt-4 leading-7 text-slate-600">Every preserved ship has a place and a story. Find museum ships, understand their history, and plan a visit without needing to be a naval expert.</p>

          <HeroSearch embeddedResults onSelectSite={setSelectedSiteSlug} onSelectShip={(_, siteSlug) => setSelectedSiteSlug(siteSlug)} />

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><MapPin className="size-4 text-amber-600" /> {sites.length} museum sites</span>
            <span className="flex items-center gap-1.5"><Ship className="size-4 text-sky-700" /> {discoveryShips.length} historic ships</span>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-sky-800"><Shuffle className="size-4" /> Random Discovery</p>
                <h2 className="mt-1 text-xl font-black text-slate-950">Ships beyond the familiar names</h2>
              </div>
              <button type="button" onClick={() => setDiscoveryOffset((current) => discoveryShips.length > 0 ? (current + discoveryPageSize) % discoveryShips.length : 0)} className="shrink-0 rounded-full border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
                Shuffle
              </button>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-500">A non-ranked selection from the atlas, chosen to encourage exploration.</p>

            <div className="mt-5 grid gap-3">
              {visibleDiscoveryShips.map((ship) => (
                <article key={ship.id} className="flex gap-4 rounded-2xl border border-slate-200 p-3 transition hover:border-sky-300 hover:shadow-sm">
                  <Link href={`/ships/${ship.slug}`} className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-800">
                    <Image src={ship.image} alt="" fill className="object-cover" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/ships/${ship.slug}`} className="font-black text-slate-950 hover:text-sky-800 hover:underline">{ship.name}</Link>
                    <p className="mt-1 truncate text-sm text-slate-500">{ship.type} | {ship.className}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><CalendarDays className="size-3.5" /> Launched {ship.launched}</p>
                  </div>
                  <button type="button" onClick={() => setSelectedSiteSlug(ship.siteSlug)} className="self-center rounded-full bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100">Map</button>
                </article>
              ))}
            </div>
          </div>

          <Button asChild className="mt-7 w-full sm:w-auto">
            <Link href="/map">Open full map <ArrowRight className="size-4" /></Link>
          </Button>
        </div>
      </div>

      <div className="order-2 relative bg-slate-200 lg:min-h-0">
        <MapLoader sites={sites} hero selectedSiteSlug={selectedSiteSlug} />
        <p className="pointer-events-none absolute bottom-7 left-1/2 z-[700] -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-center text-xs font-semibold text-slate-700 shadow backdrop-blur sm:text-sm">Scroll over the map to zoom. Select a marker to see the ships there.</p>
      </div>
    </section>
  );
}
