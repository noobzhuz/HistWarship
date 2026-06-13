"use client";

import Link from "next/link";
import { MapPin, Search, Ship } from "lucide-react";

import { sites, ships } from "@/lib/mock-data";

export function SearchResults({ query }: { query: string }) {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return null;

  const matchingSites = sites.filter((site) => `${site.name} ${site.city} ${site.country} ${site.summary}`.toLocaleLowerCase().includes(normalized));
  const matchingShips = ships.filter((ship) => `${ship.name} ${ship.className} ${ship.type} ${ship.country} ${ship.summary}`.toLocaleLowerCase().includes(normalized));
  const empty = matchingSites.length === 0 && matchingShips.length === 0;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 text-left text-slate-950 shadow-2xl">
      {empty ? (
        <div className="flex items-center gap-3 p-4 text-sm text-slate-600"><Search className="size-5" /> No sites or ships found.</div>
      ) : (
        <>
          {matchingSites.length > 0 && <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Museum sites</p>}
          {matchingSites.map((site) => (
            <Link key={site.id} href={`/sites/${site.slug}`} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <MapPin className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <span><strong className="block">{site.name}</strong><span className="text-sm text-slate-500">{site.city}, {site.country}</span></span>
            </Link>
          ))}
          {matchingShips.length > 0 && <p className="px-3 pb-2 pt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Ships</p>}
          {matchingShips.map((ship) => (
            <Link key={ship.id} href={`/ships/${ship.slug}`} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <Ship className="mt-0.5 size-5 shrink-0 text-sky-700" />
              <span><strong className="block">{ship.name}</strong><span className="text-sm text-slate-500">{ship.type} | {ship.className}</span></span>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
