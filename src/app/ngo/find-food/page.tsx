'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import MapComponent, { MapMarker } from '@/components/MapComponent';
import { Search, Filter, Package, Clock, MapPin, ArrowRight } from 'lucide-react';
import { FoodListing } from '@/types';

export default function NgoFindFoodPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams({ status: 'available' });
    if (category !== 'all') params.append('category', category);
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
  }, [category]);

  const mapMarkers: MapMarker[] = listings.map((l) => ({
    id: l.id,
    lat: Number(l.latitude || 13.0694),
    lng: Number(l.longitude || 80.1948),
    title: l.food_name,
    type: 'supplier',
    description: `${(l as any).supplier_name || 'Supplier'} • ${l.quantity_available} ${l.unit} available`,
    quantity: Number(l.quantity_available),
  }));

  return (
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Find Available Food</h1>
          <p className="text-xs text-stone-500 mt-1">
            Browse and reserve verified agricultural surpluses and retail batches across Tamil Nadu.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
              placeholder="Search by food name or supplier..."
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

            <button
              onClick={fetchListings}
              className="px-4 py-2 bg-forest-800 text-white font-bold text-xs rounded-xl hover:bg-forest-900 transition"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span>Supplier Hub Locations & Batch Concentrations</span>
            <span className="text-stone-400 font-normal">{listings.length} batches available</span>
          </div>
          <MapComponent markers={mapMarkers} height="340px" />
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-3 py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="col-span-3 bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No matching food listings found.
            </div>
          ) : (
            listings.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      {item.storage_type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">{item.food_name}</h3>
                  <div className="text-xs text-forest-800 font-semibold">
                    Supplier: {(item as any).supplier_name || 'Verified Supplier'}
                  </div>

                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Available: <strong>{item.quantity_available} {item.unit}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Deadline: {new Date(item.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>{item.pickup_address}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Condition: {item.condition_state}</span>
                  <Link
                    href={`/ngo/reserve/${item.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs transition"
                  >
                    Reserve Batch
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
