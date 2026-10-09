'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapComponent, { MapMarker } from '@/components/MapComponent';
import { Search, Filter, Clock, MapPin, Package, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { FoodListing } from '@/types';

export default function FoodAvailabilityPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchListings = () => {
    setLoading(true);
    const params = new URLSearchParams({ public: 'true' });
    if (category !== 'all') params.append('category', category);
    if (search) params.append('search', search);

    fetch(`/api/food-listings?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data.listings || []);
        setLoading(false);
      })
      .catch(() => {
        setListings([]);
        setLoading(false);
      });
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
    description: `Category: ${l.category} • Available: ${l.quantity_available} ${l.unit}`,
    quantity: Number(l.quantity_available),
  }));

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Privacy-Safe Public Available Food Board
          </div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">Available Food for Rescue</h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
            Surplus food batches currently available across Tamil Nadu. Verified NGOs and community kitchens can log in to place direct reservation holds.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchListings()}
              placeholder="Search by food name or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
            >
              <option value="all">All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="cooked_meals">Cooked Meals</option>
              <option value="grains_dry">Grains & Dry Food</option>
              <option value="dairy">Dairy & Milk</option>
              <option value="bakery">Bakery</option>
            </select>

            <button
              onClick={fetchListings}
              className="px-5 py-2.5 rounded-xl bg-forest-800 text-white font-semibold text-sm hover:bg-forest-900 transition"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Interactive OpenStreetMap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
            <span>Live Geographic Distribution (Tamil Nadu)</span>
            <span className="text-stone-400 font-normal">{listings.length} batches available</span>
          </div>
          <MapComponent markers={mapMarkers} height="360px" />
        </div>

        {/* Listings Grid */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-stone-900">Active Listings</h2>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
              <Package className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="text-sm font-bold text-stone-700">No active listings match your filters</h3>
              <p className="text-xs text-stone-500">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((item) => {
                const deadlineDate = new Date(item.pickup_deadline);
                const hoursLeft = Math.max(0, Math.round((deadlineDate.getTime() - Date.now()) / (1000 * 3600)));

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                          {item.category.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            hoursLeft <= 12
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {hoursLeft} hrs left
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-stone-900 leading-snug">{item.food_name}</h3>

                      <div className="space-y-1.5 text-xs text-stone-600">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            Available: <strong>{item.quantity_available} {item.unit}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Pickup Deadline: {deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
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
                        href={`/login?redirect=/ngo/reserve/${item.id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-semibold text-xs transition"
                      >
                        Reserve
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
