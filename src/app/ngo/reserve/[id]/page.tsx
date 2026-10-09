'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Package, ArrowLeft, CheckCircle2, AlertCircle, Building2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';
import { FoodListing, FoodRequest } from '@/types';

export default function ReserveFoodPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const listingId = params.id;

  const [listing, setListing] = useState<FoodListing | null>(null);
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [reserveQuantity, setReserveQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/food-listings/${listingId}`).then((r) => r.json()),
      fetch('/api/food-requests?status=open').then((r) => r.json()),
    ])
      .then(([lData, rData]) => {
        if (lData.listing) {
          setListing(lData.listing);
          setReserveQuantity(String(lData.listing.quantity_available));
        }
        if (rData.requests && rData.requests.length > 0) {
          setRequests(rData.requests);
          setSelectedRequestId(String(rData.requests[0].id));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [listingId]);

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const qty = parseFloat(reserveQuantity);
    if (!listing || isNaN(qty) || qty <= 0) {
      setError('Please provide a valid reservation quantity');
      setSubmitting(false);
      return;
    }

    if (qty > Number(listing.quantity_available)) {
      setError(`Cannot reserve more than available quantity (${listing.quantity_available} ${listing.unit})`);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_listing_id: listing.id,
          food_request_id: selectedRequestId ? parseInt(selectedRequestId, 10) : 1,
          quantity_allocated: qty,
          match_score: 95.0,
          match_reasons: 'Manual NGO authorized reservation & distribution routing',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reservation failed');

      router.push('/ngo/reservations');
    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout allowedRole={['ngo', 'admin']}>
        <div className="py-12 flex justify-center">
          <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!listing) {
    return (
      <DashboardLayout allowedRole={['ngo', 'admin']}>
        <div className="p-8 text-center text-xs text-stone-500">Listing not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link
            href="/ngo/find-food"
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Reserve Food Batch</h1>
            <p className="text-xs text-stone-500">
              Lock in surplus stock and assign it to an active recipient community kitchen
            </p>
          </div>
        </div>

        {/* Listing Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              {listing.category}
            </span>
            <span className="text-xs font-bold text-stone-700">
              Available: {listing.quantity_available} {listing.unit}
            </span>
          </div>

          <h2 className="text-xl font-bold text-stone-900">{listing.food_name}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600 pt-2 border-t border-stone-100">
            <div>
              <strong>Supplier:</strong> {(listing as any).supplier_name || 'Agro Mandi'}
            </div>
            <div>
              <strong>Storage:</strong> {listing.storage_type}
            </div>
            <div>
              <strong>Pickup Location:</strong> {listing.pickup_address}
            </div>
            <div>
              <strong>Pickup Deadline:</strong> {new Date(listing.pickup_deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Reservation Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleReserve} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Quantity to Reserve ({listing.unit}) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                max={Number(listing.quantity_available)}
                value={reserveQuantity}
                onChange={(e) => setReserveQuantity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 font-bold"
              />
              <p className="text-[11px] text-stone-400 mt-1">
                Maximum available: {listing.quantity_available} {listing.unit}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Assign to Recipient Community Kitchen *
              </label>
              <select
                value={selectedRequestId}
                onChange={(e) => setSelectedRequestId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
              >
                {requests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.recipient_name} — Needs {Number(r.quantity_requested) - Number(r.quantity_allocated)} {r.unit} ({r.urgency.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Link
                href="/ngo/find-food"
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/10 flex items-center gap-2 transition disabled:opacity-70"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    Confirm & Reserve Allocation
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
