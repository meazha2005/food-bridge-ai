'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings, Lock, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Account & Security Settings</h1>
          <p className="text-xs text-stone-500 mt-1">Manage notification preferences and password security</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4 text-xs">
          <h2 className="font-bold text-stone-900 text-sm">Communication Preferences</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-forest-800" />
              <span>Receive urgent El Niño climate disruption warnings</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-forest-800" />
              <span>Receive delivery arrival SMS / Email notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-forest-800" />
              <span>Weekly SDG 2 food rescue impact summaries</span>
            </label>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
