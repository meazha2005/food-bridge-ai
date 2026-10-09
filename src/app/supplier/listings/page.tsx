'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { PackagePlus, Search, Filter, Trash2, Clock, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { FoodListing } from '@/types';

export default function SupplierListingsPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [actionMessage, setActionMessage] = useState('');

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.append('category', category);
    if (status !== 'all') params.append('status', status);
    if (search) params.append('search', search);

    fetch(`/api/food-listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchListings();
  }, [category, status]);

  const handleCancelListing = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this listing?')) return;

    try {
      const res = await fetch(`/api/food-listings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Cancellation failed');

      setActionMessage('Listing cancelled successfully');
      fetchListings();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Manage Food Listings</h1>
            <p className="text-xs text-stone-500 mt-1">
              Track real-time reservation progress, active allocations, and pickup deadlines.
            </p>
          </div>
          <Link
            href="/supplier/add-food"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
          >
            <PackagePlus className="w-4 h-4 text-emerald-300" />
            Add New Food
          </Link>
        </div>

        {actionMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
              placeholder="Search listing by name or location..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains_dry">Grains & Pulses</option>
              <option value="dairy">Dairy</option>
              <option value="cooked_meals">Cooked Meals</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="partially_reserved">Partially Reserved</option>
              <option value="fully_reserved">Fully Reserved</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <button
              onClick={fetchListings}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">
              No listings found matching the specified criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Batch Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Total Quantity</th>
                    <th className="py-3 px-4">Reserved / Collected</th>
                    <th className="py-3 px-4">Pickup Deadline</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {listings.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{l.food_name}</div>
                        <div className="text-[11px] text-stone-400 mt-0.5">{l.pickup_address}</div>
                      </td>
                      <td className="py-3.5 px-4 capitalize">{l.category.replace('_', ' ')}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {l.quantity_total} {l.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-amber-700 font-medium">{l.quantity_reserved} {l.unit} res</span>
                        <span className="text-stone-300"> • </span>
                        <span className="text-purple-700 font-medium">{l.quantity_collected} {l.unit} col</span>
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
                        {l.status === 'available' && Number(l.quantity_reserved) === 0 && (
                          <button
                            onClick={() => handleCancelListing(l.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded transition"
                            title="Cancel Listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
