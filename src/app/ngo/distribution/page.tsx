'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { HeartHandshake, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { FoodRequest } from '@/types';

export default function NgoDistributionPage() {
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/food-requests')
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Recipient Distribution Dispatch</h1>
          <p className="text-xs text-stone-500 mt-1">
            Assign warehouse reserves directly to verified community kitchens, shelters, and flood camps.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No open shelter requests.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Recipient Shelter</th>
                    <th className="py-3 px-4">Food Category</th>
                    <th className="py-3 px-4">Outstanding Need</th>
                    <th className="py-3 px-4">Beneficiaries</th>
                    <th className="py-3 px-4">Urgency Level</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {requests.map((r) => {
                    const remaining = Number(r.quantity_requested) - Number(r.quantity_allocated);
                    return (
                      <tr key={r.id} className="hover:bg-stone-50/50">
                        <td className="py-3.5 px-4 font-bold text-stone-900">{r.recipient_name}</td>
                        <td className="py-3.5 px-4 capitalize">{r.category.replace('_', ' ')}</td>
                        <td className="py-3.5 px-4 font-bold text-red-700">
                          {remaining > 0 ? `${remaining} ${r.unit}` : 'Fulfilled'}
                        </td>
                        <td className="py-3.5 px-4">{r.people_to_serve} people</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                              r.urgency === 'critical'
                                ? 'bg-red-100 text-red-800'
                                : r.urgency === 'high'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {r.urgency}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/ngo/find-food`}
                            className="inline-flex items-center gap-1 font-bold text-forest-800 hover:underline"
                          >
                            Match & Dispatch <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
