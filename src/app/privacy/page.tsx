import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <h1 className="text-3xl font-black text-stone-900">Privacy Policy & Data Isolation</h1>
        <p className="text-xs text-stone-500">Effective Date: October 2026 • FoodBridge AI Platform</p>

        <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs text-stone-600 leading-relaxed">
          <h2 className="text-sm font-bold text-stone-900">1. Data Minimization & Public Protection</h2>
          <p>
            FoodBridge AI protects sensitive location data of food donors and vulnerable beneficiary shelters. Public listings display generalized locality approximations rather than precise residential or warehouse gate coordinates until a reservation is formally matched and verified.
          </p>

          <h2 className="text-sm font-bold text-stone-900">2. Organization Isolation</h2>
          <p>
            Each registered organization has segregated access to its private demand figures, operating history, and internal member notes. Cross-organization access is strictly mediated by platform authorization policies.
          </p>

          <h2 className="text-sm font-bold text-stone-900">3. Simulation vs. Operational Separation</h2>
          <p>
            Climate disruption simulations and scenario calculations are executed on isolated in-memory projections. Simulations never access, mutate, reserve, or disclose real inventory records or operational driver routes.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
