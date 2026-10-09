import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Terms of Service & Food Safety Protocols</h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 • FoodBridge AI Platform</p>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs text-stone-600 leading-relaxed">
          <h2 className="text-sm font-bold text-stone-900">1. Good Samaritan Protection & Food Safety</h2>
          <p>
            All donors and recipients on FoodBridge AI agree to observe mandatory FSSAI food hygiene standards. Donors must provide accurate condition ratings and safe consumption expiry windows.
          </p>

          <h2 className="text-sm font-bold text-stone-900">2. Real Inventory Integrity</h2>
          <p>
            Parties must not place speculative or duplicate reservation holds. Allocations that cannot be collected prior to the pickup deadline will automatically be released by the system to prevent wastage.
          </p>

          <h2 className="text-sm font-bold text-stone-900">3. Non-Commercial Redistribution</h2>
          <p>
            All food rescued through FoodBridge AI is dedicated strictly for humanitarian feeding in accordance with UN Sustainable Development Goal 2 (Zero Hunger) and cannot be resold.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
