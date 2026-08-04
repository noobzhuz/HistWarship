import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Accessibility,
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  Info,
  MapPin,
  ShieldCheck,
  Ship as ShipIcon,
} from "lucide-react";
import type { OpenStatus, PreservationStatus, ShipType } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

type SiteShipCardData = {
  slug: string;
  name: string;
  className: string | null;
  hullNumber: string | null;
  type: string;
  launchedYear: number | null;
  summary: string;
  image: string;
  preservationStatus: PreservationStatus;
  openStatus: OpenStatus;
};

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const hasText = (value: string | null | undefined) => Boolean(value?.trim());

const cleanText = (value: string | null | undefined) => {
  const trimmedValue = value?.trim();

  return trimmedValue ? trimmedValue : null;
};

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatEnumLabel = (value: string) =>
  value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatDate = (date: Date | null | undefined) => (date ? dateFormatter.format(date) : null);

const formatVisitDuration = (minutes: number | null) => {
  if (!minutes || minutes <= 0) return null;
  if (minutes < 60) return `About ${minutes} minutes`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) return `About ${hours} ${hours === 1 ? "hour" : "hours"}`;

  return `About ${hours} hr ${remainingMinutes} min`;
};

const buildLocationLink = (site: {
  address: string | null;
  latitude: { toString(): string };
  longitude: { toString(): string };
}) => {
  const address = cleanText(site.address);

  if (address) {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  }

  const latitude = site.latitude.toString();
  const longitude = site.longitude.toString();

  return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(latitude)}&mlon=${encodeURIComponent(longitude)}#map=16/${encodeURIComponent(latitude)}/${encodeURIComponent(longitude)}`;
};

const normalizeComparableText = (value: string) => value.trim().replace(/\s+/g, " ").toLocaleLowerCase("en");

const formatSiteLocation = (site: {
  city: string | null;
  region: string | null;
  country: string;
}) => [site.city, site.region, site.country].filter(Boolean).join(", ");

const getSiteBySlug = (slug: string) =>
  prisma.museumSite.findUnique({
    where: { slug },
    select: {
      name: true,
      summary: true,
      description: true,
      city: true,
      region: true,
      country: true,
      address: true,
      latitude: true,
      longitude: true,
      visitorInfo: true,
      accessibilityNotes: true,
      visitDurationMinutes: true,
      officialWebsite: true,
      wikipediaUrl: true,
      sourceNotes: true,
      openStatus: true,
      statusNote: true,
      statusUpdatedAt: true,
      expectedReopenDate: true,
      expectedReopenText: true,
      statusSourceUrl: true,
      heroImageUrl: true,
      ships: {
        orderBy: { name: "asc" },
        select: {
          slug: true,
          name: true,
          heroImageUrl: true,
          type: true,
          typeLabel: true,
          shipClass: true,
          hullNumber: true,
          launchedYear: true,
          summary: true,
          preservationStatus: true,
          openStatus: true,
        },
      },
    },
  });

function ExternalTextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 text-sm font-bold text-sky-800 hover:underline"
    >
      {children} <ExternalLink className="size-4" />
    </a>
  );
}

function SiteShipCard({ ship }: { ship: SiteShipCardData }) {
  const shipDetails = [ship.hullNumber, ship.className].filter(Boolean).join(" · ");
  const statusLabels = [
    ship.preservationStatus !== "UNKNOWN" ? formatEnumLabel(ship.preservationStatus) : null,
    ship.openStatus !== "UNKNOWN" ? formatEnumLabel(ship.openStatus) : null,
  ].filter((label): label is string => label !== null);

  return (
    <Link href={`/ships/${ship.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
          <Image src={ship.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
          <Badge className="absolute left-4 top-4">{ship.type}</Badge>
        </div>
        <CardContent>
          <h3 className="text-xl font-bold text-slate-950 group-hover:text-sky-800">{ship.name}</h3>
          {shipDetails && <p className="mt-1 text-sm font-medium text-slate-500">{shipDetails}</p>}
          {statusLabels.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {statusLabels.map((label) => <Badge key={label} className="bg-slate-100 text-slate-700">{label}</Badge>)}
            </div>
          )}
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{ship.summary}</p>
          {ship.launchedYear && (
            <p className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-700">
              <CalendarDays className="size-4" /> Launched {ship.launchedYear}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const site = await prisma.museumSite.findUnique({
      where: { slug },
      select: { name: true, summary: true },
    });

    return {
      title: site?.name ?? "Museum Site",
      description: site?.summary,
    };
  } catch {
    return { title: "Museum Site" };
  }
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const site = await getSiteBySlug(slug);
  if (!site) notFound();

  const siteImage = site.heroImageUrl ?? "/placeholder-site.svg";
  const siteLocation = formatSiteLocation(site);
  const description = cleanText(site.description);
  const showDescription = description && normalizeComparableText(description) !== normalizeComparableText(site.summary);
  const visitorInfo = cleanText(site.visitorInfo);
  const accessibilityNotes = cleanText(site.accessibilityNotes);
  const address = cleanText(site.address);
  const officialWebsite = cleanText(site.officialWebsite);
  const wikipediaUrl = cleanText(site.wikipediaUrl);
  const statusSourceUrl = cleanText(site.statusSourceUrl);
  const visitDuration = formatVisitDuration(site.visitDurationMinutes);
  const locationLink = buildLocationLink(site);
  const statusUpdatedAt = formatDate(site.statusUpdatedAt);
  const expectedReopenDate = formatDate(site.expectedReopenDate);
  const expectedReopenText = cleanText(site.expectedReopenText);
  const expectedReopen = expectedReopenText ?? expectedReopenDate;
  const showVisitStatus =
    site.openStatus !== "UNKNOWN" ||
    hasText(site.statusNote) ||
    Boolean(expectedReopen) ||
    Boolean(statusUpdatedAt) ||
    Boolean(statusSourceUrl);
  const showVisitorInformation = Boolean(address || visitorInfo || accessibilityNotes || visitDuration || officialWebsite);
  const sourceLinks = [
    officialWebsite ? { label: "Official website", href: officialWebsite } : null,
    wikipediaUrl ? { label: "Wikipedia", href: wikipediaUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);
  const showSources = sourceLinks.length > 0 || hasText(site.sourceNotes);
  const siteShips: SiteShipCardData[] = site.ships.map((ship) => ({
    slug: ship.slug,
    name: ship.name,
    className: cleanText(ship.shipClass),
    hullNumber: cleanText(ship.hullNumber),
    type: cleanText(ship.typeLabel) ?? formatShipType(ship.type),
    launchedYear: ship.launchedYear,
    summary: ship.summary,
    image: ship.heroImageUrl ?? "/placeholder-ship.svg",
    preservationStatus: ship.preservationStatus,
    openStatus: ship.openStatus,
  }));

  return (
    <div className="pb-20">
      <section className="relative min-h-[430px] overflow-hidden bg-slate-950">
        <Image src={siteImage} alt="" fill priority className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[430px] max-w-7xl flex-col justify-end px-5 py-12 text-white lg:px-8">
          <Button asChild variant="ghost" className="mb-auto w-fit bg-black/20 text-white hover:bg-white/15">
            <Link href="/map"><ArrowLeft className="size-4" /> Back to map</Link>
          </Button>
          <Badge className="mb-4 w-fit bg-amber-300 text-slate-950"><MapPin className="mr-1 size-3" /> Museum site</Badge>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-lg text-slate-200"><MapPin className="size-5" /> {siteLocation}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_340px] lg:px-8">
        <main>
          <h2 className="text-3xl font-black text-slate-950">About this site</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{site.summary}</p>
          {showDescription && <p className="mt-5 max-w-3xl whitespace-pre-line text-base leading-8 text-slate-600">{description}</p>}

          {showVisitStatus && (
            <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-6 text-sky-800" />
                <h2 className="text-2xl font-black text-slate-950">Visit status</h2>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Badge className="bg-slate-100 text-slate-800">
                  {site.openStatus === "UNKNOWN" ? "Status not confirmed" : formatEnumLabel(site.openStatus)}
                </Badge>
                {expectedReopen && <Badge className="bg-amber-100 text-amber-900">Expected reopen: {expectedReopen}</Badge>}
              </div>
              {hasText(site.statusNote) && <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">{site.statusNote}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                {statusUpdatedAt && <p className="text-sm text-slate-500">Status updated {statusUpdatedAt}</p>}
                {statusSourceUrl && <ExternalTextLink href={statusSourceUrl}>Check current status</ExternalTextLink>}
              </div>
            </section>
          )}

          <div className="mt-12 flex items-center gap-3">
            <ShipIcon className="size-7 text-sky-800" />
            <h2 className="text-3xl font-black text-slate-950">Ships present</h2>
          </div>
          {siteShips.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {siteShips.map((ship) => <SiteShipCard key={ship.slug} ship={ship} />)}
            </div>
          ) : (
            <p className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 text-slate-600">
              No ships are currently listed for this museum site.
            </p>
          )}

          {showSources && (
            <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <Info className="size-6 text-sky-800" />
                <h2 className="text-2xl font-black text-slate-950">Sources and links</h2>
              </div>
              {sourceLinks.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  {sourceLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-100"
                    >
                      {link.label} <ExternalLink className="size-4" />
                    </a>
                  ))}
                </div>
              )}
              {hasText(site.sourceNotes) && <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">{site.sourceNotes}</p>}
            </section>
          )}
        </main>

        {showVisitorInformation && (
          <aside>
            <Card className="sticky top-6 overflow-hidden bg-slate-950 text-white">
              <CardContent>
                <p className="text-sm font-bold uppercase tracking-widest text-amber-300">Plan your visit</p>
                {address && (
                  <div className="mt-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Address</p>
                    <p className="mt-2 flex gap-2 text-sm leading-6 text-slate-200"><MapPin className="mt-1 size-4 shrink-0" /> {address}</p>
                  </div>
                )}
                {visitDuration && (
                  <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-200"><Clock3 className="size-4" /> {visitDuration}</p>
                )}
                {visitorInfo && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-300">{visitorInfo}</p>}
                {accessibilityNotes && (
                  <div className="mt-6 border-t border-slate-700 pt-5">
                    <p className="flex items-center gap-2 text-sm font-bold text-white"><Accessibility className="size-4" /> Accessibility</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-300">{accessibilityNotes}</p>
                  </div>
                )}
                <div className="mt-6 grid gap-3">
                  {officialWebsite && <Button asChild className="w-full"><a href={officialWebsite} target="_blank" rel="noreferrer">Official website <ExternalLink className="size-4" /></a></Button>}
                  <Button asChild variant="outline" className="w-full"><a href={locationLink} target="_blank" rel="noreferrer">View location <ExternalLink className="size-4" /></a></Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        )}
      </div>
    </div>
  );
}
