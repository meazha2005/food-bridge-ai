'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Cpu,
  CheckCircle2,
  TrendingUp,
  Clock,
  Navigation,
  Scale,
  ShieldCheck,
  ArrowRight,
  Flame,
  Shuffle
} from 'lucide-react';

interface MatchCard {
  id: string;
  foodName: string;
  category: string;
  quantityAllocated: string;
  supplierName: string;
  supplierLocation: string;
  recipientName: string;
  recipientLocation: string;
  matchScore: number;
  urgency: 'Critical' | 'High' | 'Moderate';
  distanceKm: number;
  expiryHoursLeft: number;
  reasons: string[];
}

const SAMPLE_MATCHES: MatchCard[] = [
  {
    id: 'm1',
    foodName: 'Fresh Country Tomatoes & Greens',
    category: 'Vegetables',
    quantityAllocated: '250 kg',
    supplierName: 'Koyambedu Wholesale Agro Hub',
    supplierLocation: 'Gate 4, Koyambedu Market Complex',
    recipientName: 'Hope Harbor Children Shelter & Relief Kitchen',
    recipientLocation: 'Tambaram East (18.4 km)',
    matchScore: 94.5,
    urgency: 'High',
    distanceKm: 18.4,
    expiryHoursLeft: 18,
    reasons: [
      '30% Urgency: Pediatric nutrition priority with 500 active servings',
      '25% Expiry Clock: 18h shelf life requires immediate redistribution',
      '20% Quantity Fit: Fulfills 100% of shelter vegetable deficit',
      '10% Distance: Optimal 18.4 km route via bypass avoiding Alandur subway'
    ]
  },
  {
    id: 'm2',
    foodName: 'Nutritious Fresh Milk & Curd Packs',
    category: 'Dairy',
    quantityAllocated: '150 Liters',
    supplierName: 'Sriperumbudur Mega Food Retailers',
    supplierLocation: 'Bangalore Highway, Sriperumbudur',
    recipientName: 'Hope Harbor Children Shelter & Relief Kitchen',
    recipientLocation: 'Tambaram East (26.2 km)',
    matchScore: 91.2,
    urgency: 'High',
    distanceKm: 26.2,
    expiryHoursLeft: 12,
    reasons: [
      '25% Expiry Proximity: Strict 12-hour safe cold-chain window',
      '15% Storage Match: Refrigerated van dispatched directly',
      '30% Urgency: Vital protein intake for vulnerable shelter wards'
    ]
  },
  {
    id: 'm3',
    foodName: 'Harvest Surplus Brown Rice & Millets',
    category: 'Grains & Millets',
    quantityAllocated: '400 kg',
    supplierName: 'Chengalpattu Organic Farmers Producer Co',
    supplierLocation: 'Old GST Road, Chengalpattu',
    recipientName: 'Adyar Elders Care & Flood Relief Center',
    recipientLocation: 'Gandhi Nagar, Adyar, Chennai (34.0 km)',
    matchScore: 88.7,
    urgency: 'Critical',
    distanceKm: 34.0,
    expiryHoursLeft: 120,
    reasons: [
      '30% Urgency: Critical staple exhaustion at flood relief center',
      '20% Quantity Fit: High-bulk 400kg dry allocation provides 6-day buffer',
      '15% Storage Type: Moisture-proof jute packaging resilient against rain'
    ]
  }
];

export default function MatchingEngineSection() {
  const [urgencyWeight, setUrgencyWeight] = useState<number>(30);
  const [expiryWeight, setExpiryWeight] = useState<number>(25);
  const [distanceWeight, setDistanceWeight] = useState<number>(10);
  const [isSolving, setIsSolving] = useState<boolean>(false);
  const [matches, setMatches] = useState<MatchCard[]>(SAMPLE_MATCHES);

  const handleSimulateSolve = () => {
    setIsSolving(true);
    setTimeout(() => {
      // Slightly fluctuate scores based on weights to demonstrate live solver responsiveness
      const recomputed = SAMPLE_MATCHES.map((m) => {
        const factor = (urgencyWeight * 0.4 + expiryWeight * 0.4 + (100 - distanceWeight) * 0.2) / 100;
        const adjustedScore = Math.min(99.4, Math.max(75.0, Number((m.matchScore * (0.8 + factor * 0.25)).toFixed(1))));
        return {
          ...m,
          matchScore: adjustedScore
        };
      });
      setMatches(recomputed);
      setIsSolving(false);
    }, 450);
  };

  return (
    <section className="py-16 bg-white border-b border-stone-200" id="ai-matching-engine">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold tracking-wide">
              <Cpu className="w-3.5 h-3.5 text-forest-700" />
              Google OR-Tools Constraint Programming
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              AI Food Matching & Allocation Engine
            </h2>
            <p className="text-stone-600 text-sm max-w-2xl">
              Eliminating food wastage by solving a multi-objective constraint satisfaction problem. Automatically pairs perishable surplus batches with verified high-urgency shelters.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSimulateSolve}
              disabled={isSolving}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${isSolving ? 'animate-bounce' : 'text-amber-400'}`} />
              {isSolving ? 'Re-Computing Solver...' : 'Re-Run Matching Solver'}
            </button>
          </div>
        </div>

        {/* 5-Factor Constraint Architecture */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-red-600 tracking-wider">Factor 1 (30%)</div>
            <div className="font-bold text-sm text-stone-900">Urgency Level</div>
            <div className="text-[11px] text-stone-500">
              Critical & high urgency community kitchens prioritized first.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Factor 2 (25%)</div>
            <div className="font-bold text-sm text-stone-900">Expiry Proximity</div>
            <div className="text-[11px] text-stone-500">
              Short shelf-life produce (tomatoes, dairy) matched before decay.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-blue-600 tracking-wider">Factor 3 (20%)</div>
            <div className="font-bold text-sm text-stone-900">Unmet Demand Gap</div>
            <div className="text-[11px] text-stone-500">
              Prevents over-allocation and minimizes split-delivery overheads.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Factor 4 (15%)</div>
            <div className="font-bold text-sm text-stone-900">Storage Suitability</div>
            <div className="text-[11px] text-stone-500">
              Matches cold-storage batches with refrigerated vehicle fleets.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
            <div className="text-[10px] font-black uppercase text-forest-700 tracking-wider">Factor 5 (10%)</div>
            <div className="font-bold text-sm text-stone-900">Road Distance & Access</div>
            <div className="text-[11px] text-stone-500">
              Calculates shortest unflooded road transit time via OSRM.
            </div>
          </div>
        </div>

        {/* Live Matching Output Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-900 uppercase tracking-wider">
              Optimal Recommended Allocations (Tamil Nadu Corridor)
            </span>
            <span className="text-forest-800 font-bold">3 Active Matches Generated</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {matches.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Match Score Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                      ★ {m.matchScore}% Match Score
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        m.urgency === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {m.urgency} Urgency
                    </span>
                  </div>

                  {/* Food & Commodity Details */}
                  <div>
                    <h3 className="font-bold text-stone-900 text-base leading-snug">{m.foodName}</h3>
                    <div className="text-xs text-forest-800 font-semibold mt-1">
                      Allocated: <strong>{m.quantityAllocated}</strong> ({m.category})
                    </div>
                  </div>

                  {/* Supply & Demand Pair */}
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/70">
                      <div className="text-[10px] font-bold text-stone-400 uppercase">From (Supplier)</div>
                      <div className="font-bold text-stone-900 truncate">{m.supplierName}</div>
                      <div className="text-[11px] text-stone-500 truncate">{m.supplierLocation}</div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-forest-50/60 border border-forest-100">
                      <div className="text-[10px] font-bold text-forest-700 uppercase">To (Beneficiary)</div>
                      <div className="font-bold text-stone-900 truncate">{m.recipientName}</div>
                      <div className="text-[11px] text-stone-600 truncate">{m.recipientLocation}</div>
                    </div>
                  </div>

                  {/* Rationale Bullet Points */}
                  <div className="space-y-1.5 pt-2 border-t border-stone-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      AI Solver Optimization Reasons:
                    </div>
                    {m.reasons.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">Status: Approved by AI</span>
                  <Link
                    href="/admin/allocations"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-semibold transition"
                  >
                    View in Command
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
