import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Ship } from "@/lib/types";

export function ShipCard({ ship }: { ship: Ship }) {
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
