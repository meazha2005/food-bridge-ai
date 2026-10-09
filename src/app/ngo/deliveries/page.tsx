'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, CheckCircle2, Clock } from 'lucide-react';
import { Delivery } from '@/types';

export default function NgoDeliveriesPage() {
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
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Delivery Logistics Monitor</h1>
          <p className="text-xs text-stone-500 mt-1">
            Incoming supplier pickups and outgoing recipient shelter deliveries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <div className="py-12 col-span-2 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            deliveries.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="font-bold text-xs text-stone-800">Delivery Job #{d.id}</div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                    {d.delivery_status}
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div><strong>Cargo:</strong> {d.food_name} ({d.quantity_allocated} {d.unit})</div>
                  <div><strong>From:</strong> {d.supplier_name}</div>
                  <div><strong>To:</strong> {d.recipient_name}</div>
                  <div><strong>Driver:</strong> {d.driver_name || 'Murugan K.'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
