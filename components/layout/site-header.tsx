import Link from "next/link";
import { Anchor } from "lucide-react";

const navigation = [
  { href: "/map", label: "Explore map" },
  { href: "/community", label: "Community" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 text-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3 font-bold tracking-tight">
          <span className="grid size-9 place-items-center rounded-full bg-amber-400 text-slate-950">
            <Anchor className="size-5" aria-hidden="true" />
          </span>
          <span>Historic Warships Atlas</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-full px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-white sm:px-4">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
