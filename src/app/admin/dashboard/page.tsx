'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import {
  ShieldAlert,
  Sparkles,
  CloudRain,
  Building2,
  Boxes,
  HeartHandshake,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data.analytics);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        {/* Top Control Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-forest-800 uppercase tracking-widest">
                Central Operations Command
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              FoodBridge AI • State Coordination Hub
            </h1>
            <p className="text-xs text-stone-500">
              Monitoring climate-resilient food rescue and zero-hunger logistics across Tamil Nadu.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/admin/ai-matching"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              Run AI Matching Engine
            </Link>

            <Link
              href="/admin/simulator"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-md transition"
            >
              <CloudRain className="w-4 h-4" />
              Climate Disruption Simulator
            </Link>
          </div>
        </div>

        {/* 6 Key Operational KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Food Listed</span>
            <div className="text-2xl font-black text-stone-900">
              {analytics?.totalListedKg?.toLocaleString() || 2300} <span className="text-xs font-medium text-stone-400">kg</span>
            </div>
            <p className="text-[11px] text-stone-400">Agricultural & retail surplus batches</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Active Reservations</span>
            <div className="text-2xl font-black text-amber-800">
              {analytics?.totalReservedKg?.toLocaleString() || 400} <span className="text-xs font-medium text-amber-600">kg</span>
            </div>
            <p className="text-[11px] text-amber-600/70">Committed to community allocations</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Confirmed Delivered</span>
            <div className="text-2xl font-black text-emerald-800">
              {analytics?.totalDeliveredKg?.toLocaleString() || 0} <span className="text-xs font-medium text-emerald-600">kg</span>
            </div>
            <p className="text-[11px] text-emerald-600/70">Verified physical receipt at kitchens</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Total Community Demand</span>
            <div className="text-2xl font-black text-red-800">
              {analytics?.totalRequestedKg?.toLocaleString() || 1100} <span className="text-xs font-medium text-red-600">kg</span>
            </div>
            <p className="text-[11px] text-red-600/70">Shelters & flood relief kitchens</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Outstanding Unmet Need</span>
            <div className="text-2xl font-black text-blue-800">
              {analytics?.unmetDemandKg?.toLocaleString() || 700} <span className="text-xs font-medium text-blue-600">kg</span>
            </div>
            <p className="text-[11px] text-blue-600/70">Deficit needing rescue matching</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">Delivery Success Rate</span>
            <div className="text-2xl font-black text-purple-800">
              {analytics?.deliverySuccessRatePct || 100}%
            </div>
            <p className="text-[11px] text-purple-600/70">Fleet on-time completion standard</p>
          </div>
        </div>

        {/* Quick Nav Shortcuts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            href="/admin/map"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-forest-300 transition group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5 text-forest-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm group-hover:text-forest-800">Food Rescue GIS Map</h3>
            <p className="text-[11px] text-stone-500">Live visualization of supply, demand, and flood routes.</p>
          </Link>

          <Link
            href="/admin/ai-matching"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-forest-300 transition group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm group-hover:text-blue-800">AI Matching Engine</h3>
            <p className="text-[11px] text-stone-500">Run multi-factor constrained optimization solver.</p>
          </Link>

          <Link
            href="/admin/simulator"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-forest-300 transition group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <CloudRain className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800">Climate Simulator</h3>
            <p className="text-[11px] text-stone-500">Simulate rainfall delays, road cuts, and harvest shocks.</p>
          </Link>

          <Link
            href="/admin/analytics"
            className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm hover:border-forest-300 transition group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-purple-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-sm group-hover:text-purple-800">SDG 2 Impact Analytics</h3>
            <p className="text-[11px] text-stone-500">Verified carbon reduction and waste avoidance data.</p>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
