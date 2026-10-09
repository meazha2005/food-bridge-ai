'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false);

  const [weights, setWeights] = useState({
    urgency: 30,
    expiry: 25,
    unmet: 20,
    suitability: 15,
    proximity: 10,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Platform Configuration & Parameters</h1>
            <p className="text-xs text-stone-500 mt-1">Configure AI optimization weights and disaster response thresholds</p>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Parameters updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-forest-800">
            AI Matching Constraint Weights (%)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Recipient Urgency Weight (%): {weights.urgency}%
              </label>
              <input
                type="number"
                value={weights.urgency}
                onChange={(e) => setWeights({ ...weights, urgency: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Food Expiry Urgency (%): {weights.expiry}%
              </label>
              <input
                type="number"
                value={weights.expiry}
                onChange={(e) => setWeights({ ...weights, expiry: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Unmet Demand Proportion (%): {weights.unmet}%
              </label>
              <input
                type="number"
                value={weights.unmet}
                onChange={(e) => setWeights({ ...weights, unmet: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Food Suitability & Category (%): {weights.suitability}%
              </label>
              <input
                type="number"
                value={weights.suitability}
                onChange={(e) => setWeights({ ...weights, suitability: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                Proximity Distance Factor (%): {weights.proximity}%
              </label>
              <input
                type="number"
                value={weights.proximity}
                onChange={(e) => setWeights({ ...weights, proximity: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs hover:bg-forest-900 transition"
            >
              Save Parameters
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
