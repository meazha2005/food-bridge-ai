'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, MapPin, CheckCircle2, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { Delivery } from '@/types';

export default function DeliveryDashboardPage() {
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

  const assigned = deliveries.filter((d) => ['assigned', 'en_route_pickup'].includes(d.delivery_status));
  const activeTrips = deliveries.filter((d) => ['picked_up', 'in_transit'].includes(d.delivery_status));
  const completed = deliveries.filter((d) => d.delivery_status === 'delivered');

  return (
    <DashboardLayout allowedRole={['delivery', 'admin']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Rescue Logistics Command</h1>
            <p className="text-xs text-stone-500 mt-1">
              Driver Murugan K. • Tata Ace 1-Ton Refrig • Active Sector: South Chennai & Tambaram
            </p>
          </div>
          <Link
            href="/delivery/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-sm transition"
          >
            <MapPin className="w-4 h-4 text-emerald-300" />
            Open Live Route Navigator
          </Link>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Pickups</span>
            <div className="text-2xl font-black text-amber-800 mt-2">{assigned.length}</div>
            <p className="text-[11px] text-stone-400 mt-1">Assigned for collection</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">En Route / In Transit</span>
            <div className="text-2xl font-black text-purple-800 mt-2">{activeTrips.length}</div>
            <p className="text-[11px] text-stone-400 mt-1">Cargo on vehicle</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Completed Trips</span>
            <div className="text-2xl font-black text-emerald-800 mt-2">{completed.length}</div>
            <p className="text-[11px] text-stone-400 mt-1">Successful handovers</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">Vehicle Payload</span>
            <div className="text-2xl font-black text-stone-900 mt-2">1,000 kg</div>
            <p className="text-[11px] text-stone-400 mt-1">Tata Ace Refrig 1-Ton</p>
          </div>
        </div>

        {/* Active Deliveries List */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Current Assigned Missions</h2>
            <Link href="/delivery/deliveries" className="text-xs font-bold text-forest-800 hover:underline">
              View All →
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : deliveries.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No active delivery assignments.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {deliveries.map((d) => (
                <div key={d.id} className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-stone-900">Mission #{d.id}</span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          d.delivery_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {d.delivery_status}
                      </span>
                    </div>
                    <div className="text-xs text-stone-700 font-semibold">
                      {d.food_name} ({d.quantity_allocated} {d.unit})
                    </div>
                    <div className="text-xs text-stone-500">
                      <strong>Pickup:</strong> {d.supplier_name} → <strong>Delivery:</strong> {d.recipient_name}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/delivery/map"
                      className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> View Route Map
                    </Link>
                    {d.delivery_status !== 'delivered' && (
                      <Link
                        href={`/delivery/deliveries`}
                        className="px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition"
                      >
                        Update Status
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
