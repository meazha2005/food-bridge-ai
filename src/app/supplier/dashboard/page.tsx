'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { PackagePlus, Boxes, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { FoodListing } from '@/types';

export default function SupplierDashboardPage() {
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

  const totalListed = listings.reduce((sum, l) => sum + Number(l.quantity_total), 0);
  const totalAvailable = listings.reduce((sum, l) => sum + Number(l.quantity_available), 0);
  const totalReserved = listings.reduce((sum, l) => sum + Number(l.quantity_reserved), 0);
  const totalCollected = listings.reduce((sum, l) => sum + Number(l.quantity_collected), 0);

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        {/* Top Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Supplier Operations Dashboard</h1>
            <p className="text-xs text-stone-500 mt-1">
              Manage surplus food listings, monitor driver collections, and prevent agricultural waste.
            </p>
          </div>
          <Link
            href="/supplier/add-food"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
          >
            <PackagePlus className="w-4 h-4 text-emerald-300" />
            Post New Food Listing
          </Link>
        </div>

        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-stone-500 text-xs font-semibold">
              <span>Total Food Listed</span>
              <Boxes className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-2xl font-black text-stone-900 mt-2">
              {totalListed.toLocaleString()} <span className="text-xs font-medium text-stone-500">kg</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Across all historical batches</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-emerald-600 text-xs font-semibold">
              <span>Available for Rescue</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-2">
              {totalAvailable.toLocaleString()} <span className="text-xs font-medium text-emerald-600">kg</span>
            </div>
            <div className="text-[11px] text-emerald-600/70 mt-1">Awaiting community reservation</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-amber-600 text-xs font-semibold">
              <span>Reserved by NGOs</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-700 mt-2">
              {totalReserved.toLocaleString()} <span className="text-xs font-medium text-amber-600">kg</span>
            </div>
            <div className="text-[11px] text-amber-600/70 mt-1">Allocated, awaiting vehicle pickup</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <div className="flex items-center justify-between text-purple-600 text-xs font-semibold">
              <span>Successfully Collected</span>
              <Truck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-purple-700 mt-2">
              {totalCollected.toLocaleString()} <span className="text-xs font-medium text-purple-600">kg</span>
            </div>
            <div className="text-[11px] text-purple-600/70 mt-1">Completed handovers</div>
          </div>
        </div>

        {/* Recent Listings Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">Active Listings & Pickup Status</h2>
              <p className="text-xs text-stone-500">Real-time status of your listed perishable batches</p>
            </div>
            <Link
              href="/supplier/listings"
              className="text-xs font-bold text-forest-800 hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No food listings posted yet. Click "Post New Food Listing" to create your first donation.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Food Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total / Available</th>
                    <th className="py-3 px-4">Pickup Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {listings.slice(0, 5).map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4 font-bold text-stone-900">{l.food_name}</td>
                      <td className="py-3.5 px-4 capitalize">{l.category.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-stone-900">{l.quantity_total} {l.unit}</span>
                        <span className="text-stone-400"> / {l.quantity_available} {l.unit} avail</span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {new Date(l.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            l.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : l.status === 'partially_reserved'
                              ? 'bg-blue-100 text-blue-800'
                              : l.status === 'fully_reserved'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {l.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/supplier/listings`}
                          className="font-bold text-forest-800 hover:underline"
                        >
                          Details
                        </Link>
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
