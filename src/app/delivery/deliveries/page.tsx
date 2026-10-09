'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, CheckCircle2, Navigation, AlertCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Delivery } from '@/types';

export default function DeliveryListPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchDeliveries = () => {
    setLoading(true);
    fetch('/api/deliveries')
      .then((res) => res.json())
      .then((data) => {
        setDeliveries(data.deliveries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleUpdateStatus = async (id: number, status: string, notes?: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/deliveries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          notes: notes || `Driver Murugan updated status to ${status}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update delivery');

      fetchDeliveries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <DashboardLayout allowedRole={['delivery', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Active Delivery Jobs</h1>
            <p className="text-xs text-stone-500 mt-1">
              Confirm supplier pickups, update transit status, and record physical delivery handovers.
            </p>
          </div>
          <Link
            href="/delivery/map"
            className="px-4 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 transition flex items-center gap-1.5"
          >
            <Navigation className="w-3.5 h-3.5" /> View Route Map
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No delivery jobs assigned at this time.
            </div>
          ) : (
            deliveries.map((d) => (
              <div key={d.id} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-stone-900">Job #{d.id}: {d.food_name}</span>
                    <span className="font-bold text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                      {d.quantity_allocated} {d.unit}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                      d.delivery_status === 'delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.delivery_status === 'in_transit' || d.delivery_status === 'picked_up'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {d.delivery_status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-stone-600">
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1">
                    <div className="font-bold text-stone-900">Pickup Location (Supplier):</div>
                    <div>{d.supplier_name}</div>
                    <div className="text-stone-500">{d.pickup_address}</div>
                    <div className="text-[11px] text-stone-400 font-mono">Contact: {d.supplier_phone || '+91 94441 23456'}</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 space-y-1">
                    <div className="font-bold text-stone-900">Delivery Destination (Recipient):</div>
                    <div>{d.recipient_name}</div>
                    <div className="text-stone-500">{d.recipient_address}</div>
                    <div className="text-[11px] text-stone-400 font-mono">Contact: {d.recipient_phone || '+91 98400 98765'}</div>
                  </div>
                </div>

                {/* Status action buttons */}
                <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-stone-400">
                    Est. Transit Time: ~{d.route_estimated_minutes || 40} mins ({d.route_distance_km || 18} km)
                  </div>

                  <div className="flex gap-2">
                    {d.delivery_status === 'assigned' && (
                      <button
                        disabled={updatingId === d.id}
                        onClick={() => handleUpdateStatus(d.id, 'picked_up', 'Driver collected 250kg produce from Koyambedu')}
                        className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                      >
                        Confirm Pickup from Supplier
                      </button>
                    )}

                    {d.delivery_status === 'picked_up' && (
                      <button
                        disabled={updatingId === d.id}
                        onClick={() => handleUpdateStatus(d.id, 'in_transit', 'Departed supplier gate, en route to recipient')}
                        className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs transition"
                      >
                        Start Transit to Destination
                      </button>
                    )}

                    {d.delivery_status === 'in_transit' && (
                      <button
                        disabled={updatingId === d.id}
                        onClick={() => handleUpdateStatus(d.id, 'delivered', 'Handover completed and recipient acknowledged receipt')}
                        className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition"
                      >
                        Complete Delivery & Handover
                      </button>
                    )}

                    {d.delivery_status === 'delivered' && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Mission Successfully Fulfilled
                      </span>
                    )}
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
