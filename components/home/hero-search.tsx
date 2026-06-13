"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { SearchResults } from "@/components/search/search-results";
import { Input } from "@/components/ui/input";

export function HeroSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative mx-auto mt-8 max-w-2xl">
      <Search className="pointer-events-none absolute left-5 top-3.5 z-10 size-5 text-slate-500" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search USS Salem, Battleship Cove, Balao-class..."
        aria-label="Search museum sites and ships"
        className="h-14 border-0 pl-13 pr-5 shadow-xl"
      />
      <SearchResults query={query} />
    </div>
  );
}
