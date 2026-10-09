'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Clock, CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { FoodListing } from '@/types';

export default function SupplierHistoryPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/food-listings')
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Donation & Rescue History</h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete historical log of all food donations, collected volumes, and avoided wastage.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No records found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Donation Date</th>
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total Quantity</th>
                    <th className="py-3 px-4">Collected by NGOs</th>
                    <th className="py-3 px-4">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(l.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">{l.food_name}</td>
                      <td className="py-3.5 px-4 capitalize">{l.category.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 font-semibold">{l.quantity_total} {l.unit}</td>
                      <td className="py-3.5 px-4 text-purple-700 font-bold">{l.quantity_collected} {l.unit}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Rescued from Landfill
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
