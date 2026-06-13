import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, MessagesSquare, Ship } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = { title: "Community" };

const futureSpaces = [
  { icon: Ship, title: "Ship discussions", text: "Ask questions and share knowledge on individual vessel pages." },
  { icon: MessageCircle, title: "Museum conversations", text: "Discuss visits, exhibits, preservation work, and local context." },
  { icon: MessagesSquare, title: "Friendly participation", text: "Posting will require an account, while reading remains open to everyone." },
];

export default function CommunityPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center"><p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-800">Community</p><h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">A place for curious visitors and knowledgeable enthusiasts.</h1><p className="mt-6 text-lg leading-8 text-slate-600">Community features are not active in this initial scaffold. This page previews the simple, welcoming discussions planned for a later phase.</p></div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">{futureSpaces.map(({ icon: Icon, title, text }) => <Card key={title}><CardContent><span className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-800"><Icon className="size-6" /></span><h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-3 leading-7 text-slate-600">{text}</p></CardContent></Card>)}</div>
      <div className="mt-12 text-center"><Button asChild><Link href="/map">Explore the atlas instead</Link></Button></div>
    </div>
  );
}
