'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import { Boxes, PackagePlus, Truck, HeartHandshake, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import { FoodListing, FoodRequest } from '@/types';

export default function NgoDashboardPage() {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/food-listings?status=available').then((r) => r.json()),
      fetch('/api/food-requests?status=open').then((r) => r.json()),
    ])
      .then(([lData, rData]) => {
        setListings(lData.listings || []);
        setRequests(rData.requests || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalAvailableSupply = listings.reduce((sum, l) => sum + Number(l.quantity_available), 0);
  const totalOpenDemand = requests.reduce((sum, r) => sum + (Number(r.quantity_requested) - Number(r.quantity_allocated)), 0);

  return (
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="space-y-6">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">NGO Food Bank Operations</h1>
            <p className="text-xs text-stone-500 mt-1">
              Chennai Food Rescue Bank • Coordinating regional food bank logistics and shelter redistribution.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/ngo/find-food"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-sm transition"
            >
              <Boxes className="w-4 h-4 text-emerald-300" />
              Find Available Food
            </Link>
            <Link
              href="/ngo/distribution"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs hover:bg-stone-50 transition"
            >
              <HeartHandshake className="w-4 h-4 text-red-600" />
              Distribute to Shelters
            </Link>
          </div>
        </div>

        {/* 4 KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Nearby Supply Ready</span>
            <div className="text-2xl font-black text-emerald-800 mt-2">
              {totalAvailableSupply.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">{listings.length} batches available for rescue</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Urgent Shelter Demand</span>
            <div className="text-2xl font-black text-red-800 mt-2">
              {totalOpenDemand.toLocaleString()} <span className="text-xs font-medium">kg</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">{requests.length} open community requests</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Cold Storage Buffer</span>
            <div className="text-2xl font-black text-blue-800 mt-2">
              4,000 <span className="text-xs font-medium">kg capacity</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">Anna Nagar Regional Food Hub</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Active Convoys</span>
            <div className="text-2xl font-black text-purple-800 mt-2">
              2 <span className="text-xs font-medium">vehicles en route</span>
            </div>
            <div className="text-[11px] text-stone-400 mt-1">GPS-guided flood avoidance</div>
          </div>
        </div>

        {/* Two-column layout: Nearby Available Batches & Urgent Recipient Needs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Available Batches */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900">Nearby Surplus Batches</h2>
              <Link href="/ngo/find-food" className="text-xs font-bold text-forest-800 hover:underline">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {listings.slice(0, 4).map((l) => (
                  <div key={l.id} className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 text-xs">{l.food_name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        {l.quantity_available} {l.unit} available • {l.category}
                      </div>
                    </div>
                    <Link
                      href={`/ngo/reserve/${l.id}`}
                      className="px-3 py-1.5 rounded-lg bg-forest-800 text-white font-bold text-[11px] hover:bg-forest-900 transition"
                    >
                      Reserve
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Community Requests */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h2 className="text-sm font-bold text-stone-900">Urgent Shelter Requests</h2>
              <Link href="/ngo/distribution" className="text-xs font-bold text-forest-800 hover:underline">
                Distribute Food →
              </Link>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="space-y-3">
                {requests.slice(0, 4).map((r) => (
                  <div key={r.id} className="p-3.5 rounded-xl border border-stone-200/80 bg-stone-50/50 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 text-xs">{r.recipient_name}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Needs {Number(r.quantity_requested) - Number(r.quantity_allocated)} {r.unit} {r.category} • {r.people_to_serve} people
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        r.urgency === 'critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.urgency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
