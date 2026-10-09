'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ShieldCheck, Search } from 'lucide-react';
import { AuditLogItem } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/audit-logs')
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Security & Operational Audit Logs</h1>
            <p className="text-xs text-stone-500 mt-1">
              Immutable audit trail of allocations, organization verifications, and inventory reservations.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
            {logs.length} Recorded Security Events
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 flex justify-center">
              <div className="w-7 h-7 border-4 border-forest-700 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500">No logs recorded.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Entity Type</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700 font-mono">
                  {logs.map((l) => (
                    <tr key={l.id} className="hover:bg-stone-50/50">
                      <td className="py-3 px-4 text-stone-400">
                        {new Date(l.created_at).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">{l.actor_name || 'System'}</td>
                      <td className="py-3 px-4 font-bold text-forest-800">{l.action}</td>
                      <td className="py-3 px-4 text-stone-600">{l.entity_type}</td>
                      <td className="py-3 px-4 text-stone-500 max-w-xs truncate">
                        {typeof l.details === 'object' ? JSON.stringify(l.details) : l.details}
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
