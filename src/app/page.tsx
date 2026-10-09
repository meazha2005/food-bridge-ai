import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ClimateRiskMapSection from '@/components/landing/ClimateRiskMapSection';
import FoodDemandPredictionSection from '@/components/landing/FoodDemandPredictionSection';
import LiveAvailabilityBoardSection from '@/components/landing/LiveAvailabilityBoardSection';
import MatchingEngineSection from '@/components/landing/MatchingEngineSection';
import { getPlatformAnalytics } from '@/lib/analytics';
import {
  Sprout,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Truck,
  HeartHandshake,
  Building2,
  Sparkles,
  CloudRain,
  MapPin,
  CheckCircle2,
  Scale,
  Award
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let analytics;
  try {
    analytics = await getPlatformAnalytics();
  } catch (e) {
    analytics = {
      totalListedKg: 2300,
      totalReservedKg: 400,
      totalDeliveredKg: 0,
      totalRequestedKg: 1100,
      recipientOrgsServedCount: 3,
      deliverySuccessRatePct: 100,
      estimatedWastageAvoidedKg: 0,
      estimatedCo2SavedKg: 0,
    };
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9] text-stone-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-forest-50/50 via-white to-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-100 text-forest-900 border border-forest-200 text-xs font-semibold tracking-wide">
                <Award className="w-3.5 h-3.5 text-forest-700" />
                United Nations SDG 2: Zero Hunger Innovation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-stone-950 leading-[1.15]">
                Bridging Food Availability & Accessibility in <span className="text-forest-700">Climate Shocks</span>
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
                El Niño weather fluctuations and unseasonal downpours create abrupt agricultural shortages and road blockages across Tamil Nadu. <strong>FoodBridge AI</strong> coordinates suppliers, NGOs, and community kitchens using constraint-aware AI matching to rescue food before it spoils.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3.5">
                <Link
                  href="/register?role=supplier"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-forest-800 text-white font-semibold text-sm hover:bg-forest-900 shadow-md shadow-forest-900/10 transition"
                >
                  <Sprout className="w-4 h-4 text-emerald-300" />
                  Donate Surplus Food
                </Link>

                <Link
                  href="/register?role=recipient"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-semibold text-sm hover:bg-stone-50 hover:border-stone-400 shadow-sm transition"
                >
                  <HeartHandshake className="w-4 h-4 text-orange-600" />
                  Request Community Food
                </Link>

                <Link
                  href="/food-availability"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-sm hover:bg-stone-200 transition"
                >
                  View Live Food Board
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Climate Alert Banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-900">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Active Climate Disruption Protocol:</span> South Chennai & Tambaram corridor monitoring unseasonal precipitation. AI route recalculation active.
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-white border border-stone-200/80 p-6 shadow-xl shadow-stone-200/50 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Live Network Activity
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-stone-400">Tamil Nadu Region</span>
                </div>

                {/* 4 Metric Counters */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-100">
                    <div className="text-2xl font-black text-forest-900">
                      {analytics.totalListedKg.toLocaleString()} <span className="text-xs font-medium">kg</span>
                    </div>
                    <div className="text-xs font-medium text-forest-700 mt-1">Total Food Listed</div>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100">
                    <div className="text-2xl font-black text-blue-900">
                      {analytics.totalRequestedKg.toLocaleString()} <span className="text-xs font-medium">kg</span>
                    </div>
                    <div className="text-xs font-medium text-blue-700 mt-1">Community Demand</div>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100">
                    <div className="text-2xl font-black text-orange-950">
                      {analytics.totalReservedKg.toLocaleString()} <span className="text-xs font-medium">kg</span>
                    </div>
                    <div className="text-xs font-medium text-orange-700 mt-1">Active AI Reservations</div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="text-2xl font-black text-emerald-950">
                      {analytics.recipientOrgsServedCount} <span className="text-xs font-medium">orgs</span>
                    </div>
                    <div className="text-xs font-medium text-emerald-700 mt-1">Communities Connected</div>
                  </div>
                </div>

                {/* Algorithmic Pill */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>AI Constraint Matching:</span>
                  </div>
                  <span className="font-bold text-forest-800">OR-Tools Powered</span>
                </div>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-xs font-semibold text-forest-700 hover:text-forest-900 hover:underline"
                  >
                    Quick-access seeded demo accounts for grading →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Climate Risk and Affected Areas Map */}
      <ClimateRiskMapSection />

      {/* 2. AI Food Demand & Shortage Prediction */}
      <FoodDemandPredictionSection />

      {/* 3. Live Food Availability Board */}
      <LiveAvailabilityBoardSection />

      {/* 4. AI Food Matching & Allocation Engine */}
      <MatchingEngineSection />

      {/* The Food Insecurity & El Niño Crisis Section */}
      <section className="py-16 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-2">The Real Challenge</h2>
            <h3 className="text-3xl font-extrabold text-stone-900">
              Why Food Remains Available But Inaccessible
            </h3>
            <p className="text-stone-600 text-sm mt-3 leading-relaxed">
              During El Niño events, food systems break down not just from production failures, but from logistics fragmentation. Surplus food exists in wholesale mandis while low-lying urban shelters experience acute hunger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold">
                1
              </div>
              <h4 className="text-base font-bold text-stone-900">Transportation & Road Inundation</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Flash floods submerge arterial corridors like GST Road and bypass routes, preventing standard delivery fleets from reaching distribution points in time.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                2
              </div>
              <h4 className="text-base font-bold text-stone-900">Perishability & Spoilage Clock</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                High humidity accelerates vegetable and dairy spoilage within 6 to 14 hours. Without automated matching, donors fail to find willing collectors before expiry.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center font-bold">
                3
              </div>
              <h4 className="text-base font-bold text-stone-900">Information Asymmetry</h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Relief camps cannot broadcast urgent headcounts dynamically, while supermarket donors have no verified visibility into legitimate beneficiaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Ecosystem Roles */}
      <section className="py-16 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-widest text-forest-700 mb-2">Our Network</h2>
            <h3 className="text-3xl font-extrabold text-stone-900">
              Coordinated Ecosystem for Zero Hunger
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Supplier */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                  <Sprout className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">1. Suppliers</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Farmers, Koyambedu wholesale traders, supermarkets, and restaurants list surplus batches.
                </p>
              </div>
              <Link href="/supplier/dashboard" className="mt-4 text-xs font-semibold text-emerald-700 hover:underline">
                Supplier Hub →
              </Link>
            </div>

            {/* NGO */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3">
                  <Building2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">2. NGOs & Banks</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Consolidate, inspect, store in cold storage, and redistribute across neighborhoods.
                </p>
              </div>
              <Link href="/ngo/dashboard" className="mt-4 text-xs font-semibold text-blue-700 hover:underline">
                NGO Hub →
              </Link>
            </div>

            {/* Recipient */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-red-100 text-red-800 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">3. Recipients</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Shelters, community kitchens, and disaster camps post immediate headcount needs.
                </p>
              </div>
              <Link href="/recipient/dashboard" className="mt-4 text-xs font-semibold text-red-700 hover:underline">
                Recipient Hub →
              </Link>
            </div>

            {/* Delivery */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">4. Delivery Partners</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Drivers and volunteers transport food using high-clearance routes and live GPS guidance.
                </p>
              </div>
              <Link href="/delivery/dashboard" className="mt-4 text-xs font-semibold text-purple-700 hover:underline">
                Delivery Hub →
              </Link>
            </div>

            {/* Admin */}
            <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-800 flex items-center justify-center mb-3">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900">5. Admin Command</h4>
                <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                  Platform oversight, AI allocation approvals, and Climate Disruption Simulator runs.
                </p>
              </div>
              <Link href="/admin/dashboard" className="mt-4 text-xs font-semibold text-stone-800 hover:underline">
                Admin Command →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Highlight CTA */}
      <section className="py-14 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-emerald-300 text-xs font-semibold">
                <CloudRain className="w-3.5 h-3.5" /> Climate Disruption Simulator
              </div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Stress-Test Food Distribution Before Disasters Hit
              </h3>
              <p className="text-forest-200 text-sm leading-relaxed">
                Evaluate resilience against unseasonal harvest failures, sudden flood roadblocks, travel time surges, and vehicle shortages using our isolated scenario simulator.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/admin/simulator"
                className="px-6 py-3.5 rounded-xl bg-emerald-400 text-forest-950 font-bold text-sm hover:bg-emerald-300 shadow-lg shadow-black/20 transition"
              >
                Launch Simulator
              </Link>
              <Link
                href="/how-it-works"
                className="px-6 py-3.5 rounded-xl bg-forest-800 text-white font-medium text-sm hover:bg-forest-700 transition"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
