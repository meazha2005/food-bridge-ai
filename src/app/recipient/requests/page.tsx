'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { HeartHandshake, Plus, ArrowRight } from 'lucide-react';
import { FoodRequest } from '@/types';

export default function RecipientRequestsPage() {
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
    <DashboardLayout allowedRole={['recipient', 'admin']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">My Food Aid Requests</h1>
            <p className="text-xs text-stone-500 mt-1">
              Active demand tickets submitted to the platform's automated matching solver.
            </p>
          </div>
          <Link
            href="/recipient/request-food"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            New Food Request
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : requests.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No requests submitted yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Request ID</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Requested Qty</th>
                    <th className="py-3 px-4">Allocated Qty</th>
                    <th className="py-3 px-4">People Served</th>
                    <th className="py-3 px-4">Urgency</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">#REQ-{r.id}</td>
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
                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(r.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-stone-700">{r.status.replace('_', ' ')}</span>
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
