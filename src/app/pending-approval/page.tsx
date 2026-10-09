import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, ShieldCheck, Mail } from 'lucide-react';

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Clock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-stone-900">Verification in Progress</h1>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your organization details have been received and are undergoing verification by the platform administration to uphold food safety protocols.
          </p>
          <div className="p-3 bg-stone-50 rounded-xl text-xs text-stone-500 border border-stone-200/60">
            For expedited clearance during active disaster relief operations, contact the state control hub at <strong className="text-stone-800">relief@foodbridge.org</strong>.
          </div>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-xl bg-forest-800 text-white font-bold text-xs"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
