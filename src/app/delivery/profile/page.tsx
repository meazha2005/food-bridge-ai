'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Truck, CheckCircle2 } from 'lucide-react';

export default function DeliveryProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRole={['delivery', 'admin']}>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Driver Partner Profile</h1>
            <p className="text-xs text-stone-500 mt-1">Vehicle registration, payload capacity, and operating credentials</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active Fleet Driver
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Driver Name</span>
              <div className="text-base font-bold text-stone-900">{user?.name || 'Murugan K.'}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Mobile / Dispatch Phone</span>
              <div className="text-base font-mono text-stone-900">{user?.phone || '+91 97890 12345'}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Registered Vehicle</span>
              <div className="text-sm font-semibold text-stone-800">Tata Ace Refrig 1-Ton Mini Truck (TN-09-CB-4491)</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Maximum Payload</span>
              <div className="text-sm font-semibold text-stone-800">1,000 kg (Insulated Cold-Box Equipped)</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Primary Corridor</span>
              <div className="text-sm font-semibold text-stone-800">South Chennai • Tambaram • Chengalpattu Express</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">High-Clearance Rating</span>
              <div className="text-sm font-semibold text-stone-800">Class-B Flood Wading (up to 45cm water depth)</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
