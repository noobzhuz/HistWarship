import Image from "next/image";
import Link from "next/link";
import { MapPin, ShipWheel } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { MuseumSite } from "@/lib/types";

export function SiteCard({ site }: { site: MuseumSite }) {
  return (
    <Link href={`/sites/${site.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-sky-950">
          <Image src={site.image} alt="" fill className="object-cover transition duration-500 group-hover:scale-105" />
          <Badge className="absolute left-4 top-4 bg-white/90 text-slate-900"><MapPin className="mr-1 size-3" /> Museum site</Badge>
        </div>
        <CardContent>
          <h3 className="text-xl font-bold text-slate-950 group-hover:text-sky-800">{site.name}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">{site.city}, {site.country}</p>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{site.summary}</p>
          <p className="mt-5 flex items-center gap-2 text-sm font-bold text-sky-800"><ShipWheel className="size-4" /> {site.shipSlugs.length} preserved {site.shipSlugs.length === 1 ? "ship" : "ships"}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
