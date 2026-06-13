import { ShipCard } from "@/components/ships/ship-card";
import { ships } from "@/lib/mock-data";

export function FeaturedShips() {
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">{ships.slice(0, 4).map((ship) => <ShipCard key={ship.id} ship={ship} />)}</div>;
}
