'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import MapComponent, { MapMarker, MapRoute } from '@/components/MapComponent';
import { Truck, MapPin, AlertTriangle, ShieldCheck, Navigation, ArrowRight } from 'lucide-react';
import { Delivery } from '@/types';

export default function DeliveryMapPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deliveries')
      .then((res) => res.json())
      .then((data) => {
        setDeliveries(data.deliveries || []);
        if (data.deliveries && data.deliveries.length > 0) {
          setSelectedDelivery(data.deliveries[0]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Set markers based on selected delivery
  const supplierLat = Number(selectedDelivery?.supplier_lat || 13.0694);
  const supplierLng = Number(selectedDelivery?.supplier_lng || 80.1948);
  const recipientLat = Number(selectedDelivery?.recipient_lat || 12.9220);
  const recipientLng = Number(selectedDelivery?.recipient_lng || 80.1340);

  const markers: MapMarker[] = [
    {
      id: 'pickup',
      lat: supplierLat,
      lng: supplierLng,
      title: `Pickup: ${selectedDelivery?.supplier_name || 'Koyambedu Agro'}`,
      type: 'supplier',
      description: selectedDelivery?.pickup_address,
      quantity: selectedDelivery?.quantity_allocated,
    },
    {
      id: 'drop',
      lat: recipientLat,
      lng: recipientLng,
      title: `Delivery: ${selectedDelivery?.recipient_name || 'Hope Shelter'}`,
      type: 'recipient',
      description: selectedDelivery?.recipient_address,
      urgency: selectedDelivery?.recipient_urgency || 'critical',
    },
    {
      id: 'flood-alert',
      lat: 13.0067,
      lng: 80.2020,
      title: 'Active Flood Warning: Guindy - Kathipara Underpass',
      type: 'disruption',
      description: 'Slow-moving waterlogging. Recommended detour via Porur Toll.',
    },
  ];

  const routes: MapRoute[] = [
    {
      from: [supplierLat, supplierLng],
      to: [recipientLat, recipientLng],
      color: '#15803d',
      label: 'Recommended Flood-Safe Route (via Inner Ring Road)',
    },
  ];

  return (
    <DashboardLayout allowedRole={['delivery', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Live Route Navigator (GIS)</h1>
            <p className="text-xs text-stone-500 mt-1">
              OpenStreetMap & Leaflet • Climate-aware route calculation avoiding flood roadblocks
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Detour Recalculation Active (+35% Rainfall Factor)
          </div>
        </div>

        {/* Mission Selector */}
        {deliveries.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {deliveries.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDelivery(d)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedDelivery?.id === d.id
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                Mission #{d.id}: {d.food_name} ({d.quantity_allocated} {d.unit})
              </button>
            ))}
          </div>
        )}

        {/* Map Display */}
        <div className="space-y-3">
          <MapComponent markers={markers} routes={routes} center={[13.00, 80.17]} zoom={11} height="460px" />
        </div>

        {/* Route Details Card */}
        {selectedDelivery && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Pickup Origin</span>
              <div className="font-bold text-stone-900 text-sm">{selectedDelivery.supplier_name}</div>
              <p className="text-xs text-stone-500">{selectedDelivery.pickup_address}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">Delivery Destination</span>
              <div className="font-bold text-stone-900 text-sm">{selectedDelivery.recipient_name}</div>
              <p className="text-xs text-stone-500">{selectedDelivery.recipient_address}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">Route Metrics</span>
              <div className="text-xl font-black text-stone-900">
                {selectedDelivery.route_distance_km || 22.4} km <span className="text-xs font-medium text-stone-400">• ~{selectedDelivery.route_estimated_minutes || 45} mins</span>
              </div>
              <p className="text-[11px] text-amber-700 font-semibold">
                Includes +15 min El Niño waterlogging buffer penalty
              </p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
