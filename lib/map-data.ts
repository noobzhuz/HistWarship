import { prisma } from "@/lib/prisma";

export type AtlasMapSite = {
  id: string;
  slug: string;
  name: string;
  city: string | null;
  region: string | null;
  country: string;
  coordinates: [number, number];
  ships: Array<{
    id: string;
    slug: string;
    name: string;
  }>;
};

export async function getMapSites(): Promise<AtlasMapSite[]> {
  const sites = await prisma.museumSite.findMany({
    select: {
      id: true,
      slug: true,
      name: true,
      city: true,
      region: true,
      country: true,
      latitude: true,
      longitude: true,
      ships: {
        select: {
          id: true,
          slug: true,
          name: true,
        },
        orderBy: { name: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return sites.map((site) => ({
    id: site.id,
    slug: site.slug,
    name: site.name,
    city: site.city,
    region: site.region,
    country: site.country,
    coordinates: [Number(site.latitude), Number(site.longitude)],
    ships: site.ships,
  }));
}
