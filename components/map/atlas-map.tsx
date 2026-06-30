"use client";

import Link from "next/link";
import L from "leaflet";
import { useCallback, useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap, useMapEvents } from "react-leaflet";

import type { AtlasMapSite } from "@/lib/map-data";
import { cn } from "@/lib/utils";

const poiIcon = L.divIcon({
  className: "atlas-marker",
  html: '<svg aria-hidden="true" viewBox="0 0 32 44" xmlns="http://www.w3.org/2000/svg"><path d="M16 1.5C8.27 1.5 2 7.77 2 15.5 2 26 16 42.5 16 42.5S30 26 30 15.5C30 7.77 23.73 1.5 16 1.5Z" fill="#fbbf24" stroke="#ffffff" stroke-width="3"/><circle cx="16" cy="15.5" r="5.5" fill="#0f172a"/></svg>',
  iconSize: [32, 44],
  iconAnchor: [16, 44],
  popupAnchor: [0, -40],
});

const discreteSequenceGapMs = 120;
const discretePixelThreshold = 40;
const discreteWheelZoomScale = 0.001;
const discreteWheelDecay = 0.55;
const discreteWheelStopThreshold = 0.5;
const discreteWheelMaxDelta = 240;
const discreteWheelMaxZoomPerFrame = 0.16;
const siteLabelZoom = 5;
const sliderMaxZoom = 18;
const sliderZoomStep = 0.1;
const mapZoomSnap = 0.01;

function getSiteBounds(sites: AtlasMapSite[]) {
  if (sites.length === 0) return undefined;

  return L.latLngBounds(sites.map((site) => site.coordinates));
}

function formatSiteLocation(site: AtlasMapSite) {
  return [site.city, site.region, site.country].filter(Boolean).join(", ");
}

function fitGlobalView(map: L.Map, sites: AtlasMapSite[]) {
  const siteBounds = getSiteBounds(sites);
  if (!siteBounds) return;

  map.fitBounds(siteBounds, {
    paddingTopLeft: [40, 40],
    paddingBottomRight: [40, 40],
    maxZoom: 3,
  });
}

function MapController({ sites, selectedSiteSlug }: { sites: AtlasMapSite[]; selectedSiteSlug?: string }) {
  const map = useMap();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      map.invalidateSize();
      fitGlobalView(map, sites);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [map, sites]);

  useEffect(() => {
    const site = sites.find((candidate) => candidate.slug === selectedSiteSlug);
    if (site) map.flyTo(site.coordinates, 7, { duration: 1.1 });
  }, [map, selectedSiteSlug, sites]);

  return null;
}

function InputAwareWheelZoom() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    let lastDiscreteEventAt = -Infinity;
    let wheelDelta = 0;
    let cursorPoint: L.Point | undefined;
    let animationFrame: number | undefined;
    let previousFrameAt: number | undefined;

    const animateWheelZoom = (now: number) => {
      const elapsedFrames = previousFrameAt === undefined ? 1 : Math.min((now - previousFrameAt) / (1000 / 60), 4);
      previousFrameAt = now;

      const scaledFrameDelta = wheelDelta * discreteWheelZoomScale * elapsedFrames;
      const frameDelta = Math.max(-discreteWheelMaxZoomPerFrame, Math.min(discreteWheelMaxZoomPerFrame, scaledFrameDelta));
      const currentZoom = map.getZoom();
      const targetZoom = Math.min(map.getMaxZoom(), Math.max(map.getMinZoom(), currentZoom - frameDelta));

      if (cursorPoint && targetZoom !== currentZoom) {
        map.setZoomAround(cursorPoint, targetZoom, { animate: false });
      }

      wheelDelta *= Math.pow(discreteWheelDecay, elapsedFrames);

      if (Math.abs(wheelDelta) >= discreteWheelStopThreshold && targetZoom !== currentZoom) {
        animationFrame = window.requestAnimationFrame(animateWheelZoom);
      } else {
        wheelDelta = 0;
        animationFrame = undefined;
        previousFrameAt = undefined;
      }
    };

    const handleWheel = (event: WheelEvent) => {
      if (event.target instanceof Element && event.target.closest(".atlas-zoom-slider-control")) return;

      const now = performance.now();
      if (!event.deltaY) return;

      const hasDiscreteDelta = event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || Math.abs(event.deltaY) >= discretePixelThreshold;
      const continuesDiscreteSequence = now - lastDiscreteEventAt < discreteSequenceGapMs;

      if (!hasDiscreteDelta && !continuesDiscreteSequence) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      lastDiscreteEventAt = now;

      const deltaModeScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 20 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? 60 : 1;
      const normalizedDelta = event.deltaY * deltaModeScale;
      wheelDelta += Math.max(-discreteWheelMaxDelta, Math.min(discreteWheelMaxDelta, normalizedDelta));
      cursorPoint = map.mouseEventToContainerPoint(event);

      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(animateWheelZoom);
      }
    };

    container.addEventListener("wheel", handleWheel, { capture: true, passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel, { capture: true });
      if (animationFrame !== undefined) window.cancelAnimationFrame(animationFrame);
    };
  }, [map]);

  return null;
}

function ZoomSliderControl({ zoom }: { zoom: number }) {
  const map = useMap();
  const controlRef = useRef<HTMLDivElement>(null);
  const [sliderZoom, setSliderZoom] = useState(zoom);
  const draggingRef = useRef(false);
  const minZoom = map.getMinZoom();
  const maxZoom = Math.max(sliderMaxZoom, Math.ceil(zoom));
  const zoomPercent = Math.round(100 + (sliderZoom - minZoom) * 25);

  useEffect(() => {
    if (!draggingRef.current) setSliderZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    const control = controlRef.current;
    if (!control) return;

    L.DomEvent.disableClickPropagation(control);
    L.DomEvent.disableScrollPropagation(control);
  }, []);

  return (
    <div ref={controlRef} className="atlas-zoom-slider-control absolute left-14 top-3 z-[800] flex flex-col items-center rounded-xl bg-white px-2 py-3 shadow-lg">
      <output className="mb-2 min-w-12 rounded-md bg-slate-100 px-1.5 py-1 text-center text-xs font-bold tabular-nums text-slate-700">
        {zoomPercent}%
      </output>
      <input
        aria-label={`Map zoom ${zoomPercent}%`}
        type="range"
        min={minZoom}
        max={maxZoom}
        step={sliderZoomStep}
        value={Math.min(maxZoom, Math.max(minZoom, sliderZoom))}
        onPointerDown={() => { draggingRef.current = true; }}
        onPointerUp={() => { draggingRef.current = false; }}
        onPointerCancel={() => { draggingRef.current = false; }}
        onChange={(event) => {
          const nextZoom = Number(event.currentTarget.value);
          setSliderZoom(nextZoom);
          map.setZoom(nextZoom, { animate: false });
        }}
        className="atlas-zoom-slider"
      />
    </div>
  );
}

type SiteMarkerProps = {
  site: AtlasMapSite;
  showLabel: boolean;
  pinnedSiteSlug?: string;
  onPin: (siteSlug: string) => void;
  onUnpin: (siteSlug: string) => void;
};

function SiteMarker({ site, showLabel, pinnedSiteSlug, onPin, onUnpin }: SiteMarkerProps) {
  const markerRef = useRef<L.Marker>(null);
  const clickPinnedRef = useRef(false);
  const isPinned = pinnedSiteSlug === site.slug;

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    if (isPinned) {
      clickPinnedRef.current = true;
      marker.openPopup();
    } else if (clickPinnedRef.current) {
      clickPinnedRef.current = false;
      marker.closePopup();
    }
  }, [isPinned]);

  return (
    <Marker
      ref={markerRef}
      position={site.coordinates}
      icon={poiIcon}
      bubblingMouseEvents={false}
      eventHandlers={{
        mouseover: () => {
          if (!pinnedSiteSlug && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
            markerRef.current?.openPopup();
          }
        },
        mouseout: () => {
          if (!pinnedSiteSlug && !clickPinnedRef.current) markerRef.current?.closePopup();
        },
        click: () => {
          clickPinnedRef.current = true;
          onPin(site.slug);
          markerRef.current?.openPopup();
        },
        popupclose: () => {
          clickPinnedRef.current = false;
          onUnpin(site.slug);
        },
      }}
    >
      {showLabel && (
        <Tooltip permanent interactive={false} direction="right" offset={[16, -22]} opacity={1} className="atlas-site-label">
          {site.name}
        </Tooltip>
      )}
      <Popup minWidth={240}>
        <div className="space-y-2 font-sans">
          <p className="text-base font-bold text-slate-950">{site.name}</p>
          <p className="text-sm text-slate-600">{formatSiteLocation(site)}</p>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Ships here</p>
          <ul className="space-y-1">
            {site.ships.map((ship) => <li key={ship.id}><Link className="font-semibold text-sky-800 hover:underline" href={`/ships/${ship.slug}`}>{ship.name}</Link></li>)}
          </ul>
          <Link className="inline-block pt-1 font-bold text-sky-800 hover:underline" href={`/sites/${site.slug}`}>View museum site</Link>
        </div>
      </Popup>
    </Marker>
  );
}

function MapContents({ sites, compact, selectedSiteSlug }: { sites: AtlasMapSite[]; compact: boolean; selectedSiteSlug?: string }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  const [pinnedSiteSlug, setPinnedSiteSlug] = useState<string>();

  useMapEvents({
    zoom: () => setZoom(map.getZoom()),
    click: () => setPinnedSiteSlug(undefined),
  });

  const unpinSite = useCallback((siteSlug: string) => {
    setPinnedSiteSlug((current) => current === siteSlug ? undefined : current);
  }, []);

  return (
    <>
      <MapController sites={sites} selectedSiteSlug={selectedSiteSlug} />
      {!compact && <InputAwareWheelZoom />}
      {!compact && <ZoomSliderControl zoom={zoom} />}
      {!compact && <ResetViewControl sites={sites} />}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sites.map((site) => (
        <SiteMarker
          key={site.id}
          site={site}
          showLabel={zoom >= siteLabelZoom}
          pinnedSiteSlug={pinnedSiteSlug}
          onPin={setPinnedSiteSlug}
          onUnpin={unpinSite}
        />
      ))}
    </>
  );
}

function ResetViewControl({ sites }: { sites: AtlasMapSite[] }) {
  const map = useMap();

  return (
    <button
      type="button"
      onClick={() => fitGlobalView(map, sites)}
      className="absolute bottom-8 right-3 z-[800] rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-800 shadow-lg hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
    >
      Reset view
    </button>
  );
}

type AtlasMapProps = {
  sites: AtlasMapSite[];
  compact?: boolean;
  hero?: boolean;
  selectedSiteSlug?: string;
};

export function AtlasMap({ sites, compact = false, hero = false, selectedSiteSlug }: AtlasMapProps) {
  return (
    <MapContainer
      center={[35, 5]}
      zoom={compact ? 2 : 3}
      minZoom={1}
      maxBounds={[[-85, -190], [85, 190]]}
      maxBoundsViscosity={0.8}
      scrollWheelZoom={!compact}
      zoomSnap={mapZoomSnap}
      zoomDelta={0.25}
      wheelPxPerZoomLevel={240}
      className={cn("z-0 w-full", compact ? "h-[430px] rounded-3xl" : hero ? "atlas-map-hero h-[54svh] min-h-[430px] lg:h-full lg:min-h-[680px]" : "h-[calc(100vh-4rem)]")}
    >
      <MapContents sites={sites} compact={compact} selectedSiteSlug={selectedSiteSlug} />
    </MapContainer>
  );
}
