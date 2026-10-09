'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import MapComponent, { MapMarker, MapRoute } from '@/components/MapComponent';
import { MapPin, Filter, AlertTriangle, Layers, Building2, Truck, HeartHandshake } from 'lucide-react';
import { Organization, FoodListing, FoodRequest, Delivery } from '@/types';

export default function AdminRescueMapPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/organizations').then((r) => r.json()),
      fetch('/api/deliveries').then((r) => r.json()),
    ])
      .then(([oData, dData]) => {
        setOrganizations(oData.organizations || []);
        setDeliveries(dData.deliveries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Build markers
  const markers: MapMarker[] = organizations.map((o) => ({
    id: `org-${o.id}`,
    lat: Number(o.latitude),
    lng: Number(o.longitude),
    title: o.name,
    type: o.organization_type as any,
    description: `${o.city} • Capacity: ${o.storage_capacity} kg (${o.storage_type})`,
  }));

  // Add flood disruption markers
  markers.push({
    id: 'disrupt-1',
    lat: 13.0067,
    lng: 80.2020,
    title: 'Flood Alert: Kathipara Junction - Guindy Underpass',
    type: 'disruption',
    description: 'Slow-moving waterlogging (35% speed penalty). High-clearance vehicles only.',
  });
  markers.push({
    id: 'disrupt-2',
    lat: 12.9249,
    lng: 80.1150,
    title: 'Disruption: GST Road Tambaram Bypass Service Lane',
    type: 'disruption',
    description: 'Road impassable due to rain runoff. Traffic rerouted via Outer Ring Road.',
  });

  // Active delivery routes
  const routes: MapRoute[] = deliveries.map((d) => ({
    from: [Number(d.supplier_lat || 13.0694), Number(d.supplier_lng || 80.1948)],
    to: [Number(d.recipient_lat || 12.9220), Number(d.recipient_lng || 80.1340)],
    color: '#15803d',
    label: `${d.food_name} (${d.quantity_allocated} ${d.unit}) • Driver: ${d.driver_name || 'Murugan'}`,
  }));

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-forest-800 uppercase tracking-widest">
                Geographic Information System (GIS)
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              Food Rescue Logistics Command Map
            </h1>
            <p className="text-xs text-stone-500">
              Live visualization of suppliers, food banks, shelters, driver convoys, and flood disruptions across Tamil Nadu.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-stone-600">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
          </div>
        </div>

        {/* Map Container */}
        <div className="space-y-3">
          <MapComponent markers={markers} routes={routes} center={[12.96, 80.12]} zoom={11} height="520px" />
        </div>

        {/* Legend & Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              S
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">Food Suppliers (Mandis)</div>
              <div className="text-[11px] text-stone-400">3 verified wholesale sources</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              N
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">NGO Regional Food Banks</div>
              <div className="text-[11px] text-stone-400">2 cold-storage redistribution hubs</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center font-bold">
              R
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">Recipient Kitchens & Shelters</div>
              <div className="text-[11px] text-stone-400">3 active community kitchens</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <div className="font-bold text-xs text-stone-900">Flood Inundation Sectors</div>
              <div className="text-[11px] text-stone-400">2 active weather roadblock alerts</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
