import { CommunityPreview } from "@/components/home/community-preview";
import { MapHero } from "@/components/home/map-hero";
import { getCommunityPreviewPosts, getDiscoveryShips } from "@/lib/home-data";
import { getMapSites } from "@/lib/map-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [mapSites, discoveryShips, communityPreview] = await Promise.all([
    getMapSites(),
    getDiscoveryShips(),
    getCommunityPreviewPosts(),
  ]);

  return (
    <>
      <MapHero sites={mapSites} discoveryShips={discoveryShips} />
      <CommunityPreview preview={communityPreview} />
    </>
  );
}
