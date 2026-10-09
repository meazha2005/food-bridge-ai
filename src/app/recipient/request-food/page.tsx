'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { HeartHandshake, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function RequestFoodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default deadline 24 hours from now
  const defaultDeadline = new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    category: 'vegetables',
    quantity_requested: '',
    unit: 'kg',
    people_to_serve: '180',
    urgency: 'critical',
    urgency_reason: 'El Niño flash flooding in Tambaram low-lying streets isolated shelter food delivery trucks.',
    deadline: defaultDeadline,
    delivery_address: '42, Kamaraj Nagar, Tambaram East, Chennai, TN 600059',
    latitude: '12.9220',
    longitude: '80.1340',
    acceptable_alternatives: 'Root vegetables, grains, pulses, bread pouches',
    storage_facilities: 'Standard kitchen walk-in pantry + 200L refrigerator box',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/food-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit request');

      router.push('/recipient/requests');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole={['recipient', 'admin']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/recipient/dashboard"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Request Food Aid</h1>
            <p className="text-xs text-stone-500">
              Submit community nutrition needs directly to the AI matching and donor network
            </p>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Food Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="grains_dry">Grains & Pulses</option>
                  <option value="dairy">Dairy & Milk</option>
                  <option value="cooked_meals">Cooked Meals</option>
                  <option value="fruits">Fruits</option>
                  <option value="bakery">Bakery & Bread</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Quantity Required *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.quantity_requested}
                  onChange={(e) => setFormData({ ...formData, quantity_requested: e.target.value })}
                  placeholder="e.g. 250"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="meals">Meals</option>
                  <option value="crates">Crates</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Beneficiaries to Feed (Headcount) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.people_to_serve}
                  onChange={(e) => setFormData({ ...formData, people_to_serve: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Urgency Level *
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="critical">Critical (Shortage within 6-12 hrs)</option>
                  <option value="high">High (Needed within 24 hrs)</option>
                  <option value="medium">Medium (Replenishment buffer)</option>
                  <option value="low">Low (Standard restock)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Urgency Reason / Climate Context
              </label>
              <textarea
                rows={2}
                value={formData.urgency_reason}
                onChange={(e) => setFormData({ ...formData, urgency_reason: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Fulfillment Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Acceptable Food Substitutes
                </label>
                <input
                  type="text"
                  value={formData.acceptable_alternatives}
                  onChange={(e) => setFormData({ ...formData, acceptable_alternatives: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Kitchen Delivery Destination Address *
              </label>
              <input
                type="text"
                required
                value={formData.delivery_address}
                onChange={(e) => setFormData({ ...formData, delivery_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/recipient/dashboard"
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/10 flex items-center gap-2 transition disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <HeartHandshake className="w-4 h-4 text-emerald-300" />
                    Submit Community Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
