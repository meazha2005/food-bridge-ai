'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Delivery } from '@/types';
import { CheckCircle2, Clock } from 'lucide-react';

export default function DeliveryHistoryPage() {
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
    <DashboardLayout allowedRole={['delivery', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Mission History & Trip Logs</h1>
          <p className="text-xs text-stone-500 mt-1">
            Historical log of all completed rescue transport trips and emergency runs.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Trip #</th>
                  <th className="py-3 px-4">Food Cargo</th>
                  <th className="py-3 px-4">Dispatched Qty</th>
                  <th className="py-3 px-4">Origin / Destination</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {deliveries.map((d) => (
                  <tr key={d.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-800">#TRIP-{d.id}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{d.food_name}</td>
                    <td className="py-3.5 px-4 font-semibold">{d.quantity_allocated} {d.unit}</td>
                    <td className="py-3.5 px-4">
                      <div>{d.supplier_name} →</div>
                      <div className="font-semibold text-stone-900">{d.recipient_name}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">{d.route_distance_km || 18} km</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-100 text-emerald-800">
                        {d.delivery_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
