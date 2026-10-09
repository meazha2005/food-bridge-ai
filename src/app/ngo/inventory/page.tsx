'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Package, Boxes, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FoodListing } from '@/types';

export default function NgoInventoryPage() {
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
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Food Bank Warehouse Inventory</h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time stock balance, cold chain safety buffer, and shelf-life tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Warehouse Stock</span>
            <div className="text-2xl font-black text-stone-900">4,000 kg</div>
            <p className="text-[11px] text-stone-400">Anna Nagar Central Depot</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Cold Storage Utilized</span>
            <div className="text-2xl font-black text-emerald-800">1,250 kg (31%)</div>
            <p className="text-[11px] text-emerald-600/70">Refrigerated perishables buffer</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Scheduled for Dispatch</span>
            <div className="text-2xl font-black text-amber-800">400 kg</div>
            <p className="text-[11px] text-amber-600/70">Pending driver convoy loading</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100">
            <h2 className="text-sm font-bold text-stone-900">Inventory Stock Ledger</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Commodity</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Stored Quantity</th>
                  <th className="py-3 px-4">Storage Environment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {listings.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{l.food_name}</td>
                    <td className="py-3.5 px-4 capitalize">{l.category.replace('_', ' ')}</td>
                    <td className="py-3.5 px-4 font-semibold">{l.quantity_total} {l.unit}</td>
                    <td className="py-3.5 px-4 capitalize">{l.storage_type}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase bg-emerald-100 text-emerald-800">
                        Inspected & Safe
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
