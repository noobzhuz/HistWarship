import Link from "next/link";
import { Map, MessageCircle, NotebookText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { CommunityPreviewData, CommunityPreviewPost } from "@/lib/home-data";

type PreviewSection = {
  title: string;
  icon: typeof MessageCircle;
  text: string;
  emptyText: string;
  posts: CommunityPreviewPost[];
};

function PreviewPostList({ posts, emptyText }: { posts: CommunityPreviewPost[]; emptyText: string }) {
  if (posts.length === 0) {
    return <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-slate-500"><Map className="size-4" /> {emptyText}</p>;
  }

  return (
    <div className="mt-5 space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="rounded-2xl border border-slate-200 p-4">
          <h4 className="font-black text-slate-950">{post.title}</h4>
          <p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold text-slate-500">
            <span>{post.authorName}</span>
            {post.targetHref ? (
              <Link href={post.targetHref} className="text-sky-800 hover:underline">{post.targetLabel}</Link>
            ) : (
              <span>{post.targetLabel}</span>
            )}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag.slug} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{tag.name}</span>
              ))}
            </div>
          )}
        </article>
      ))}
      <p className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Map className="size-4" /> Demo-labeled posts are preview content, not real community activity.</p>
    </div>
  );
}

export function CommunityPreview({ preview }: { preview: CommunityPreviewData }) {
  const previews: PreviewSection[] = [
  {
    title: "Recent Discussions",
    icon: MessageCircle,
    text: "Discussion previews will appear here as the community experience is introduced.",
    emptyText: "No published discussion previews yet.",
    posts: preview.discussions,
  },
  {
    title: "Recent Trip Reports",
    icon: NotebookText,
    text: "Trip report previews will help visitors learn from practical, first-hand experiences.",
    emptyText: "No published trip report previews yet.",
    posts: preview.tripReports,
  },
  ];

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20" aria-labelledby="community-preview-heading">
      <div className="max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-sky-800">Community preview</p>
        <h2 id="community-preview-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950">Stories and practical knowledge, below the map</h2>
        <p className="mt-4 leading-7 text-slate-600">These are demo placeholders, not real community activity. Future discussions will remain connected to ships, museums, preservation, and visiting experiences.</p>
      </div>
      <div className="mt-9 grid gap-6 md:grid-cols-2">
        {previews.map(({ title, icon: Icon, text, emptyText, posts }) => (
          <Card key={title} className="border-dashed">
            <CardContent>
              <span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-800"><Icon className="size-6" /></span>
              <div className="mt-5 flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-950">{title}</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Preview only</span>
              </div>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
              <PreviewPostList posts={posts} emptyText={emptyText} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
