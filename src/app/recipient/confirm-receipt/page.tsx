'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { CheckCircle2, Truck, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { Delivery } from '@/types';

export default function ConfirmReceiptPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [receivedQty, setReceivedQty] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchDeliveries = () => {
    setLoading(true);
    fetch('/api/deliveries')
      .then((res) => res.json())
      .then((data) => {
        // Show active or picked up / in transit deliveries
        const active = (data.deliveries || []).filter((d: any) =>
          ['picked_up', 'in_transit', 'assigned'].includes(d.delivery_status)
        );
        setDeliveries(active);
        if (active.length > 0 && !selectedDelivery) {
          setSelectedDelivery(active[0]);
          setReceivedQty(String(active[0].quantity_allocated));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDelivery) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/deliveries/${selectedDelivery.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'delivered',
          quantity_delivered: parseFloat(receivedQty) || selectedDelivery.quantity_allocated,
          recipient_confirmation_notes: notes || 'Verified quality & received at community kitchen',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Confirmation failed');

      setSuccessMsg(`Successfully confirmed receipt of ${receivedQty} ${selectedDelivery.unit}!`);
      setSelectedDelivery(null);
      fetchDeliveries();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout allowedRole={['recipient', 'admin']}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Confirm Food Delivery Receipt</h1>
          <p className="text-xs text-stone-500 mt-1">
            Physical verification of arrival. Only confirmed deliveries increment official zero-hunger rescued quantities.
          </p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{successMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Deliveries List */}
          <div className="md:col-span-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Pending Deliveries ({deliveries.length})
            </h2>

            {loading ? (
              <div className="py-8 flex justify-center">
                <div className="w-6 h-6 border-2 border-forest-700 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : deliveries.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                All scheduled deliveries have been verified.
              </div>
            ) : (
              deliveries.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDelivery(d);
                    setReceivedQty(String(d.quantity_allocated));
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedDelivery?.id === d.id
                      ? 'bg-forest-50/70 border-forest-600 shadow-sm'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-stone-900">Trip #{d.id}</span>
                    <span className="text-[10px] uppercase font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {d.delivery_status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-700 mt-2 font-semibold">
                    {d.food_name} ({d.quantity_allocated} {d.unit})
                  </div>
                  <div className="text-[11px] text-stone-400 mt-1">Driver: {d.driver_name || 'Murugan K.'}</div>
                </div>
              ))
            )}
          </div>

          {/* Confirmation Form */}
          <div className="md:col-span-7">
            {selectedDelivery ? (
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-5">
                <div className="pb-3 border-b border-stone-100">
                  <h3 className="font-bold text-sm text-stone-900">
                    Verify Delivery Handover #{selectedDelivery.id}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    From {selectedDelivery.supplier_name} to your kitchen
                  </p>
                </div>

                <form onSubmit={handleConfirm} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Confirmed Quantity Received ({selectedDelivery.unit}) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={receivedQty}
                      onChange={(e) => setReceivedQty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 font-bold"
                    />
                    <p className="text-[11px] text-stone-400 mt-1">
                      Expected dispatched quantity: {selectedDelivery.quantity_allocated} {selectedDelivery.unit}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Condition Inspection & Notes
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Received in fresh condition, temperature inspected at 4°C, signed by Sister Anitha"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-forest-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/10 flex items-center justify-center gap-2 transition disabled:opacity-70"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                        Sign & Confirm Physical Receipt
                      </>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
                Select an active delivery from the left column to verify receipt.
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
