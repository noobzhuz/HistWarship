import { ContentStatus, PostType } from "@prisma/client";
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

export type CommunityPreviewPost = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  targetLabel: string;
  targetHref: string | null;
  tags: Array<{
    slug: string;
    name: string;
  }>;
};

export type CommunityPreviewData = {
  discussions: CommunityPreviewPost[];
  tripReports: CommunityPreviewPost[];
};

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const excerptText = (text: string, maxLength = 150) => {
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}...`;
};

const mapCommunityPost = (post: {
  id: string;
  title: string;
  body: string;
  author: { displayName: string | null };
  ship: { slug: string; name: string } | null;
  site: { slug: string; name: string } | null;
  tags: Array<{ slug: string; name: string }>;
}): CommunityPreviewPost => {
  const target = post.ship
    ? { label: post.ship.name, href: `/ships/${post.ship.slug}` }
    : post.site
      ? { label: post.site.name, href: `/sites/${post.site.slug}` }
      : { label: "General discussion", href: null };

  return {
    id: post.id,
    title: post.title,
    excerpt: excerptText(post.body),
    authorName: post.author.displayName ?? "Demo contributor",
    targetLabel: target.label,
    targetHref: target.href,
    tags: post.tags,
  };
};

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

export async function getCommunityPreviewPosts(): Promise<CommunityPreviewData> {
  const postSelect = {
    id: true,
    title: true,
    body: true,
    author: {
      select: {
        displayName: true,
      },
    },
    ship: {
      select: {
        slug: true,
        name: true,
      },
    },
    site: {
      select: {
        slug: true,
        name: true,
      },
    },
    tags: {
      select: {
        slug: true,
        name: true,
      },
      orderBy: { name: "asc" as const },
    },
  };

  const [discussions, tripReports] = await Promise.all([
    prisma.post.findMany({
      where: {
        type: PostType.DISCUSSION,
        status: ContentStatus.PUBLISHED,
      },
      select: postSelect,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        type: PostType.TRIP_REPORT,
        status: ContentStatus.PUBLISHED,
      },
      select: postSelect,
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
  ]);

  return {
    discussions: discussions.map(mapCommunityPost),
    tripReports: tripReports.map(mapCommunityPost),
  };
}
