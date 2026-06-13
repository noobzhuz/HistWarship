"use client";

import Link from "next/link";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

import { getShipsAtSite, sites } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const poiIcon = L.divIcon({
  className: "atlas-marker",
  html: '<span aria-hidden="true"></span>',
  iconSize: [30, 40],
  iconAnchor: [15, 38],
  popupAnchor: [0, -34],
});

export function AtlasMap({ compact = false }: { compact?: boolean }) {
  return (
    <MapContainer
      center={[35, 5]}
      zoom={compact ? 2 : 3}
      minZoom={2}
      scrollWheelZoom={!compact}
      className={cn("z-0 w-full", compact ? "h-[430px] rounded-3xl" : "h-[calc(100vh-4rem)]")}
    >
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
