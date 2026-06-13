"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { SearchResults } from "@/components/search/search-results";
import { Input } from "@/components/ui/input";

type HeroSearchProps = {
  onSelectSite?: (siteSlug: string) => void;
  onSelectShip?: (shipSlug: string, siteSlug: string) => void;
  embeddedResults?: boolean;
};

export function HeroSearch({ onSelectSite, onSelectShip, embeddedResults = false }: HeroSearchProps) {
  const [query, setQuery] = useState("");

  const selectSite = (siteSlug: string) => {
    onSelectSite?.(siteSlug);
    if (!embeddedResults) setQuery("");
  };

  const selectShip = (shipSlug: string, siteSlug: string) => {
    onSelectShip?.(shipSlug, siteSlug);
    if (!embeddedResults) setQuery("");
  };

  return (
    <div className="relative mt-6 w-full">
      <Search className="pointer-events-none absolute left-5 top-3.5 z-10 size-5 text-slate-500" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search USS Salem, Battleship Cove, Balao-class..."
        aria-label="Search museum sites and ships"
        className="h-14 border-0 pl-13 pr-5 shadow-xl"
      />
      <SearchResults query={query} onSelectSite={onSelectSite ? selectSite : undefined} onSelectShip={onSelectShip ? selectShip : undefined} embedded={embeddedResults} />
    </div>
  );
}
