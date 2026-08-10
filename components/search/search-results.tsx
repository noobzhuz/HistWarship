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
  groupOrder: Array<"sites" | "ships">;
  sites: Array<{
    id: string;
    slug: string;
    name: string;
    location: string;
    summary: string;
    shipCount: number;
  }>;
  ships: Array<{
    id: string;
    slug: string;
    name: string;
    type: string;
    className: string | null;
    hullNumber: string | null;
    country: string | null;
    siteSlug: string;
    siteName: string;
    siteLocation: string;
    summary: string;
  }>;
};

type SearchStatus = "idle" | "loading" | "success" | "error";

type SearchState = {
  query: string;
  results: SearchResponse;
  status: SearchStatus;
};

const emptyResults: SearchResponse = {
  groupOrder: ["sites", "ships"],
  sites: [],
  ships: [],
};

const pluralizeShips = (count: number) => `${count} ${count === 1 ? "ship" : "ships"}`;
const joinDetails = (details: Array<string | null>) => details.filter(Boolean).join(" | ");

export function SearchResults({ query, onSelectSite, onSelectShip, embedded = false }: SearchResultsProps) {
  const normalized = query.trim();
  const [searchState, setSearchState] = useState<SearchState>({
    query: "",
    results: emptyResults,
    status: "idle",
  });

  useEffect(() => {
    if (normalized.length < 2) {
      setSearchState({ query: normalized, results: emptyResults, status: "idle" });
      return;
    }

    const controller = new AbortController();
    setSearchState({ query: normalized, results: emptyResults, status: "loading" });

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Search request failed.");
        }

        const data = (await response.json()) as SearchResponse;
        setSearchState({ query: normalized, results: data, status: "success" });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setSearchState({ query: normalized, results: emptyResults, status: "error" });
      }
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [normalized]);

  if (normalized.length < 2) return null;

  const currentState = searchState.query === normalized
    ? searchState
    : { query: normalized, results: emptyResults, status: "loading" as const };
  const results = currentState.results;
  const matchingSites = results.sites;
  const matchingShips = results.ships;
  const empty = matchingSites.length === 0 && matchingShips.length === 0;

  return (
    <div aria-live="polite" aria-busy={currentState.status === "loading"} className={embedded ? "mt-4 max-h-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 text-left text-slate-950" : "absolute left-0 right-0 top-[calc(100%+0.75rem)] z-40 max-h-96 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-3 text-left text-slate-950 shadow-2xl"}>
      {currentState.status === "loading" ? (
        <div className="flex items-center gap-3 p-4 text-sm text-slate-600"><Search className="size-5" /> Searching...</div>
      ) : currentState.status === "error" ? (
        <div className="flex items-center gap-3 p-4 text-sm text-red-700"><Search className="size-5" /> Search is unavailable right now. Please try again.</div>
      ) : empty ? (
        <div className="flex items-start gap-3 p-4 text-sm text-slate-600"><Search className="mt-0.5 size-5 shrink-0" /><span>No sites or ships found for &ldquo;{normalized}&rdquo;. Try a ship, museum, city, country, class, or hull number.</span></div>
      ) : (
        <div className="flex flex-col">
          {matchingSites.length > 0 && <div className={results.groupOrder[0] === "sites" ? "order-1" : "order-2"}>
            <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-widest text-slate-500">Museum sites</p>
            {matchingSites.map((site) => onSelectSite ? (
            <div key={site.id} className="flex flex-col gap-3 rounded-2xl p-3 hover:bg-slate-100 sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-amber-600" />
                <div className="min-w-0 flex-1">
                  <Link href={`/sites/${site.slug}`} className="block font-bold hover:text-sky-800 hover:underline">{site.name}</Link>
                  <p className="text-sm text-slate-500">{joinDetails([site.location, pluralizeShips(site.shipCount)])}</p>
                  {site.summary && <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{site.summary}</p>}
                </div>
              </div>
              <button type="button" onClick={() => onSelectSite(site.slug)} className="w-full shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 sm:w-auto">Show on map</button>
            </div>
          ) : (
            <Link key={site.id} href={`/sites/${site.slug}`} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <MapPin className="mt-0.5 size-5 shrink-0 text-amber-600" />
              <span className="min-w-0"><strong className="block">{site.name}</strong><span className="block text-sm text-slate-500">{joinDetails([site.location, pluralizeShips(site.shipCount)])}</span>{site.summary && <span className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{site.summary}</span>}</span>
            </Link>
            ))}
          </div>}
          {matchingShips.length > 0 && <div className={results.groupOrder[0] === "ships" ? "order-1" : "order-2"}>
            <p className="px-3 pb-2 pt-4 text-xs font-bold uppercase tracking-widest text-slate-500">Ships</p>
            {matchingShips.map((ship) => onSelectShip ? (
            <div key={ship.id} className="flex flex-col gap-3 rounded-2xl p-3 hover:bg-slate-100 sm:flex-row sm:items-start">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <Ship className="mt-0.5 size-5 shrink-0 text-sky-700" />
                <div className="min-w-0 flex-1">
                  <Link href={`/ships/${ship.slug}`} className="block font-bold hover:text-sky-800 hover:underline">{ship.name}</Link>
                  <p className="text-sm text-slate-500">{joinDetails([ship.type, ship.className, ship.hullNumber, ship.country])}</p>
                  <p className="text-sm text-slate-500">{joinDetails([ship.siteName, ship.siteLocation])}</p>
                  {ship.summary && <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{ship.summary}</p>}
                </div>
              </div>
              <button type="button" onClick={() => onSelectShip(ship.slug, ship.siteSlug)} className="w-full shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 sm:w-auto">Show on map</button>
            </div>
          ) : (
            <Link key={ship.id} href={`/ships/${ship.slug}`} className="flex items-start gap-3 rounded-2xl p-3 hover:bg-slate-100">
              <Ship className="mt-0.5 size-5 shrink-0 text-sky-700" />
              <span className="min-w-0"><strong className="block">{ship.name}</strong><span className="block text-sm text-slate-500">{joinDetails([ship.type, ship.className, ship.hullNumber, ship.country])}</span><span className="block text-sm text-slate-500">{joinDetails([ship.siteName, ship.siteLocation])}</span>{ship.summary && <span className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{ship.summary}</span>}</span>
            </Link>
            ))}
          </div>}
        </div>
      )}
    </div>
  );
}
