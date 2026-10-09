'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { User, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => {});
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Personal & Account Profile</h1>
            <p className="text-xs text-stone-500 mt-1">Manage user credentials and linked organizational membership</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold capitalize">
            <CheckCircle2 className="w-3.5 h-3.5" /> {user?.role} Role
          </span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6 text-xs text-stone-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Full Name</span>
              <div className="text-base font-bold text-stone-900">{user?.name}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Assigned Role</span>
              <div className="text-base font-bold text-forest-800 uppercase">{user?.role}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Email Address</span>
              <div className="text-sm font-mono text-stone-800">{user?.email}</div>
            </div>
            <div>
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Contact Phone</span>
              <div className="text-sm font-mono text-stone-800">{user?.phone || '+91 94441 23456'}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="font-bold text-stone-500 uppercase tracking-wider block mb-1">Linked Organization</span>
              <div className="text-sm font-semibold text-stone-900">{user?.organization_name || 'Autonomous Network Partner'}</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
