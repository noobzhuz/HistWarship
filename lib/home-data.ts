import type { ShipType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const dayInMilliseconds = 24 * 60 * 60 * 1000;

export type DiscoveryShip = {
  id: string;
  slug: string;
  name: string;
  className: string;
  type: string;
  launched: string;
  image: string;
  siteSlug: string;
  siteName: string;
  summary: string;
};

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

export async function getDiscoveryShips(): Promise<DiscoveryShip[]> {
  const ships = await prisma.ship.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      shipClass: true,
      type: true,
      typeLabel: true,
      launchedYear: true,
      heroImageUrl: true,
      summary: true,
      site: {
        select: {
          slug: true,
          name: true,
        },
      },
    },
    orderBy: { slug: "asc" },
  });

  if (ships.length === 0) return [];

  const dayOffset = Math.floor(Date.now() / dayInMilliseconds) % ships.length;
  const rotatedShips = ships.map((_, index) => ships[(index + dayOffset) % ships.length]);

  return rotatedShips.map((ship) => ({
    id: ship.id,
    slug: ship.slug,
    name: ship.name,
    className: ship.shipClass ?? "Class unknown",
    type: ship.typeLabel ?? formatShipType(ship.type),
    launched: ship.launchedYear?.toString() ?? "Unknown",
    image: ship.heroImageUrl ?? "/placeholder-ship.svg",
    siteSlug: ship.site.slug,
    siteName: ship.site.name,
    summary: ship.summary,
  }));
}
