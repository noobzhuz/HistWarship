"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Search, Ship } from "lucide-react";

type SearchResultsProps = {
  query: string;
  onSelectSite?: (siteSlug: string) => void;
  onSelectShip?: (shipSlug: string, siteSlug: string) => void;
  embedded?: boolean;
};

type SearchResponse = {
  sites: Array<{
    id: string;
    slug: string;
    name: string;
    location: string;
    summary: string;
  }>;
  ships: Array<{
    id: string;
    slug: string;
    name: string;
    type: string;
    className: string;
    country: string;
    siteSlug: string;
    siteName: string;
    summary: string;
  }>;
};

const emptyResults: SearchResponse = {
  sites: [],
  ships: [],
};

export function SearchResults({ query, onSelectSite, onSelectShip, embedded = false }: SearchResultsProps) {
  const normalized = query.trim();
  const [results, setResults] = useState<SearchResponse>(emptyResults);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (normalized.length < 2) {
      setResults(emptyResults);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const data = (await response.json()) as SearchResponse;
        setResults(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setResults(emptyResults);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalized]);

  if (normalized.length < 2) return null;

  const matchingSites = results.sites;
  const matchingShips = results.ships;
  const empty = matchingSites.length === 0 && matchingShips.length === 0;

  return (
    <div className={embedded ? "mt-4 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 text-left text-slate-950" : "absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 text-left text-slate-950 shadow-2xl"}>
      {isLoading ? (
        <div className="flex items-center gap-3 p-4 text-sm text-slate-600"><Search className="size-5" /> Searching...</div>
      ) : empty ? (
        <div className="flex items-center gap-3 p-4 text-sm text-slate-600"><Search className="size-5" /> No sites or ships found.</div>
      ) : (
        <>
          {matchingSites.length > 0 && <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Museum sites</p>}
          {matchingSites.map((site) => onSelectSite ? (
            <div key={site.id} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <MapPin className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <span className="min-w-0 flex-1"><Link href={`/sites/${site.slug}`} className="block font-bold hover:text-sky-800 hover:underline">{site.name}</Link><span className="text-sm text-slate-500">{site.location}</span></span>
              <button type="button" onClick={() => onSelectSite(site.slug)} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200">Show on map</button>
            </div>
          ) : (
            <Link key={site.id} href={`/sites/${site.slug}`} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <MapPin className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <span><strong className="block">{site.name}</strong><span className="text-sm text-slate-500">{site.location}</span></span>
            </Link>
          ))}
          {matchingShips.length > 0 && <p className="px-3 pb-2 pt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Ships</p>}
          {matchingShips.map((ship) => onSelectShip ? (
            <div key={ship.id} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <Ship className="mt-0.5 size-5 shrink-0 text-sky-700" />
              <span className="min-w-0 flex-1"><Link href={`/ships/${ship.slug}`} className="block font-bold hover:text-sky-800 hover:underline">{ship.name}</Link><span className="text-sm text-slate-500">{ship.type} | {ship.className}</span></span>
              <button type="button" onClick={() => onSelectShip(ship.slug, ship.siteSlug)} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200">Show on map</button>
            </div>
          ) : (
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
