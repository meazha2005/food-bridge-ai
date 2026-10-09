'use client';

import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

export interface MapMarker {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  type: 'supplier' | 'ngo' | 'recipient' | 'driver' | 'disruption' | 'warning' | 'shelter' | 'settlement' | 'constraint';
  description?: string;
  quantity?: number;
  urgency?: string;
  severity?: string;
  validUntil?: string;
}

export interface MapRoute {
  from: [number, number];
  to: [number, number];
  color?: string;
  label?: string;
}

interface MapComponentProps {
  markers?: MapMarker[];
  routes?: MapRoute[];
  center?: [number, number];
  zoom?: number;
  height?: string;
}

export default function MapComponent({
  markers = [],
  routes = [],
  center = [12.98, 80.14], // Central Tamil Nadu corridor (Chennai - Tambaram)
  zoom = 11,
  height = '480px',
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Only execute on browser
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let L: any;
    let isCancelled = false;

    import('leaflet').then((leafletModule) => {
      if (isCancelled) return;
      L = leafletModule.default || leafletModule;

      // Fix missing default icon URLs in Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Cleanup existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: true,
      });
      mapInstanceRef.current = map;

      // OpenStreetMap Free Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | FoodBridge AI',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker color generator
      const createCustomIcon = (type: MapMarker['type']) => {
        let bgColor = '#10b981'; // green for supplier
        let label = 'S';
        if (type === 'ngo') {
          bgColor = '#3b82f6'; // blue
          label = 'N';
        } else if (type === 'recipient') {
          bgColor = '#ef4444'; // red
          label = 'R';
        } else if (type === 'driver') {
          bgColor = '#8b5cf6'; // purple
          label = 'D';
        } else if (type === 'disruption' || type === 'warning') {
          bgColor = '#dc2626'; // dark red warning
          label = '⚠';
        } else if (type === 'shelter') {
          bgColor = '#ea580c'; // amber orange shelter
          label = '🏠';
        } else if (type === 'settlement') {
          bgColor = '#7c3aed'; // violet vulnerable settlement
          label = '👥';
        } else if (type === 'constraint') {
          bgColor = '#475569'; // slate access bottleneck
          label = '⛔';
        }

        return L.divIcon({
          className: 'custom-map-icon',
          html: `<div style="
            background-color: ${bgColor};
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 13px;
            border: 2px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">${label}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        });
      };

      // Add Markers
      markers.forEach((m) => {
        if (!m.lat || !m.lng) return;
        const icon = createCustomIcon(m.type);
        const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);

        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #1e293b;">
              ${m.title}
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 6px;">
              ${m.description || ''}
            </div>
            ${m.quantity ? `<div style="font-size: 12px; font-weight: 600; color: #047857;">Quantity: ${m.quantity} kg</div>` : ''}
            ${m.urgency ? `<div style="font-size: 11px; display: inline-block; padding: 2px 6px; border-radius: 4px; background: #fee2e2; color: #b91c1c; font-weight: 600; margin-top: 4px;">Urgency: ${m.urgency.toUpperCase()}</div>` : ''}
          </div>
        `;
        marker.bindPopup(popupContent);
      });

      // Add Routes (Polylines)
      routes.forEach((r) => {
        const polyline = L.polyline([r.from, r.to], {
          color: r.color || '#2563eb',
          weight: 4,
          opacity: 0.8,
          dashArray: '8, 8',
        }).addTo(map);

        if (r.label) {
          polyline.bindPopup(`<b>Route:</b> ${r.label}`);
        }
      });

      // Fit bounds if multiple markers exist
      if (markers.length > 1) {
        const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    });

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [markers, routes, center, zoom]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-emerald-900/10 shadow-sm">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      {/* Map Legend */}
      <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg border border-slate-200 shadow text-[11px] z-[1000] flex flex-wrap gap-2.5 max-w-[90%]">
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Supplier
        </div>
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> NGO Bank
        </div>
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Relief Shelter
        </div>
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Hazard Warning
        </div>
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Settlement
        </div>
        <div className="flex items-center gap-1 font-medium text-slate-700">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Bottleneck
        </div>
      </div>
    </div>
  );
}
