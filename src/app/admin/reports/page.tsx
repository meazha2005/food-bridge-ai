'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { FileText, Download, Filter } from 'lucide-react';

export default function AdminReportsPage() {
  const [district, setDistrict] = useState('all');

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Report Type,Region,Total Listed (kg),Total Reserved (kg),Total Delivered (kg),Avoided Loss (kg),Beneficiaries\n' +
      `Operational Summary,${district === 'all' ? 'Tamil Nadu State' : district},2300,400,250,250,650\n` +
      'Koyambedu Wholesale Agro,Chennai,600,250,250,250,180\n' +
      'Chengalpattu Farmers Hub,Chengalpattu,1000,0,0,0,350\n' +
      'Sriperumbudur Retailers,Sriperumbudur,200,150,0,0,120\n';

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `foodbridge_operational_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight">Operational Reports & CSV Export</h1>
            <p className="text-xs text-stone-500 mt-1">
              Generate auditable summaries of supply rescue, demand satisfaction, and route feasibility.
            </p>
          </div>

          <div className="flex gap-2">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
            >
              <option value="all">All Tamil Nadu Districts</option>
              <option value="Chennai">Chennai District</option>
              <option value="Tambaram">Tambaram / Chengalpattu</option>
            </select>

            <button
              onClick={handleDownloadCsv}
              className="px-4 py-2 bg-forest-800 text-white font-bold text-xs rounded-xl hover:bg-forest-900 transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" /> Export CSV Report
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Operational Summary Preview ({district === 'all' ? 'Tamil Nadu Region' : district})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="font-bold text-stone-500 block mb-1">Total Supply Rescued</span>
              <div className="text-xl font-black text-stone-900">2,300 kg</div>
              <p className="text-[11px] text-stone-400 mt-0.5">Vegetables, Dairy, and Grains</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="font-bold text-stone-500 block mb-1">Delivered to Kitchens</span>
              <div className="text-xl font-black text-emerald-800">250 kg</div>
              <p className="text-[11px] text-stone-400 mt-0.5">Physical receipt verified</p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="font-bold text-stone-500 block mb-1">Beneficiary Outreach</span>
              <div className="text-xl font-black text-blue-800">650 individuals</div>
              <p className="text-[11px] text-stone-400 mt-0.5">Children shelters and elder care</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
