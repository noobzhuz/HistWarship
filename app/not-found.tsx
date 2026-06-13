import Link from "next/link";
import { Compass } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-[65vh] place-items-center px-5 text-center"><div><Compass className="mx-auto size-14 text-sky-800" /><p className="mt-5 text-sm font-bold uppercase tracking-widest text-slate-500">404 | Off the chart</p><h1 className="mt-3 text-4xl font-black text-slate-950">We could not find that page.</h1><p className="mt-4 text-slate-600">Try returning to the atlas and choosing another museum site or ship.</p><Button asChild className="mt-7"><Link href="/map">Return to the map</Link></Button></div></div>
  );
}
