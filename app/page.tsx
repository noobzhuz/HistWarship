import { CommunityPreview } from "@/components/home/community-preview";
import { MapHero } from "@/components/home/map-hero";
import { getDiscoveryShips } from "@/lib/home-data";
import { getMapSites } from "@/lib/map-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [mapSites, discoveryShips] = await Promise.all([
    getMapSites(),
    getDiscoveryShips(),
  ]);

  return (
    <>
      <MapHero sites={mapSites} discoveryShips={discoveryShips} />
      <CommunityPreview />
    </>
  );
}
