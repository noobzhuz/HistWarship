import { ContentStatus, PostType } from "@prisma/client";
import type { ShipType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type CommunityPostCard = {
  id: string;
  title: string;
  excerpt: string;
  authorName: string;
  targetKind: "Ship" | "Museum site" | "General";
  targetLabel: string;
  targetHref: string | null;
  contextLabel: string | null;
  createdAtLabel: string;
  tags: Array<{
    slug: string;
    name: string;
  }>;
};

export type CommunityPageData = {
  discussions: CommunityPostCard[];
  tripReports: CommunityPostCard[];
};

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const excerptText = (text: string, maxLength = 180) => {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= maxLength) return normalizedText;

  return `${normalizedText.slice(0, maxLength).trimEnd()}...`;
};

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const mapCommunityPost = (post: {
  id: string;
  title: string;
  body: string;
  createdAt: Date;
  author: { displayName: string | null };
  ship: {
    slug: string;
    name: string;
    type: ShipType;
    typeLabel: string | null;
    country: string | null;
  } | null;
  site: { slug: string; name: string; city: string | null; country: string } | null;
  tags: Array<{ slug: string; name: string }>;
}): CommunityPostCard => {
  const target = post.ship
    ? {
        kind: "Ship" as const,
        label: post.ship.name,
        href: `/ships/${post.ship.slug}`,
        context: [post.ship.typeLabel ?? formatShipType(post.ship.type), post.ship.country].filter(Boolean).join(" | "),
      }
    : post.site
      ? {
          kind: "Museum site" as const,
          label: post.site.name,
          href: `/sites/${post.site.slug}`,
          context: [post.site.city, post.site.country].filter(Boolean).join(" | "),
        }
      : {
          kind: "General" as const,
          label: "General discussion",
          href: null,
          context: null,
        };

  return {
    id: post.id,
    title: post.title,
    excerpt: excerptText(post.body),
    authorName: post.author.displayName ?? "Community contributor",
    targetKind: target.kind,
    targetLabel: target.label,
    targetHref: target.href,
    contextLabel: target.context || null,
    createdAtLabel: dateFormatter.format(post.createdAt),
    tags: post.tags,
  };
};

export async function getCommunityPagePosts(): Promise<CommunityPageData> {
  const postSelect = {
    id: true,
    title: true,
    body: true,
    type: true,
    createdAt: true,
    author: {
      select: {
        displayName: true,
      },
    },
    ship: {
      select: {
        slug: true,
        name: true,
        type: true,
        typeLabel: true,
        country: true,
      },
    },
    site: {
      select: {
        slug: true,
        name: true,
        city: true,
        country: true,
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

  const posts = await prisma.post.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
      type: {
        in: [PostType.DISCUSSION, PostType.TRIP_REPORT],
      },
    },
    select: postSelect,
    orderBy: { createdAt: "desc" },
    take: 24,
  });

  return {
    discussions: posts.filter((post) => post.type === PostType.DISCUSSION).map(mapCommunityPost),
    tripReports: posts.filter((post) => post.type === PostType.TRIP_REPORT).map(mapCommunityPost),
  };
}
