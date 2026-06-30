import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin, Ship as ShipIcon } from "lucide-react";
import type { ShipType } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

type SiteShipCardData = {
  id: string;
  slug: string;
  name: string;
  className: string;
  type: string;
  launched: string;
  summary: string;
  image: string;
};

const formatShipType = (type: ShipType) =>
  type
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const formatSiteLocation = (site: {
  city: string | null;
  region: string | null;
  country: string;
}) => [site.city, site.region, site.country].filter(Boolean).join(", ");

const getSiteBySlug = (slug: string) =>
  prisma.museumSite.findUnique({
    where: { slug },
    include: {
      ships: {
        orderBy: { name: "asc" },
      },
    },
  });

function SiteShipCard({ ship }: { ship: SiteShipCardData }) {
  return (
    <Link href={`/ships/${ship.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-800">
          <Image src={ship.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
          <Badge className="absolute left-4 top-4">{ship.type}</Badge>
        </div>
        <CardContent>
          <h3 className="text-xl font-bold text-slate-950 group-hover:text-sky-800">{ship.name}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{ship.className}</p>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{ship.summary}</p>
          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-slate-700"><CalendarDays className="size-4" /> Launched {ship.launched}</p>
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
  const siteShips = site.ships.map((ship) => ({
    id: ship.id,
    slug: ship.slug,
    name: ship.name,
    className: ship.shipClass ?? "Class unknown",
    type: ship.typeLabel ?? formatShipType(ship.type),
    launched: ship.launchedYear?.toString() ?? "Unknown",
    summary: ship.summary,
    image: ship.heroImageUrl ?? "/placeholder-ship.svg",
  }));

  return (
    <div className="pb-20">
      <section className="relative min-h-[430px] overflow-hidden bg-slate-950">
        <Image src={siteImage} alt="" fill priority className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[430px] max-w-7xl flex-col justify-end px-5 py-12 text-white lg:px-8">
          <Button asChild variant="ghost" className="mb-auto w-fit bg-black/20 text-white hover:bg-white/15"><Link href="/map"><ArrowLeft className="size-4" /> Back to map</Link></Button>
          <Badge className="mb-4 w-fit bg-amber-300 text-slate-950"><MapPin className="mr-1 size-3" /> Museum site</Badge>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-lg text-slate-200"><MapPin className="size-5" /> {siteLocation}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950">About this site</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{site.summary}</p>
          <div className="mt-12 flex items-center gap-3"><ShipIcon className="size-7 text-sky-800" /><h2 className="text-3xl font-black text-slate-950">Ships present</h2></div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">{siteShips.map((ship) => <SiteShipCard key={ship.id} ship={ship} />)}</div>
        </div>
        <aside>
          <Card className="bg-slate-950 text-white"><CardContent><p className="text-sm font-bold uppercase tracking-widest text-amber-300">Visitor information</p><h2 className="mt-3 text-xl font-bold">Planning details coming soon</h2><p className="mt-3 text-sm leading-6 text-slate-300">Opening hours, accessibility, admission, and official links will be added in a later data-backed phase.</p></CardContent></Card>
        </aside>
      </div>
    </div>
  );
}
