'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Scale, MapPin } from 'lucide-react';
import { MatchRecommendation, MatchingResult } from '@/lib/matching';

export default function AdminAiMatchingPage() {
  const [matchingData, setMatchingData] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [approvingIndex, setApprovingIndex] = useState<number | null>(null);
  const [approvedMatches, setApprovedMatches] = useState<number[]>([]);
  const [statusMessage, setStatusMessage] = useState('');

  const runEngine = async () => {
    setLoading(true);
    setStatusMessage('');
    try {
      const res = await fetch('/api/matching/run', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to execute matching engine');

      setMatchingData(data);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEngine();
  }, []);

  const handleApproveMatch = async (match: MatchRecommendation, index: number) => {
    setApprovingIndex(index);
    try {
      const res = await fetch('/api/allocations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_listing_id: match.listingId,
          food_request_id: match.requestId,
          quantity_allocated: match.recommendedQuantity,
          match_score: match.matchScore,
          match_reasons: match.reasons.join(' • '),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to approve allocation');

      setApprovedMatches((prev) => [...prev, index]);
      setStatusMessage(`Approved allocation of ${match.recommendedQuantity} kg! Delivery task created.`);
      setTimeout(() => setStatusMessage(''), 5000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setApprovingIndex(null);
    }
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-forest-800 uppercase tracking-widest">
                Constraint-Satisfaction Optimization Engine
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              AI Food Matching & Allocation Engine
            </h1>
            <p className="text-xs text-stone-500">
              Evaluates available supply vs shelter demand respecting distance, expiration clocks, and cold chain limits.
            </p>
          </div>

          <button
            onClick={runEngine}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/10 flex items-center gap-2 transition disabled:opacity-70"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-300" />
                Run Live Optimization Solver
              </>
            )}
          </button>
        </div>

        {statusMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{statusMessage}</span>
          </div>
        )}

        {/* Solver Summary Cards */}
        {matchingData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Eligible Supply Pool</span>
              <div className="text-2xl font-black text-stone-900">
                {matchingData.summary.totalAvailableSupplyKg} kg
              </div>
              <p className="text-[11px] text-stone-400">Active non-expired batches</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Outstanding Demand</span>
              <div className="text-2xl font-black text-stone-900">
                {matchingData.summary.totalRequestedDemandKg} kg
              </div>
              <p className="text-[11px] text-stone-400">Total unmet shelter need</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Recommended Allocation</span>
              <div className="text-2xl font-black text-emerald-800">
                {matchingData.summary.totalRecommendedAllocationKg} kg
              </div>
              <p className="text-[11px] text-emerald-600/70">
                Fulfillment Rate: {matchingData.summary.demandFulfillmentRatePct}%
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-forest-700 uppercase tracking-wider">Average Match Score</span>
              <div className="text-2xl font-black text-forest-900">
                {matchingData.summary.avgMatchScore}%
              </div>
              <p className="text-[11px] text-stone-400">Weighted multi-factor confidence</p>
            </div>
          </div>
        )}

        {/* Ranked Recommendations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Ranked Recommended Allocations ({matchingData?.matches.length || 0})
            </h2>
            <span className="text-xs text-stone-400">Separated from live database until verified</span>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : !matchingData || matchingData.matches.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center text-xs text-stone-500">
              No new unallocated pairs available. All active requests are already satisfied or inventory is exhausted.
            </div>
          ) : (
            matchingData.matches.map((m, idx) => {
              const isApproved = approvedMatches.includes(idx);
              return (
                <div
                  key={`${m.listingId}-${m.requestId}`}
                  className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4 hover:border-forest-200 transition"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-forest-800 text-emerald-300 flex items-center justify-center font-black text-sm">
                        {m.matchScore}%
                      </div>
                      <div>
                        <div className="font-bold text-sm text-stone-900">
                          {m.foodName} → {m.recipientName}
                        </div>
                        <div className="text-xs text-stone-500">
                          Recommended Allocation: <strong>{m.recommendedQuantity} kg</strong> ({m.category})
                        </div>
                      </div>
                    </div>

                    <div>
                      {isApproved ? (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved & Reserved
                        </span>
                      ) : (
                        <button
                          disabled={approvingIndex === idx}
                          onClick={() => handleApproveMatch(m, idx)}
                          className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-sm flex items-center gap-2 transition disabled:opacity-70"
                        >
                          {approvingIndex === idx ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              Approve Allocation
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Route & Score Factor Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60 space-y-2">
                      <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-forest-700" /> Transit & Routing Logistics
                      </div>
                      <div className="text-stone-600 space-y-1">
                        <div><strong>Supplier:</strong> {m.supplierName} ({m.supplierAddress})</div>
                        <div><strong>Recipient:</strong> {m.recipientName} ({m.recipientAddress})</div>
                        <div><strong>Distance:</strong> {m.distanceKm} km • <strong>Est. Transit:</strong> ~{m.estimatedTravelMinutes} mins</div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-100 space-y-2">
                      <div className="font-bold text-forest-900 text-xs flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-forest-700" /> Weighted Scoring Rationale
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.reasons.map((r, i) => (
                          <span
                            key={i}
                            className="text-[11px] font-medium px-2 py-0.5 rounded bg-white border border-forest-200 text-forest-800"
                          >
                            ✓ {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Unmet Demand Section */}
        {matchingData && matchingData.unmetRequests.length > 0 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">Unmet Demand & Recommended Buffer Stock Release</h2>
            </div>
            <p className="text-xs text-stone-500">
              The following community requests exceed locally available fresh supplies in immediate radius:
            </p>

            <div className="space-y-3">
              {matchingData.unmetRequests.map((ur) => (
                <div key={ur.requestId} className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{ur.recipientName}</span>
                    <span className="font-bold text-red-700">Deficit: {ur.unmetQuantity} kg ({ur.category})</span>
                  </div>
                  <div className="text-stone-600 font-semibold">Recommended Recovery Actions:</div>
                  <ul className="list-disc list-inside space-y-0.5 text-stone-600">
                    {ur.alternativeSuggestions.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
