'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, CheckCircle2, Clock, Phone, AlertCircle } from 'lucide-react';
import { Delivery } from '@/types';

export default function SupplierPickupsPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/deliveries')
      .then((res) => res.json())
      .then((data) => {
        setDeliveries(data.deliveries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Pickup Logistics & Driver Arrivals</h1>
          <p className="text-xs text-stone-500 mt-1">
            Track scheduled driver collection visits at your facility gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="py-12 col-span-2 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="col-span-2 bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No pickup assignments active right now.
            </div>
          ) : (
            deliveries.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-xs">Pickup #{d.id}</div>
                      <div className="text-[11px] text-stone-400 font-mono">Vehicle: {d.vehicle_type}</div>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      d.pickup_status === 'picked_up'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {d.pickup_status}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-stone-600">
                  <div>
                    <strong>Food Cargo:</strong> {d.food_name} ({d.quantity_allocated} {d.unit})
                  </div>
                  <div>
                    <strong>Assigned Driver:</strong> {d.driver_name || 'Murugan K.'} ({d.driver_phone || '+91 97890 12345'})
                  </div>
                  <div>
                    <strong>Destination Shelter:</strong> {d.recipient_name}
                  </div>
                  <div className="text-stone-400 text-[11px]">
                    Transit window: ~{d.route_estimated_minutes || 35} mins ({d.route_distance_km || 18} km)
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
