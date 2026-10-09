'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { PackagePlus, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AddFoodPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Default collection deadline 12 hours from now
  const defaultDeadline = new Date(Date.now() + 12 * 3600 * 1000).toISOString().slice(0, 16);
  const defaultExpiry = new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16);

  const [formData, setFormData] = useState({
    food_name: '',
    category: 'vegetables',
    quantity_total: '',
    unit: 'kg',
    condition_state: 'fresh',
    storage_type: 'ambient',
    available_from: new Date().toISOString().slice(0, 16),
    expiry_at: defaultExpiry,
    pickup_deadline: defaultDeadline,
    pickup_address: 'Gate 4, Koyambedu Wholesale Market Complex, Chennai',
    latitude: '13.0694',
    longitude: '80.1948',
    handling_instructions: 'Handle in ventilated crates. Keep shaded from direct sunlight.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/food-listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to post listing');

      router.push('/supplier/listings');
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/supplier/dashboard"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Add Food for Rescue</h1>
            <p className="text-xs text-stone-500">
              Post surplus batches into the automated AI matching network
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
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Food Name / Description *
              </label>
              <input
                type="text"
                required
                value={formData.food_name}
                onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                placeholder="e.g. Farm Fresh Tomatoes & Green Bell Peppers (Grade A)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="cooked_meals">Cooked Meals</option>
                  <option value="grains_dry">Grains & Pulses</option>
                  <option value="dairy">Dairy & Milk</option>
                  <option value="bakery">Bakery & Bread</option>
                  <option value="other">Other Edibles</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.quantity_total}
                  onChange={(e) => setFormData({ ...formData, quantity_total: e.target.value })}
                  placeholder="e.g. 500"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Unit *
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters</option>
                  <option value="meals">Meals</option>
                  <option value="crates">Crates</option>
                  <option value="packets">Packets</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Condition State
                </label>
                <select
                  value={formData.condition_state}
                  onChange={(e) => setFormData({ ...formData, condition_state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="fresh">Fresh Farm Harvest</option>
                  <option value="prepared_safe">Cooked / Prepared (Safe for 6 hrs)</option>
                  <option value="near_expiry">Near Retail Expiry (Sound Quality)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Storage Requirement
                </label>
                <select
                  value={formData.storage_type}
                  onChange={(e) => setFormData({ ...formData, storage_type: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="ambient">Ambient / Room Temperature</option>
                  <option value="refrigerated">Refrigerated (2°C - 6°C)</option>
                  <option value="frozen">Deep Frozen (-18°C)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Collection Deadline * (Must pick up before)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.pickup_deadline}
                  onChange={(e) => setFormData({ ...formData, pickup_deadline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Safe Consumption Expiry
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.expiry_at}
                  onChange={(e) => setFormData({ ...formData, expiry_at: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Pickup Address *
              </label>
              <input
                type="text"
                required
                value={formData.pickup_address}
                onChange={(e) => setFormData({ ...formData, pickup_address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Handling Instructions
              </label>
              <textarea
                rows={2}
                value={formData.handling_instructions}
                onChange={(e) => setFormData({ ...formData, handling_instructions: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/supplier/dashboard"
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
                    <PackagePlus className="w-4 h-4 text-emerald-300" />
                    Publish Listing
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
