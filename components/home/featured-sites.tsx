import { SiteCard } from "@/components/sites/site-card";
import { sites } from "@/lib/mock-data";

export function FeaturedSites() {
  return <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{sites.slice(0, 3).map((site) => <SiteCard key={site.id} site={site} />)}</div>;
}
