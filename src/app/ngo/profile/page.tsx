'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, CheckCircle2 } from 'lucide-react';

export default function NgoProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRole={['ngo', 'admin']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">NGO Organization Profile</h1>
            <p className="text-xs text-stone-500 mt-1">Regional Food Bank Registry details and warehouse capacity</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Verified Hub
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Organization Name</span>
              <div className="text-base font-bold text-stone-900">{user?.organization_name || 'Chennai Food Rescue Bank'}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Lead Coordinator</span>
              <div className="text-base font-bold text-stone-900">{user?.name}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Official Contact Email</span>
              <div className="text-sm font-mono text-stone-800">{user?.email}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Helpline Phone</span>
              <div className="text-sm font-mono text-stone-800">{user?.phone || '+91 98840 12345'}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Central Warehouse Address</span>
              <div className="text-sm text-stone-800">14, 2nd Main Road, Anna Nagar, Chennai, TN 600040</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Warehouse Storage Capacity</span>
              <div className="text-sm font-semibold text-stone-800">4,000 kg (Walk-in Refrig & Dry Storage)</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Service Radius</span>
              <div className="text-sm font-semibold text-stone-800">Greater Chennai, Tambaram & Chengalpattu</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
