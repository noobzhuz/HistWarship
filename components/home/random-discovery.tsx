"use client";

import { Shuffle } from "lucide-react";
import { useState } from "react";

import { ShipCard } from "@/components/ships/ship-card";
import { Button } from "@/components/ui/button";
import { ships } from "@/lib/mock-data";

const discoveryOrder = [4, 1, 6, 2, 7, 0, 5, 3];

export function RandomDiscovery() {
  const [offset, setOffset] = useState(0);
  const discoveryShips = Array.from({ length: 4 }, (_, index) => ships[discoveryOrder[(offset + index) % discoveryOrder.length]]).filter(Boolean);

  return (
    <section className="bg-sky-950 px-5 py-16 text-white lg:px-8 lg:py-20" aria-labelledby="random-discovery-heading">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-300"><Shuffle className="size-4" /> Random Discovery</p>
            <h2 id="random-discovery-heading" className="mt-2 text-3xl font-black tracking-tight">Meet a ship you may not know yet</h2>
            <p className="mt-4 leading-7 text-sky-100">This rotating discovery selection is not ranked by ratings, popularity, or engagement.</p>
          </div>
          <Button type="button" variant="outline" onClick={() => setOffset((current) => (current + 4) % discoveryOrder.length)}>
            <Shuffle className="size-4" /> Show another selection
          </Button>
        </div>
        <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {discoveryShips.map((ship) => <ShipCard key={ship.id} ship={ship} />)}
        </div>
      </div>
    </section>
  );
}
