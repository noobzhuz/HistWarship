import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Anchor, ArrowLeft, CalendarDays, Globe2, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getSite, ships } from "@/lib/mock-data";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ships.map((ship) => ({ slug: ship.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const ship = ships.find((item) => item.slug === (await params).slug);
  return { title: ship?.name ?? "Historic Ship" };
}

export default async function ShipDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const ship = ships.find((item) => item.slug === slug);
  if (!ship) notFound();
  const site = getSite(ship.siteSlug);

  return (
    <div className="pb-20">
      <section className="relative min-h-[460px] overflow-hidden bg-slate-950">
        <Image src={ship.image} alt="" fill priority className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
        <div className="relative mx-auto flex min-h-[460px] max-w-7xl flex-col justify-end px-5 py-12 text-white lg:px-8">
          {site && <Button asChild variant="ghost" className="mb-auto w-fit bg-black/20 text-white hover:bg-white/15"><Link href={`/sites/${site.slug}`}><ArrowLeft className="size-4" /> Back to museum site</Link></Button>}
          <Badge className="mb-4 w-fit">{ship.type}</Badge>
          <h1 className="text-5xl font-black tracking-tight sm:text-7xl">{ship.name}</h1>
          <p className="mt-3 text-xl text-slate-200">{ship.className}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1fr_340px] lg:px-8">
        <div>
          <h2 className="text-3xl font-black text-slate-950">The ship</h2>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{ship.summary}</p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <Card><CardContent><CalendarDays className="size-6 text-sky-800" /><p className="mt-4 text-sm text-slate-500">Launched</p><p className="text-xl font-bold">{ship.launched}</p></CardContent></Card>
            <Card><CardContent><Anchor className="size-6 text-sky-800" /><p className="mt-4 text-sm text-slate-500">Vessel type</p><p className="text-xl font-bold">{ship.type}</p></CardContent></Card>
            <Card><CardContent><Globe2 className="size-6 text-sky-800" /><p className="mt-4 text-sm text-slate-500">Country</p><p className="text-xl font-bold">{ship.country}</p></CardContent></Card>
          </div>
          <section className="mt-12 rounded-3xl border border-dashed border-slate-300 bg-white p-8">
            <h2 className="text-2xl font-black">Discussions</h2>
            <p className="mt-3 text-slate-600">Ship-specific community conversations will appear here in a later phase.</p>
          </section>
        </div>
        {site && <aside><Card className="overflow-hidden"><div className="relative aspect-video"><Image src={site.image} alt="" fill className="object-cover" /></div><CardContent><p className="text-sm font-bold uppercase tracking-widest text-sky-800">Where to visit</p><h2 className="mt-2 text-xl font-black">{site.name}</h2><p className="mt-2 flex gap-2 text-sm text-slate-600"><MapPin className="size-4 shrink-0" /> {site.city}, {site.country}</p><Button asChild className="mt-5 w-full"><Link href={`/sites/${site.slug}`}>View museum site</Link></Button></CardContent></Card></aside>}
      </div>
    </div>
  );
}
