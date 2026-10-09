'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { HeartHandshake, CheckCircle2, Clock, Truck, AlertCircle, ArrowRight } from 'lucide-react';
import { FoodRequest, Delivery } from '@/types';

export default function RecipientDashboardPage() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/food-requests').then((r) => r.json()),
      fetch('/api/deliveries').then((r) => r.json()),
    ])
      .then(([rData, dData]) => {
        setRequests(rData.requests || []);
        setDeliveries(dData.deliveries || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalRequested = requests.reduce((sum, r) => sum + Number(r.quantity_requested), 0);
  const totalAllocated = requests.reduce((sum, r) => sum + Number(r.quantity_allocated), 0);
  const totalDelivered = requests.reduce((sum, r) => sum + Number(r.quantity_delivered), 0);
  const unmetDemand = Math.max(0, totalRequested - totalDelivered);

  return (
    <DashboardLayout allowedRole={['recipient', 'admin']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Recipient Shelter Food Command</h1>
            <p className="text-xs text-stone-500 mt-1">
              Hope Harbor Children Shelter & Community Kitchen • Post emergency requirements and verify food aid deliveries.
            </p>
          </div>
          <Link
            href="/recipient/request-food"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
          >
            <HeartHandshake className="w-4 h-4 text-emerald-300" />
            Submit Food Aid Request
          </Link>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Demand Requested</span>
            <div className="text-2xl font-black text-stone-900 mt-2">
              {totalRequested.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Beneficiaries: ~180 resident children</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Allocated & In-Transit</span>
            <div className="text-2xl font-black text-amber-700 mt-2">
              {totalAllocated.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-amber-600/70 mt-1">Matched by AI engine</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Confirmed Delivered</span>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {totalDelivered.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-emerald-600/70 mt-1">Physically received at kitchen</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Remaining Unmet Need</span>
            <div className="text-2xl font-black text-red-700 mt-2">
              {unmetDemand.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-red-600/70 mt-1">Pending allocation</div>
          </div>
        </div>

        {/* Active Incoming Deliveries Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-base font-bold text-stone-900">Incoming Deliveries & Driver En Route</h2>
              <p className="text-xs text-stone-500">Confirm food batches when driver arrives at your facility gate</p>
            </div>
            <Link
              href="/recipient/confirm-receipt"
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              Confirm Handover <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deliveries.slice(0, 2).map((d) => (
              <div key={d.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-xs text-stone-900">Trip #{d.id}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {d.delivery_status}
                  </span>
                </div>
                <div className="text-xs text-stone-600 space-y-1">
                  <div><strong>Cargo:</strong> {d.food_name} ({d.quantity_allocated} {d.unit})</div>
                  <div><strong>Source:</strong> {d.supplier_name}</div>
                  <div><strong>Driver:</strong> {d.driver_name || 'Murugan K.'}</div>
                </div>
                <div className="pt-2 border-t border-stone-200/60 flex justify-end">
                  <Link
                    href="/recipient/confirm-receipt"
                    className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition"
                  >
                    Confirm Delivery
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Requests Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">My Community Requests</h2>
            <Link href="/recipient/requests" className="text-xs font-bold text-forest-800 hover:underline">
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Requested Quantity</th>
                  <th className="py-3 px-4">Allocated</th>
                  <th className="py-3 px-4">Beneficiaries</th>
                  <th className="py-3 px-4">Urgency</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {requests.slice(0, 5).map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-bold capitalize text-stone-900">{r.category.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 font-semibold">{r.quantity_requested} {r.unit}</td>
                    <td className="py-3.5 px-4 text-emerald-700 font-bold">{r.quantity_allocated} {r.unit}</td>
                    <td className="py-3.5 px-4">{r.people_to_serve} people</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          r.urgency === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="capitalize font-semibold text-stone-700">{r.status.replace('_', ' ')}</span>
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
