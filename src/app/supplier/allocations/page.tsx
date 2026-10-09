'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ClipboardList, Truck, CheckCircle2, User, Clock, AlertCircle } from 'lucide-react';
import { FoodAllocation } from '@/types';

export default function SupplierAllocationsPage() {
  const [allocations, setAllocations] = useState<FoodAllocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/allocations')
      .then((res) => res.json())
      .then((data) => {
        setAllocations(data.allocations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Approved Allocations & Reservations</h1>
          <p className="text-xs text-stone-500 mt-1">
            Verified food allocations assigned to recipient shelters and scheduled for driver pickup.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : allocations.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No active allocations recorded yet. When the AI matching engine connects your listing to a request, it will appear here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Allocation ID</th>
                    <th className="py-3 px-4">Food Produce</th>
                    <th className="py-3 px-4">Allocated Quantity</th>
                    <th className="py-3 px-4">Recipient Organization</th>
                    <th className="py-3 px-4">Match Score</th>
                    <th className="py-3 px-4">Logistics Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {allocations.map((a) => (
                    <tr key={a.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">#AL-{a.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{a.food_name}</div>
                        <div className="text-[11px] text-stone-400 capitalize">{a.category}</div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-800">
                        {a.quantity_allocated} {a.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-900">{a.recipient_name}</div>
                        <div className="text-[11px] text-stone-500">{a.recipient_address}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-forest-700">{a.match_score}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            a.delivery_status === 'delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : a.delivery_status === 'in_transit' || a.delivery_status === 'picked_up'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {a.delivery_status || a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
