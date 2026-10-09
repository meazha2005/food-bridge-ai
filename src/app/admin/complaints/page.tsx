'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      target_type: 'delivery',
      subject: '15-min Delay in Tambaram Low-lying Access Road',
      description: 'Driver Murugan had to detour around Kathipara underpass flood water.',
      status: 'resolved',
      created_at: '2026-10-09T08:30:00Z',
    },
    {
      id: 2,
      target_type: 'listing',
      subject: 'Packaging Humidity Concern',
      description: 'Greens need quick ventilated transport due to unseasonal rainfall humidity.',
      status: 'under_review',
      created_at: '2026-10-09T09:15:00Z',
    },
  ]);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
          <h1 className="text-2xl font-black text-stone-900 tracking-tight">Reports, Exceptions & Quality Disputes</h1>
          <p className="text-xs text-stone-500 mt-1">
            Investigate delivery disruptions, spoiled food reports, and route exceptions.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Case #</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold">#EX-{c.id}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">{c.subject}</td>
                    <td className="py-3.5 px-4 capitalize">{c.target_type}</td>
                    <td className="py-3.5 px-4 text-stone-600">{c.description}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          c.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {c.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
