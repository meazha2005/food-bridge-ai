import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sprout, Award, Globe, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" /> UN Sustainable Development Goal 2: Zero Hunger
          </div>
          <h1 className="text-4xl font-black text-stone-900 tracking-tight">Mission & Framework</h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto">
            FoodBridge AI eliminates the gap between food availability and accessibility in climate-disrupted regions.
          </p>
        </div>

        {/* Problem Statement Card */}
        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-stone-900">The Problem: El Niño & Food System Disconnection</h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Climatic anomalies driven by El Niño patterns create sudden agricultural uncertainty across Tamil Nadu. Unseasonal downpours trigger localized flash floods that block primary transport corridors (such as the Chennai-Tambaram-Chengalpattu arterial belt). At the same time, wholesale markets (like Koyambedu) receive harvest batches that risk spoiling within hours, while low-lying shelters and community kitchens face critical food deficits.
          </p>
          <p className="text-sm text-stone-600 leading-relaxed">
            The core challenge is not an absolute deficit of food—it is the <strong>distribution failure during acute disruption</strong>.
          </p>
        </div>

        {/* SDG 2 Alignment Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-stone-900">Direct Alignment with UN SDG 2 Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">Target 2.1</span>
              <h3 className="text-base font-bold text-stone-900">Universal Access to Safe Food</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Prioritizes deliveries to high-vulnerability shelters, orphanages, and relief kitchens with verifiable nutritional needs during extreme weather crises.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">Target 2.4</span>
              <h3 className="text-base font-bold text-stone-900">Resilient Agricultural Systems</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Empowers smallholder farmers and producer companies in Chengalpattu to rescue distress surplus before market closure or spoilage.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">Target 12.3</span>
              <h3 className="text-base font-bold text-stone-900">Halve Supply Chain Food Loss</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Enforces strict safe-handling windows and temperature guidelines, avoiding methane emissions and preserving thousands of edible kilograms.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="bg-forest-900 text-white p-8 rounded-2xl space-y-4">
          <h2 className="text-xl font-bold">Algorithmic Innovation</h2>
          <p className="text-xs sm:text-sm text-forest-200 leading-relaxed">
            Unlike static food donation directories, FoodBridge AI implements mathematical constraint optimization. It evaluates multi-factor scoring (Recipient Urgency, Expiry Windows, Unmet Demand, Food Suitability, and Proximity) and computes real-time routing detours when floodwaters inundate transport roads.
          </p>
          <div className="pt-2">
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 text-forest-950 font-bold text-xs hover:bg-emerald-300 transition"
            >
              Explore the Algorithm & Workflows
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
