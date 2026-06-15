"use client";

import Link from "next/link";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

import { getShipsAtSite, sites } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const poiIcon = L.divIcon({
  className: "atlas-marker",
  html: '<svg aria-hidden="true" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg"><path d="M16 1.5C8.27 1.5 2 7.77 2 15.5 2 26 16 42.5 16 42.5S30 26 30 15.5C30 7.77 23.73 1.5 16 1.5Z" fill="#fbbf24" stroke="#ffffff" stroke-width="3"/><circle cx="16" cy="15.5" r="5.5" fill="#0f172a"/></svg>',
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -40],
});

const siteBounds = L.latLngBounds(sites.map((site) => site.coordinates));
const discreteWheelLockMs = 180;
const discreteSequenceGapMs = 120;
const discretePixelThreshold = 40;
const discreteZoomStep = 0.5;

function fitGlobalView(map: L.Map) {
  map.fitBounds(siteBounds, {
    paddingTopLeft: [40, 40],
    paddingBottomRight: [40, 40],
    maxZoom: 3,
  });
}

function MapController({ selectedSiteSlug }: { selectedSiteSlug?: string }) {
  const map = useMap();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      map.invalidateSize();
      fitGlobalView(map);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [map]);

  useEffect(() => {
    const site = sites.find((candidate) => candidate.slug === selectedSiteSlug);
    if (site) map.flyTo(site.coordinates, 7, { duration: 1.1 });
  }, [map, selectedSiteSlug]);

  return null;
}

function InputAwareWheelZoom() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let lastDiscreteEventAt = -Infinity;
    let lastZoomAt = -Infinity;
    let lastDirection = 0;

    const handleWheel = (event: WheelEvent) => {
      const now = performance.now();
      const direction = event.deltaY < 0 ? 1 : event.deltaY > 0 ? -1 : 0;
      if (!direction) return;

      const hasDiscreteDelta = event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || Math.abs(event.deltaY) >= discretePixelThreshold;
      const continuesDiscreteSequence = now - lastDiscreteEventAt < discreteSequenceGapMs;
      const isLockedDiscreteDirection = direction === lastDirection && now - lastZoomAt < discreteWheelLockMs;

      if (!hasDiscreteDelta && !continuesDiscreteSequence && !isLockedDiscreteDirection) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      lastDiscreteEventAt = now;

      const directionChanged = lastDirection !== 0 && direction !== lastDirection;
      if (!directionChanged && now - lastZoomAt < discreteWheelLockMs) return;

      const currentZoom = map.getZoom();
      const targetZoom = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), currentZoom + direction * discreteZoomStep));

      lastDirection = direction;
      lastZoomAt = now;

      if (targetZoom !== currentZoom) {
        const cursorPoint = map.mouseEventToContainerPoint(event);
        map.setZoomAround(cursorPoint, targetZoom);
      }
    };

    container.addEventListener("wheel", handleWheel, { capture: true, passive: false });

    return () => container.removeEventListener("wheel", handleWheel, { capture: true });
  }, [map]);

  return null;
}

function ResetViewControl() {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => fitGlobalView(map)}
      className="absolute bottom-8 right-3 z-[800] rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      Reset view
    </button>
  );
}

type AtlasMapProps = {
  compact?: boolean;
  hero?: boolean;
  selectedSiteSlug?: string;
};

export function AtlasMap({ compact = false, hero = false, selectedSiteSlug }: AtlasMapProps) {
  return (
    <MapContainer
      center={[35, 5]}
      zoom={compact ? 2 : 3}
      minZoom={1}
      maxBounds={[[-85, -190], [85, 190]]}
      maxBoundsViscosity={0.8}
      scrollWheelZoom={!compact}
      zoomSnap={0.25}
      zoomDelta={0.25}
      wheelPxPerZoomLevel={240}
      className={cn("z-0 w-full", compact ? "h-[430px] rounded-3xl" : hero ? "atlas-map-hero h-[54svh] min-h-[430px] lg:h-full lg:min-h-[680px]" : "h-[calc(100vh-4rem)]")}
    >
      <MapController selectedSiteSlug={selectedSiteSlug} />
      {!compact && <InputAwareWheelZoom />}
      {!compact && <ResetViewControl />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => {
        const siteShips = getShipsAtSite(site.slug);
        return (
          <Marker key={site.id} position={site.coordinates} icon={poiIcon}>
            <Popup minWidth={240}>
              <div className="space-y-2 font-sans">
                <p className="text-base font-bold text-slate-950">{site.name}</p>
                <p className="text-sm text-slate-600">{site.city}, {site.country}</p>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ships here</p>
                <ul className="space-y-1">
                  {siteShips.map((ship) => <li key={ship.id}><Link className="font-semibold text-sky-800 hover:underline" href={`/ships/${ship.slug}`}>{ship.name}</Link></li>)}
                </ul>
                <Link className="inline-block pt-1 font-bold text-sky-800 hover:underline" href={`/sites/${site.slug}`}>View museum site</Link>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
