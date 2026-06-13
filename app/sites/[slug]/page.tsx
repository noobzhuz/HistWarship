import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Ship as ShipIcon } from "lucide-react";

import { ShipCard } from "@/components/ships/ship-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getShipsAtSite, sites } from "@/lib/mock-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return sites.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const site = sites.find((item) => item.slug === (await params).slug);
  return { title: site?.name ?? "Museum Site" };
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const site = sites.find((item) => item.slug === slug);
  if (!site) notFound();
  const siteShips = getShipsAtSite(site.slug);

  return (
    <div className="pb-20">
      <section className="relative min-h-[430px] overflow-hidden bg-slate-950">
        <Image src={site.image} alt="" fill priority className="object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/35 to-transparent" />
        <div className="relative mx-auto flex min-h-[430px] max-w-7xl flex-col justify-end px-5 py-12 text-white lg:px-8">
          <Button asChild variant="ghost" className="mb-auto w-fit bg-black/20 text-white hover:bg-white/15"><Link href="/map"><ArrowLeft className="size-4" /> Back to map</Link></Button>
          <Badge className="mb-4 w-fit bg-amber-300 text-slate-950"><MapPin className="mr-1 size-3" /> Museum site</Badge>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">{site.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-lg text-slate-200"><MapPin className="size-5" /> {site.city}, {site.country}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_320px] lg:px-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950">About this site</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{site.summary}</p>
          <div className="mt-12 flex items-center gap-3"><ShipIcon className="size-7 text-sky-800" /><h2 className="text-3xl font-black text-slate-950">Ships present</h2></div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">{siteShips.map((ship) => <ShipCard key={ship.id} ship={ship} />)}</div>
        </div>
        <aside>
          <Card className="bg-slate-950 text-white"><CardContent><p className="text-sm font-bold uppercase tracking-widest text-amber-300">Visitor information</p><h2 className="mt-3 text-xl font-bold">Planning details coming soon</h2><p className="mt-3 text-sm leading-6 text-slate-300">Opening hours, accessibility, admission, and official links will be added in a later data-backed phase.</p></CardContent></Card>
        </aside>
      </div>
    </div>
  );
}
