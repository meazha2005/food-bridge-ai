'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, MapPin, Phone, Mail, Clock, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SupplierProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRole={['supplier', 'admin']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Organization Profile</h1>
            <p className="text-xs text-stone-500 mt-1">Verified Supplier Registry details and facility credentials</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> State Verified
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-stone-700">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Organization Name</span>
              <div className="text-base font-bold text-stone-900">{user?.organization_name || 'Koyambedu Wholesale Agro Hub'}</div>
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Contact Person</span>
              <div className="text-base font-bold text-stone-900">{user?.name}</div>
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Official Email</span>
              <div className="text-sm font-mono text-stone-800">{user?.email}</div>
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Contact Phone</span>
              <div className="text-sm font-mono text-stone-800">{user?.phone || '+91 94441 23456'}</div>
            </div>

            <div className="sm:col-span-2">
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Pickup Facility Address</span>
              <div className="text-sm text-stone-800">Gate 4, Koyambedu Wholesale Market Complex, Chennai, TN 600092</div>
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Storage Capacity</span>
              <div className="text-sm font-semibold text-stone-800">5,000 kg (Ambient & Cold-Storage Buffer)</div>
            </div>

            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Operating Hours</span>
              <div className="text-sm font-semibold text-stone-800">04:00 AM - 08:00 PM (Daily Mandi Hours)</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
