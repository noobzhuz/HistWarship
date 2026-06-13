import Link from "next/link";
import { ArrowRight, Globe2, MapPin, Search, Ship } from "lucide-react";

import { FeaturedShips } from "@/components/home/featured-ships";
import { FeaturedSites } from "@/components/home/featured-sites";
import { HeroSearch } from "@/components/home/hero-search";
import { MapLoader } from "@/components/map/map-loader";
import { Button } from "@/components/ui/button";
import { sites, ships } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-slate-950 px-5 py-24 text-center text-white sm:py-32">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#38bdf8_0,transparent_30%),radial-gradient(circle_at_80%_10%,#fbbf24_0,transparent_25%)]" />
        <div className="relative mx-auto max-w-4xl">
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-amber-300">Explore naval history around the world</p>
          <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Every preserved ship has a place and a story.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">Find museum ships, understand their history, and plan a visit without needing to be a naval expert.</p>
          <HeroSearch />
          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {sites.length} museum sites</span>
            <span className="flex items-center gap-1.5"><Ship className="size-4" /> {ships.length} historic ships</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold uppercase tracking-widest text-sky-800">Start with a destination</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Featured museum sites</h2></div>
          <Button asChild variant="outline"><Link href="/map">View world map <ArrowRight className="size-4" /></Link></Button>
        </div>
        <FeaturedSites />
      </section>

      <section className="bg-sky-950 px-5 py-20 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <Globe2 className="size-10 text-amber-300" />
            <h2 className="mt-5 text-3xl font-black tracking-tight">One marker, one place to visit.</h2>
            <p className="mt-4 leading-7 text-sky-100">Markers represent museum sites rather than individual ships. Open a marker to see every vessel preserved there, then jump directly to the ship that interests you.</p>
            <Button asChild className="mt-7"><Link href="/map">Open full map <ArrowRight className="size-4" /></Link></Button>
          </div>
          <MapLoader compact />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="mb-9"><p className="text-sm font-bold uppercase tracking-widest text-sky-800">Meet the ships</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Stories across eras and oceans</h2></div>
        <FeaturedShips />
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-20 text-center">
        <div className="rounded-3xl bg-amber-100 px-6 py-12 sm:px-12">
          <Search className="mx-auto size-9 text-amber-700" />
          <h2 className="mt-4 text-3xl font-black text-slate-950">Looking for a particular vessel?</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-700">Search by ship, museum, class, type, city, or country from the top of this page.</p>
        </div>
      </section>
    </>
  );
}
