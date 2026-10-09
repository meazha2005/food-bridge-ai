import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sprout, Building2, HeartHandshake, Truck, Sparkles, CloudRain, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-forest-700" /> End-to-End Operational Lifecycle
          </div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">How FoodBridge AI Operates</h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            A synchronized, constraint-aware rescue loop coordinating five key stakeholder roles.
          </p>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="space-y-8">
          {/* Step 1 */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl shrink-0">
              1
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Supplier Step</span>
              <h3 className="text-lg font-bold text-stone-900">Surplus Food Listing with Expiry Deadlines</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Wholesale mandi merchants, farmers, and retailers enter surplus perishables specifying food category, exact quantity, storage prerequisites (ambient or cold storage), and a strict pickup deadline.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-800 flex items-center justify-center font-black text-xl shrink-0">
              2
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-red-700">Recipient Step</span>
              <h3 className="text-lg font-bold text-stone-900">Demand Registration & Urgency Tagging</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Community kitchens and flood relief camps post immediate food requirements, number of people to serve, dietary alternatives, and urgency levels (Critical, High, Medium).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-forest-600 shadow-md flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-forest-800 text-emerald-300 flex items-center justify-center font-black text-xl shrink-0">
              3
            </div>
            <div className="space-y-3 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">AI Optimization Engine</span>
              <h3 className="text-lg font-bold text-stone-900">Constraint-Aware Multi-Factor Matching</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                The optimization solver processes thousands of combinations using weighted mathematical criteria:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-semibold text-stone-700 pt-1">
                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-center">Urgency (30%)</div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-center">Expiry Clock (25%)</div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-center">Unmet Need (20%)</div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-center">Food Match (15%)</div>
                <div className="p-2 rounded bg-stone-50 border border-stone-200 text-center">Proximity (10%)</div>
              </div>
              <p className="text-xs text-stone-500">
                Crucially: Hard constraints (safe transit windows, vehicle payload capacity, cold-chain continuity) can never be overridden by matching score.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xl shrink-0">
              4
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Logistics Step</span>
              <h3 className="text-lg font-bold text-stone-900">Automated Dispatch & Resilient Route Navigation</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Upon allocation approval, delivery partners receive pickup instructions with turn-by-turn route suggestions that actively bypass reported waterlogged road segments.
              </p>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xl shrink-0">
              5
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Verification Step</span>
              <h3 className="text-lg font-bold text-stone-900">Digital Handover & Verifiable Impact Accounting</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                Recipients sign off on delivered kilograms upon physical receipt. Only confirmed delivered food increments the official SDG 2 impact metric—ensuring honest, transparent reporting.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-forest-800 text-white font-bold text-sm hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
          >
            Join FoodBridge AI Today
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
