import { ContentStatus, PostType, PrismaClient, ShipType } from "@prisma/client";

import { ships, sites } from "./seed-data";

const prisma = new PrismaClient();
const demoUserId = "00000000-0000-4000-8000-000000000001";

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

const requireSeedTarget = (target: { id: string } | undefined, label: string) => {
  if (!target) {
    throw new Error(`Missing seeded target for demo community content: ${label}.`);
  }

  return target;
};

async function main() {
  const siteBySlug = new Map<string, { id: string }>();
  const shipBySlug = new Map<string, { id: string }>();

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

    const seededShip = await prisma.ship.upsert({
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
      select: { id: true },
    });

    shipBySlug.set(ship.slug, seededShip);
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

  await prisma.userProfile.upsert({
    where: { id: demoUserId },
    update: {
      displayName: "Demo Preview Contributor",
      bio: "Demo account used for preview community content in development.",
    },
    create: {
      id: demoUserId,
      displayName: "Demo Preview Contributor",
      bio: "Demo account used for preview community content in development.",
    },
  });

  const salem = requireSeedTarget(shipBySlug.get("uss-salem"), "USS Salem");
  const battleshipCove = requireSeedTarget(siteBySlug.get("battleship-cove"), "Battleship Cove");
  const belfast = requireSeedTarget(shipBySlug.get("hms-belfast"), "HMS Belfast");

  const demoPosts = [
    {
      slug: "demo-uss-salem-first-visit-discussion",
      title: "[Demo] What should first-time visitors notice aboard USS Salem?",
      body: "Demo/preview discussion content for development. This placeholder is intended to help test future community previews without presenting real user activity.",
      type: PostType.DISCUSSION,
      shipId: salem.id,
      siteId: undefined,
      tagSlugs: ["question", "history"],
    },
    {
      slug: "demo-battleship-cove-family-visit",
      title: "[Demo] Planning a family visit to Battleship Cove",
      body: "Demo/preview discussion content for development. This placeholder can be used later to test site-linked community previews and visit-planning tags.",
      type: PostType.DISCUSSION,
      shipId: undefined,
      siteId: battleshipCove.id,
      tagSlugs: ["visit-planning", "question"],
    },
    {
      slug: "demo-hms-belfast-short-trip-report",
      title: "[Demo Trip Report] A short visit aboard HMS Belfast",
      body: "Demo/preview trip report content for development. This is not real community activity; it exists to test future trip report previews.",
      type: PostType.TRIP_REPORT,
      shipId: belfast.id,
      siteId: undefined,
      tagSlugs: ["trip-report", "photography"],
    },
  ];

  for (const post of demoPosts) {
    const tagConnections = post.tagSlugs.map((slug) => ({ slug }));

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        body: post.body,
        type: post.type,
        status: ContentStatus.PUBLISHED,
        authorId: demoUserId,
        shipId: post.shipId,
        siteId: post.siteId,
        tags: {
          set: tagConnections,
        },
      },
      create: {
        slug: post.slug,
        title: post.title,
        body: post.body,
        type: post.type,
        status: ContentStatus.PUBLISHED,
        authorId: demoUserId,
        shipId: post.shipId,
        siteId: post.siteId,
        tags: {
          connect: tagConnections,
        },
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
