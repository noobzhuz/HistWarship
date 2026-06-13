import { Map, MessageCircle, NotebookText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const previews = [
  {
    title: "Recent Discussions",
    icon: MessageCircle,
    text: "Discussion previews will appear here as the community experience is introduced.",
  },
  {
    title: "Recent Trip Reports",
    icon: NotebookText,
    text: "Trip report previews will help visitors learn from practical, first-hand experiences.",
  },
];

export function CommunityPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20" aria-labelledby="community-preview-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-sky-800">Community preview</p>
        <h2 id="community-preview-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Stories and practical knowledge, below the map</h2>
        <p className="mt-4 leading-7 text-slate-600">These are demo placeholders, not real community activity. Future discussions will remain connected to ships, museums, preservation, and visiting experiences.</p>
      </div>
      <div className="mt-9 grid gap-6 md:grid-cols-2">
        {previews.map(({ title, icon: Icon, text }) => (
          <Card key={title} className="border-dashed">
            <CardContent>
              <span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-800"><Icon className="size-6" /></span>
              <div className="mt-5 flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-950">{title}</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Preview only</span>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
              <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500"><Map className="size-4" /> No demo posts are being presented as real activity.</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
