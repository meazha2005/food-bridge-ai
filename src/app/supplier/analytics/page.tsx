'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { BarChart3, TrendingUp, Sprout, Award } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function SupplierAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/dashboard')
      .then((res) => res.json())
      .then((data) => setAnalytics(data.analytics))
      .catch(() => {});
  }, []);

  const data = analytics?.monthlyTrend || [
    { month: 'Jun', listedKg: 400, deliveredKg: 350 },
    { month: 'Jul', listedKg: 650, deliveredKg: 600 },
    { month: 'Aug', listedKg: 900, deliveredKg: 850 },
    { month: 'Sep', listedKg: 1200, deliveredKg: 1100 },
    { month: 'Oct', listedKg: 1800, deliveredKg: 1650 },
  ];

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Supplier Sustainability Analytics</h1>
          <p className="text-xs text-stone-500 mt-1">
            Quantify your organization's contribution to SDG 2 Zero Hunger and greenhouse gas reduction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Total Donated Volume</span>
            <div className="text-3xl font-black text-forest-800">
              {analytics?.totalListedKg || 1850} <span className="text-sm font-medium">kg</span>
            </div>
            <p className="text-[11px] text-stone-400">Total surplus committed to rescue</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">CO2 Emissions Prevented</span>
            <div className="text-3xl font-black text-emerald-700">
              {Math.round((analytics?.totalDeliveredKg || 450) * 2.5)} <span className="text-sm font-medium">kg CO2e</span>
            </div>
            <p className="text-[11px] text-stone-400">Based on FAO landfill diversion standard (2.5x factor)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Meals Provided Equivalent</span>
            <div className="text-3xl font-black text-orange-700">
              {Math.round((analytics?.totalDeliveredKg || 450) * 2.2)} <span className="text-sm font-medium">meals</span>
            </div>
            <p className="text-[11px] text-stone-400">Based on 450g average meal serving ratio</p>
          </div>
        </div>

        {/* Monthly Trend Chart */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900">Donation Volume Trend (kg)</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Bar dataKey="listedKg" fill="#15803d" radius={[4, 4, 0, 0]} name="Listed (kg)" />
                <Bar dataKey="deliveredKg" fill="#10b981" radius={[4, 4, 0, 0]} name="Delivered (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
