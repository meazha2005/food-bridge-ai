'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Building2, CheckCircle2, XCircle, Search, ShieldCheck } from 'lucide-react';
import { Organization } from '@/types';

export default function AdminOrganizationsPage() {
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');

  const fetchOrgs = () => {
    setLoading(true);
    fetch('/api/organizations')
      .then((res) => res.json())
      .then((data) => {
        setOrgs(data.organizations || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrgs();
  }, []);

  const handleUpdateVerification = async (orgId: number, status: string) => {
    try {
      const res = await fetch(`/api/organizations/${orgId}/verification`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes: `Admin approved status: ${status}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification update failed');

      fetchOrgs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = orgs.filter((o) => filterType === 'all' || o.organization_type === filterType);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Organization Verification & Audit</h1>
            <p className="text-xs text-stone-500 mt-1">
              Validate legitimacy and food safety handling capacity for suppliers, NGOs, and community recipients.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
            >
              <option value="all">All Organization Types</option>
              <option value="supplier">Suppliers</option>
              <option value="ngo">NGOs / Food Banks</option>
              <option value="recipient">Recipient Shelters</option>
            </select>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No organizations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">District / City</th>
                    <th className="py-3 px-4">Capacity & Storage</th>
                    <th className="py-3 px-4">Verification</th>
                    <th className="py-3 px-4 text-right">Approval Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filtered.map((o) => (
                    <tr key={o.id} className="hover:bg-stone-50/50">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{o.name}</div>
                        <div className="text-[11px] text-stone-400">{o.address}</div>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-semibold">{o.organization_type}</td>
                      <td className="py-3.5 px-4">{o.city}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold">{o.storage_capacity} kg</span>
                        <span className="text-stone-400"> ({o.storage_type})</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                            o.verification_status === 'verified'
                              ? 'bg-emerald-100 text-emerald-800'
                              : o.verification_status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {o.verification_status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {o.verification_status !== 'verified' && (
                          <button
                            onClick={() => handleUpdateVerification(o.id, 'verified')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 transition"
                          >
                            Approve
                          </button>
                        )}
                        {o.verification_status !== 'rejected' && (
                          <button
                            onClick={() => handleUpdateVerification(o.id, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 text-red-700 font-bold text-[11px] hover:bg-red-50 transition"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
