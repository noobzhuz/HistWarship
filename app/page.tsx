import { CommunityPreview } from "@/components/home/community-preview";
import { MapHero } from "@/components/home/map-hero";
import { getMapSites } from "@/lib/map-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const mapSites = await getMapSites();

  return (
    <>
      <MapHero sites={mapSites} />
      <CommunityPreview />
    </>
  );
}
