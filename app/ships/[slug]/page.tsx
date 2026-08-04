import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  Anchor,
  ArrowLeft,
  ExternalLink,
  Info,
  MapPin,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import type { ShipType } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };
type InfoItem = { label: string; value: string | number };

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

const formatTechnicalKey = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatSiteLocation = (site: {
  city: string | null;
  region: string | null;
  country: string;
}) => [site.city, site.region, site.country].filter(Boolean).join(", ");

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isYearLikeTechnicalKey = (key: string) => {
  const normalizedKey = key.toLowerCase();

  return ["commissioned", "decommissioned", "launched"].includes(normalizedKey) || normalizedKey.endsWith("year");
};

const formatSimpleValue = (key: string, value: unknown) => {
  if (typeof value === "string") return hasText(value) ? value : null;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return null;

    return isYearLikeTechnicalKey(key) ? value.toString() : value.toLocaleString("en");
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";

  return null;
};

const getTechnicalRows = (technicalInfo: unknown) => {
  if (!isPlainObject(technicalInfo)) return [];

  return Object.entries(technicalInfo)
    .map(([key, value]) => ({
      label: formatTechnicalKey(key),
      value: formatSimpleValue(key, value),
    }))
    .filter((row): row is { label: string; value: string } => row.value !== null);
};

function InfoRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ContentSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>
      <div className="mt-4 text-base leading-8 text-slate-600">{children}</div>
    </section>
  );
}

const getShipBySlug = (slug: string) =>
  prisma.ship.findUnique({
    where: { slug },
    include: { site: true },
  });

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const ship = await prisma.ship.findUnique({
      where: { slug },
      select: { name: true, summary: true },
    });

    return {
      title: ship?.name ?? "Historic Ship",
      description: ship?.summary,
    };
  } catch {
    return { title: "Historic Ship" };
  }
}

export default async function ShipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ship = await getShipBySlug(slug);
  if (!ship) notFound();

  const site = ship.site;
  const shipImage = ship.heroImageUrl ?? "/placeholder-ship.svg";
  const shipType = ship.typeLabel ?? formatShipType(ship.type);
  const shipClass = ship.shipClass ?? "Class unknown";
  const siteImage = site.heroImageUrl ?? "/placeholder-site.svg";
  const siteLocation = formatSiteLocation(site);
  const technicalRows = getTechnicalRows(ship.technicalInfo);
  const statusUpdatedAt = formatDate(ship.statusUpdatedAt);
  const expectedReopenDate = formatDate(ship.expectedReopenDate);
  const expectedReopen = cleanText(ship.expectedReopenText) ?? expectedReopenDate;
  const hullNumber = cleanText(ship.hullNumber);
  const className = cleanText(ship.shipClass);
  const countryName = cleanText(ship.country) ?? cleanText(ship.nation);
  const statusSourceUrl = cleanText(ship.statusSourceUrl);
  const officialWebsite = cleanText(ship.officialWebsite);
  const wikipediaUrl = cleanText(ship.wikipediaUrl);
  const showVisitStatus =
    ship.openStatus !== "UNKNOWN" ||
    hasText(ship.statusNote) ||
    hasText(ship.expectedReopenText) ||
    Boolean(ship.expectedReopenDate) ||
    Boolean(statusSourceUrl);
  const sourceLinks = [
    officialWebsite ? { label: "Official website", href: officialWebsite } : null,
    wikipediaUrl ? { label: "Wikipedia", href: wikipediaUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);
  const showSources = sourceLinks.length > 0 || hasText(ship.sourceNotes);
  const rawKeyFacts: Array<InfoItem | null> = [
    hullNumber ? { label: "Hull number", value: hullNumber } : null,
    className ? { label: "Class", value: className } : null,
    { label: "Vessel type", value: shipType },
    countryName ? { label: "Country", value: countryName } : null,
    ship.launchedYear ? { label: "Launched", value: ship.launchedYear } : null,
    ship.commissionedYear ? { label: "Commissioned", value: ship.commissionedYear } : null,
    ship.decommissionedYear ? { label: "Decommissioned", value: ship.decommissionedYear } : null,
    ship.preservationStatus !== "UNKNOWN"
      ? { label: "Preservation", value: formatEnumLabel(ship.preservationStatus) }
      : null,
  ];
  const keyFacts = rawKeyFacts.filter((fact): fact is InfoItem => fact !== null);

  return (
    <div className="pb-20">
      <section className="relative min-h-[460px] overflow-hidden bg-slate-950">
        <Image src={shipImage} alt="" fill priority className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-end px-5 py-12 text-white lg:px-8">
          {site && <Button asChild variant="ghost" className="mb-auto w-fit bg-black/20 text-white hover:bg-white/15"><Link href={`/sites/${site.slug}`}><ArrowLeft className="size-4" /> Back to museum site</Link></Button>}
          <Badge className="mb-4 w-fit">{shipType}</Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">{ship.name}</h1>
          <p className="mt-3 text-xl text-slate-200">{shipClass}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950">The ship</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{ship.summary}</p>
          {hasText(ship.overview) && <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{ship.overview}</p>}

          {hasText(ship.whyVisit) && (
            <section className="mt-10 rounded-3xl border border-amber-200 bg-amber-50 p-8">
              <p className="text-sm font-bold uppercase tracking-widest text-amber-700">Why visit</p>
              <p className="mt-4 text-xl font-semibold leading-9 text-slate-950">{ship.whyVisit}</p>
            </section>
          )}

          {keyFacts.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3">
                <Anchor className="size-6 text-sky-800" />
                <h2 className="text-2xl font-black text-slate-950">Key facts</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {keyFacts.map((fact) => <InfoRow key={fact.label} label={fact.label} value={fact.value} />)}
              </div>
            </section>
          )}

          {showVisitStatus && (
            <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-8">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-6 text-sky-800" />
                <h2 className="text-2xl font-black text-slate-950">Visit status</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoRow label="Open status" value={formatEnumLabel(ship.openStatus)} />
                {expectedReopen && <InfoRow label="Expected reopen" value={expectedReopen} />}
                {statusUpdatedAt && <InfoRow label="Last updated" value={statusUpdatedAt} />}
              </div>
              {hasText(ship.statusNote) && <p className="mt-5 leading-8 text-slate-600">{ship.statusNote}</p>}
              {statusSourceUrl && (
                <a
                  href={statusSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-sky-800 hover:underline"
                >
                  Status source <ExternalLink className="size-4" />
                </a>
              )}
            </section>
          )}

          {hasText(ship.visitorNotes) && (
            <ContentSection title="Visitor notes">
              <p>{ship.visitorNotes}</p>
            </ContentSection>
          )}

          {hasText(ship.history) && (
            <ContentSection title="History">
              <p>{ship.history}</p>
            </ContentSection>
          )}

          {technicalRows.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center gap-3">
                <Wrench className="size-6 text-sky-800" />
                <h2 className="text-2xl font-black text-slate-950">Technical information</h2>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {technicalRows.map((row) => <InfoRow key={row.label} label={row.label} value={row.value} />)}
              </div>
            </section>
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
              {hasText(ship.sourceNotes) && <p className="mt-5 leading-8 text-slate-600">{ship.sourceNotes}</p>}
            </section>
          )}

          <section className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <h2 className="text-2xl font-black">Discussions</h2>
            <p className="mt-3 text-slate-600">Ship-specific community conversations will appear here in a later phase.</p>
          </section>
        </div>
        {site && <aside><Card className="overflow-hidden"><div className="relative aspect-video"><Image src={siteImage} alt="" fill className="object-cover" /></div><CardContent><p className="text-sm font-bold uppercase tracking-widest text-sky-800">Where to visit</p><h2 className="mt-2 text-xl font-black">{site.name}</h2><p className="mt-2 flex gap-2 text-sm text-slate-600"><MapPin className="size-4 shrink-0" /> {siteLocation}</p><Button asChild className="mt-5 w-full"><Link href={`/sites/${site.slug}`}>View museum site</Link></Button></CardContent></Card></aside>}
      </div>
    </div>
  );
}
