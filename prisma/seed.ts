import { PrismaClient, ShipType } from "@prisma/client";

import { ships, sites } from "../lib/mock-data";

const prisma = new PrismaClient();

const postTags = [
  "trip-report",
  "question",
  "visit-planning",
  "restoration",
  "history",
  "photography",
];

const titleCaseTag = (slug: string) =>
  slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const mapShipType = (type: string): ShipType => {
  const normalizedType = type.toLowerCase();

  if (normalizedType.includes("cruiser")) {
    return ShipType.CRUISER;
  }

  if (normalizedType.includes("battleship")) {
    return ShipType.BATTLESHIP;
  }

  if (normalizedType === "submarine") {
    return ShipType.SUBMARINE;
  }

  if (normalizedType === "ship of the line") {
    return ShipType.SAILING_WARSHIP;
  }

  if (normalizedType === "destroyer") {
    return ShipType.DESTROYER;
  }

  return ShipType.OTHER;
};

const getSeedShipName = (ship: (typeof ships)[number]) => {
  if (ship.slug === "hswms-smaland") {
    return "HSwMS Småland";
  }

  return ship.name;
};

async function main() {
  const siteBySlug = new Map<string, { id: string }>();

  for (const site of sites) {
    const seededSite = await prisma.museumSite.upsert({
      where: { slug: site.slug },
      update: {
        name: site.name,
        summary: site.summary,
        city: site.city,
        country: site.country,
        latitude: site.coordinates[0].toFixed(6),
        longitude: site.coordinates[1].toFixed(6),
        heroImageUrl: site.image,
      },
      create: {
        slug: site.slug,
        name: site.name,
        summary: site.summary,
        city: site.city,
        country: site.country,
        latitude: site.coordinates[0].toFixed(6),
        longitude: site.coordinates[1].toFixed(6),
        heroImageUrl: site.image,
      },
      select: { id: true },
    });

    siteBySlug.set(site.slug, seededSite);
  }

  for (const ship of ships) {
    const site = siteBySlug.get(ship.siteSlug);

    if (!site) {
      throw new Error(`Missing museum site for ship "${ship.slug}" with site slug "${ship.siteSlug}".`);
    }

    await prisma.ship.upsert({
      where: { slug: ship.slug },
      update: {
        name: getSeedShipName(ship),
        summary: ship.summary,
        shipClass: ship.className,
        type: mapShipType(ship.type),
        typeLabel: ship.type,
        nation: ship.country,
        country: ship.country,
        launchedYear: ship.launched,
        heroImageUrl: ship.image,
        siteId: site.id,
      },
      create: {
        slug: ship.slug,
        name: getSeedShipName(ship),
        summary: ship.summary,
        shipClass: ship.className,
        type: mapShipType(ship.type),
        typeLabel: ship.type,
        nation: ship.country,
        country: ship.country,
        launchedYear: ship.launched,
        heroImageUrl: ship.image,
        siteId: site.id,
      },
    });
  }

  for (const slug of postTags) {
    await prisma.postTag.upsert({
      where: { slug },
      update: {
        name: titleCaseTag(slug),
      },
      create: {
        slug,
        name: titleCaseTag(slug),
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
