'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FoodAllocation } from '@/types';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function NgoHistoryPage() {
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
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Redistribution History</h1>
          <p className="text-xs text-stone-500 mt-1">
            Historical audit log of all food rescues and recipient distribution transactions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Food Produce</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Source Supplier</th>
                  <th className="py-3 px-4">Destination Shelter</th>
                  <th className="py-3 px-4">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {allocations.map((a) => (
                  <tr key={a.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(a.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{a.food_name}</td>
                    <td className="py-3.5 px-4 font-semibold">{a.quantity_allocated} {a.unit}</td>
                    <td className="py-3.5 px-4">{a.supplier_name}</td>
                    <td className="py-3.5 px-4 font-medium text-stone-900">{a.recipient_name}</td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-emerald-700">Rescued & Delivered</span>
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
