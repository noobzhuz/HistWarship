import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>Warship Explorer | A friendly guide to preserved naval history.</p>
        <div className="flex gap-5">
          <Link href="/map" className="font-semibold text-slate-800 hover:text-sky-800">Map</Link>
          <Link href="/community" className="font-semibold text-slate-800 hover:text-sky-800">Community</Link>
        </div>
      </div>
    </footer>
  );
}
