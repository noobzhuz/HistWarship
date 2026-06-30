import { NextResponse } from "next/server";
import type { ShipType } from "@prisma/client";

import { prisma } from "@/lib/prisma";

const MIN_QUERY_LENGTH = 2;
const RESULT_LIMIT = 8;

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatLocation = (parts: Array<string | null>) => parts.filter(Boolean).join(", ");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ sites: [], ships: [] });
  }

  const [sites, ships] = await Promise.all([
    prisma.museumSite.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { city: { contains: query, mode: "insensitive" } },
          { region: { contains: query, mode: "insensitive" } },
          { country: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        region: true,
        country: true,
        summary: true,
      },
      orderBy: { name: "asc" },
      take: RESULT_LIMIT,
    }),
    prisma.ship.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          // TODO: Prisma's array filter only supports exact alternate-name matches here.
          { alternateNames: { has: query } },
          { hullNumber: { contains: query, mode: "insensitive" } },
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
      select: {
        id: true,
        slug: true,
        name: true,
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
          },
        },
      },
      orderBy: { name: "asc" },
      take: RESULT_LIMIT,
    }),
  ]);

  return NextResponse.json({
    sites: sites.map((site) => ({
      id: site.id,
      slug: site.slug,
      name: site.name,
      location: formatLocation([site.city, site.region, site.country]),
      summary: site.summary,
    })),
    ships: ships.map((ship) => ({
      id: ship.id,
      slug: ship.slug,
      name: ship.name,
      type: ship.typeLabel ?? formatShipType(ship.type),
      className: ship.shipClass ?? "Class unknown",
      country: ship.country ?? ship.nation ?? "Unknown",
      siteSlug: ship.site.slug,
      siteName: ship.site.name,
      summary: ship.summary,
    })),
  });
}
