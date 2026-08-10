import { NextResponse } from "next/server";
import type { ShipType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 8;
const CANDIDATE_LIMIT = RESULT_LIMIT * 4;

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatLocation = (parts: Array<string | null>) => parts.filter(Boolean).join(", ");

const normalizeText = (value: string) => value.trim().toLowerCase().replace(/\s+/g, " ");

const normalizeHullNumber = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

const getHullNumberVariants = (query: string) => {
  const compact = normalizeHullNumber(query);
  const parts = compact.match(/^([a-z]+)(\d+)$/);
  const variants = new Set([query, compact]);

  if (parts) {
    const [, prefix, number] = parts;
    variants.add(`${prefix}-${number}`);
    variants.add(`${prefix} ${number}`);
    variants.add(`${prefix}_${number}`);
  }

  return [...variants].filter(Boolean);
};

const getNameRank = (name: string, normalizedQuery: string) => {
  const normalizedName = normalizeText(name);

  if (normalizedName === normalizedQuery) return 0;
  if (normalizedName.startsWith(normalizedQuery)) return 2;
  if (normalizedName.includes(normalizedQuery)) return 3;

  return Number.POSITIVE_INFINITY;
};

const includesQuery = (value: string | null | undefined, normalizedQuery: string) =>
  value ? normalizeText(value).includes(normalizedQuery) : false;

const deduplicateById = <T extends { id: string }>(groups: T[][]) =>
  [...new Map(groups.flat().map((item) => [item.id, item])).values()];

const compareRankedNames = <T extends { name: string }>(
  left: T,
  right: T,
  getRank: (item: T) => number,
) => getRank(left) - getRank(right) || left.name.localeCompare(right.name);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ sites: [], ships: [], groupOrder: ["sites", "ships"] });
  }

  const normalizedQuery = normalizeText(query);
  const normalizedHullQuery = normalizeHullNumber(query);
  const hullNumberFilters = getHullNumberVariants(query).map((variant) => ({
    hullNumber: { contains: variant, mode: "insensitive" as const },
  }));
  const siteSelect = {
    id: true,
    slug: true,
    name: true,
    city: true,
    region: true,
    country: true,
    summary: true,
    _count: {
      select: {
        ships: true,
      },
    },
  } as const;
  const shipSelect = {
    id: true,
    slug: true,
    name: true,
    alternateNames: true,
    shipClass: true,
    type: true,
    typeLabel: true,
    hullNumber: true,
    country: true,
    nation: true,
    summary: true,
    site: {
      select: {
        slug: true,
        name: true,
        city: true,
        region: true,
        country: true,
      },
    },
  } as const;

  const [directSites, broadSites, directShips, broadShips] = await Promise.all([
    prisma.museumSite.findMany({
      where: { name: { contains: query, mode: "insensitive" } },
      select: siteSelect,
      orderBy: { name: "asc" },
      take: RESULT_LIMIT,
    }),
    prisma.museumSite.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
        ],
      },
      select: siteSelect,
      orderBy: { name: "asc" },
      take: CANDIDATE_LIMIT,
    }),
    prisma.ship.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { alternateNames: { has: query } },
          ...hullNumberFilters,
        ],
      },
      select: shipSelect,
      orderBy: { name: "asc" },
      take: RESULT_LIMIT,
    }),
    prisma.ship.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          // TODO: Prisma's array filter only supports exact alternate-name matches here.
          { alternateNames: { has: query } },
          ...hullNumberFilters,
          { shipClass: { contains: query, mode: "insensitive" } },
          { typeLabel: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
          {
            site: {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { city: { contains: query, mode: "insensitive" } },
                { region: { contains: query, mode: "insensitive" } },
                { country: { contains: query, mode: "insensitive" } },
              ],
            },
          },
        ],
      },
      select: shipSelect,
      orderBy: { name: "asc" },
      take: CANDIDATE_LIMIT,
    }),
  ]);

  const getSiteRank = (site: (typeof directSites)[number]) => {
    const nameRank = getNameRank(site.name, normalizedQuery);
    if (Number.isFinite(nameRank)) return nameRank;

    if ([site.city, site.region, site.country].some((value) => includesQuery(value, normalizedQuery))) return 6;

    return 7;
  };
  const getShipRank = (ship: (typeof directShips)[number]) => {
    const nameRank = getNameRank(ship.name, normalizedQuery);
    if (nameRank === 0) return nameRank;

    if (ship.hullNumber && normalizeHullNumber(ship.hullNumber) === normalizedHullQuery) return 1;
    if (Number.isFinite(nameRank)) return nameRank;

    const matchesShipIdentity = ship.alternateNames.some((name) => includesQuery(name, normalizedQuery))
      || (ship.hullNumber ? normalizeHullNumber(ship.hullNumber).includes(normalizedHullQuery) : false)
      || includesQuery(ship.shipClass, normalizedQuery)
      || includesQuery(ship.typeLabel ?? formatShipType(ship.type), normalizedQuery);
    if (matchesShipIdentity) return 4;

    if (includesQuery(ship.site.name, normalizedQuery)) return 5;

    const matchesLocation = [ship.country, ship.nation, ship.site.city, ship.site.region, ship.site.country]
      .some((value) => includesQuery(value, normalizedQuery));
    if (matchesLocation) return 6;

    return 7;
  };

  const sites = deduplicateById([directSites, broadSites])
    .sort((left, right) => compareRankedNames(left, right, getSiteRank))
    .slice(0, RESULT_LIMIT);
  const ships = deduplicateById([directShips, broadShips])
    .sort((left, right) => compareRankedNames(left, right, getShipRank))
    .slice(0, RESULT_LIMIT);
  const bestSiteRank = sites[0] ? getSiteRank(sites[0]) : Number.POSITIVE_INFINITY;
  const bestShipRank = ships[0] ? getShipRank(ships[0]) : Number.POSITIVE_INFINITY;
  const groupOrder = bestShipRank < bestSiteRank ? ["ships", "sites"] : ["sites", "ships"];

  return NextResponse.json({
    sites: sites.map((site) => ({
      id: site.id,
      slug: site.slug,
      name: site.name,
      location: formatLocation([site.city, site.region, site.country]),
      summary: site.summary,
      shipCount: site._count.ships,
    })),
    ships: ships.map((ship) => ({
      id: ship.id,
      slug: ship.slug,
      name: ship.name,
      type: ship.typeLabel ?? formatShipType(ship.type),
      className: ship.shipClass,
      hullNumber: ship.hullNumber,
      country: ship.country ?? ship.nation,
      siteSlug: ship.site.slug,
      siteName: ship.site.name,
      siteLocation: formatLocation([ship.site.city, ship.site.region, ship.site.country]),
      summary: ship.summary,
    })),
    groupOrder,
  });
}
