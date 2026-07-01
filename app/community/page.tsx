import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Map, MessageCircle, MessagesSquare, NotebookText, Ship } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCommunityPagePosts, type CommunityPostCard } from "@/lib/community-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Community" };

const futureSpaces = [
  { icon: Ship, title: "Ship discussions", text: "Read questions and shared knowledge connected to individual vessel pages." },
  { icon: MessageCircle, title: "Museum conversations", text: "Follow visit planning, exhibits, preservation work, and local context." },
  { icon: MessagesSquare, title: "Friendly participation", text: "Posting will require an account later, while reading remains open to everyone." },
];

type CommunitySection = {
  title: string;
  icon: LucideIcon;
  text: string;
  emptyText: string;
  posts: CommunityPostCard[];
};

function PostList({ posts, emptyText }: { posts: CommunityPostCard[]; emptyText: string }) {
  if (posts.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-600">
          <Map className="size-4" />
          {emptyText}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {posts.map((post) => (
        <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-slate-100 text-slate-700">{post.targetKind}</Badge>
            <span className="text-xs font-semibold text-slate-500">{post.createdAtLabel}</span>
          </div>
          <h3 className="mt-3 text-xl font-black tracking-tight text-slate-950">{post.title}</h3>
          <p className="mt-3 leading-7 text-slate-600">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-semibold text-slate-500">
            <span>{post.authorName}</span>
            {post.targetHref ? (
              <Link href={post.targetHref} className="text-sky-800 hover:underline">
                {post.targetLabel}
              </Link>
            ) : (
              <span>{post.targetLabel}</span>
            )}
            {post.contextLabel && <span>{post.contextLabel}</span>}
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag.slug} className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
}

export default async function CommunityPage() {
  const community = await getCommunityPagePosts();
  const hasPosts = community.discussions.length > 0 || community.tripReports.length > 0;
  const sections: CommunitySection[] = [
    {
      title: "Published discussions",
      icon: MessageCircle,
      text: "Questions and conversations stay connected to ships, museum sites, preservation, and visits.",
      emptyText: "No published discussions yet.",
      posts: community.discussions,
    },
    {
      title: "Published trip reports",
      icon: NotebookText,
      text: "Trip reports will help future visitors learn from practical first-hand experiences.",
      emptyText: "No published trip reports yet.",
      posts: community.tripReports,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-sky-800">Community</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
          A place for curious visitors and knowledgeable enthusiasts.
        </h1>
        <p className="mt-6 text-lg leading-8 text-slate-600">
          This page previews published discussions and trip reports from the database. Posting is not active in V1 yet, and demo-labeled posts are preview content rather than real community activity.
        </p>
      </div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {futureSpaces.map(({ icon: Icon, title, text }) => (
          <Card key={title}>
            <CardContent>
              <span className="grid size-12 place-items-center rounded-2xl bg-amber-100 text-amber-800">
                <Icon className="size-6" />
              </span>
              <h2 className="mt-5 text-xl font-black">{title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!hasPosts && (
        <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <h2 className="text-2xl font-black tracking-tight text-slate-950">No published community posts yet.</h2>
          <p className="mt-3 leading-7 text-slate-600">
            Reading will remain open to guests. Posting, commenting, uploads, and edit proposals are planned for later work and are not implemented here.
          </p>
        </div>
      )}

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {sections.map(({ title, icon: Icon, text, emptyText, posts }) => (
          <section key={title} aria-labelledby={`${title.toLowerCase().replaceAll(" ", "-")}-heading`}>
            <Card className="h-full">
              <CardContent>
                <span className="grid size-12 place-items-center rounded-2xl bg-sky-100 text-sky-800">
                  <Icon className="size-6" />
                </span>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <h2 id={`${title.toLowerCase().replaceAll(" ", "-")}-heading`} className="text-xl font-black text-slate-950">
                    {title}
                  </h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">Preview only</span>
                </div>
                <p className="mt-3 leading-7 text-slate-600">{text}</p>
                <PostList posts={posts} emptyText={emptyText} />
              </CardContent>
            </Card>
          </section>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button asChild>
          <Link href="/map">Explore the atlas instead</Link>
        </Button>
      </div>
    </div>
  );
}
