'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import {
  CloudRain,
  Play,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Truck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { SimulationResult } from '@/types';

export default function AdminSimulatorPage() {
  const [scenarioType, setScenarioType] = useState<string>('heavy_rainfall');
  const [supplyReductionPct, setSupplyReductionPct] = useState(30);
  const [demandSurgePct, setDemandSurgePct] = useState(40);
  const [rainfallDelayPct, setRainfallDelayPct] = useState(50);
  const [blockedCorridor, setBlockedCorridor] = useState('Maduravoyal Bypass Corridor');
  const [vehicleCutPct, setVehicleCutPct] = useState(40);
  const [windowCutHours, setWindowCutHours] = useState(4);
  const [targetRegion, setTargetRegion] = useState('Tambaram');

  const [simulation, setSimulation] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/simulations/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioType,
          supplyReductionPct,
          demandSurgePct,
          rainfallDelayPct,
          blockedCorridor,
          vehicleCapacityCutPct: vehicleCutPct,
          windowReductionHours: windowCutHours,
          targetRegion,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Simulation failed');

      setSimulation(data.simulation);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSimulation(null);
    setScenarioType('heavy_rainfall');
    setRainfallDelayPct(50);
  };

  const chartData = simulation
    ? [
        {
          metric: 'Fulfillment Rate (%)',
          Original: simulation.original_metrics.fulfillment_rate_pct,
          Revised: simulation.revised_metrics.fulfillment_rate_pct,
        },
        {
          metric: 'Fulfilled Food (kg)',
          Original: simulation.original_metrics.fulfilled_kg,
          Revised: simulation.revised_metrics.fulfilled_kg,
        },
        {
          metric: 'Unmet Demand (kg)',
          Original: simulation.original_metrics.unmet_demand_kg,
          Revised: simulation.revised_metrics.unmet_demand_kg,
        },
        {
          metric: 'Avg Transit (mins)',
          Original: simulation.original_metrics.avg_delivery_mins,
          Revised: simulation.revised_metrics.avg_delivery_mins,
        },
      ]
    : [];

  return (
    <DashboardLayout allowedRole="admin">
      <div className="space-y-6">
        {/* Banner */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                El Niño & Climate Stress Testing
              </span>
            </div>
            <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-1">
              Climate Disruption Simulator
            </h1>
            <p className="text-xs text-stone-500">
              Evaluate distribution plan sensitivity under changing agricultural and road conditions. 
              <span className="text-forest-700 font-semibold ml-1">Runs against isolated projection data without modifying live inventory.</span>
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-50 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs shadow-md shadow-forest-900/10 flex items-center gap-2 transition disabled:opacity-70"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Run Scenario Simulation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scenario Controls Card */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Configure Disruption Scenario
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Disruption Scenario Type
              </label>
              <select
                value={scenarioType}
                onChange={(e) => setScenarioType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white font-semibold"
              >
                <option value="heavy_rainfall">🌧️ 1. Heavy Rainfall & Travel Time Spike</option>
                <option value="road_closure">🚧 2. Arterial Road Blockage (Flooding)</option>
                <option value="supply_shock">📉 3. Supply Reduction (Crop Loss)</option>
                <option value="demand_surge">📈 4. Demand Surge (Evacuee Influx)</option>
                <option value="vehicle_shortage">🚚 5. Vehicle Transport Shortage</option>
                <option value="shortened_window">⏰ 6. Accelerated Perishability Window</option>
              </select>
            </div>

            {/* Dynamic Controls based on Scenario */}
            {scenarioType === 'supply_reduction' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Supply Reduction (%): {supplyReductionPct}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="5"
                  value={supplyReductionPct}
                  onChange={(e) => setSupplyReductionPct(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-700"
                />
              </div>
            )}

            {scenarioType === 'demand_surge' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Regional Demand Surge (%): +{demandSurgePct}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={demandSurgePct}
                  onChange={(e) => setDemandSurgePct(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-700"
                />
              </div>
            )}

            {scenarioType === 'heavy_rainfall' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Transit Delay Penalty (%): +{rainfallDelayPct}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="10"
                  value={rainfallDelayPct}
                  onChange={(e) => setRainfallDelayPct(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-700"
                />
              </div>
            )}

            {scenarioType === 'road_closure' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Blocked Road Segment
                </label>
                <select
                  value={blockedCorridor}
                  onChange={(e) => setBlockedCorridor(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
                >
                  <option value="Maduravoyal Bypass Corridor">Maduravoyal Bypass Corridor</option>
                  <option value="GST Road Tambaram Underpass">GST Road Tambaram Underpass</option>
                  <option value="Kathipara Inner Ring Ramp">Kathipara Inner Ring Ramp</option>
                </select>
              </div>
            )}

            {scenarioType === 'vehicle_shortage' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Fleet Capacity Reduction: -{vehicleCutPct}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="10"
                  value={vehicleCutPct}
                  onChange={(e) => setVehicleCutPct(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-700"
                />
              </div>
            )}

            {scenarioType === 'shortened_window' && (
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Window Reduction (Hours): -{windowCutHours}h
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={windowCutHours}
                  onChange={(e) => setWindowCutHours(parseInt(e.target.value, 10))}
                  className="w-full accent-forest-700"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Affected Target District
              </label>
              <select
                value={targetRegion}
                onChange={(e) => setTargetRegion(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-700 bg-white"
              >
                <option value="Tambaram">Tambaram Low-Lying Sector</option>
                <option value="Chennai">Greater Chennai Coastal Area</option>
                <option value="Chengalpattu">Chengalpattu Rural Belt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Showcase */}
        {simulation ? (
          <div className="space-y-6">
            {/* Before vs After Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Demand Fulfillment Rate
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-400 line-through">
                    {simulation.original_metrics.fulfillment_rate_pct}%
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span
                    className={`text-2xl font-black ${
                      simulation.revised_metrics.fulfillment_rate_pct < simulation.original_metrics.fulfillment_rate_pct
                        ? 'text-red-700'
                        : 'text-emerald-700'
                    }`}
                  >
                    {simulation.revised_metrics.fulfillment_rate_pct}%
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">
                  {simulation.revised_metrics.fulfillment_rate_pct - simulation.original_metrics.fulfillment_rate_pct}% change
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Food Delivered (kg)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-400 line-through">
                    {simulation.original_metrics.fulfilled_kg} kg
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span className="text-2xl font-black text-stone-900">
                    {simulation.revised_metrics.fulfilled_kg} kg
                  </span>
                </div>
                <div className="text-[11px] text-stone-400">Total volume feasible under shock</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  Remaining Unmet Need
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-400 line-through">
                    {simulation.original_metrics.unmet_demand_kg} kg
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span className="text-2xl font-black text-red-700">
                    {simulation.revised_metrics.unmet_demand_kg} kg
                  </span>
                </div>
                <div className="text-[11px] text-red-600/70">Acute deficit requiring buffer stock</div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-2">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                  Average Delivery Transit
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-400 line-through">
                    {simulation.original_metrics.avg_delivery_mins}m
                  </span>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                  <span className="text-2xl font-black text-amber-700">
                    {simulation.revised_metrics.avg_delivery_mins}m
                  </span>
                </div>
                <div className="text-[11px] text-amber-600/70">
                  +{simulation.revised_metrics.avg_delivery_mins - simulation.original_metrics.avg_delivery_mins} mins detour delay
                </div>
              </div>
            </div>

            {/* Comparison Charts */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Plan Comparison: Baseline vs Disrupted Scenario
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="metric" stroke="#94a3b8" fontSize={12} />
                    <YAxis stroke="#94a3b8" fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Original" fill="#15803d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Revised" fill="#ea580c" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Disrupted Routes & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <h3 className="text-sm font-bold text-stone-900">Disrupted Transit Corridors</h3>
                </div>
                {simulation.results.disrupted_routes.length === 0 ? (
                  <p className="text-xs text-stone-500">No road segments impassable under this scenario.</p>
                ) : (
                  <ul className="space-y-2 text-xs">
                    {simulation.results.disrupted_routes.map((r, i) => (
                      <li key={i} className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900 font-medium">
                        ⛔ {r}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-stone-900">Recommended Recovery Actions</h3>
                </div>
                <ul className="space-y-2 text-xs">
                  {simulation.results.recommended_actions.map((act, i) => (
                    <li key={i} className="p-2.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 font-medium">
                      🛡️ {act}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Revised Allocations Table */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-stone-100">
                <h3 className="text-sm font-bold text-stone-900">Revised Mission Delivery Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Supplier</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Food Produce</th>
                      <th className="py-3 px-4">Original Qty</th>
                      <th className="py-3 px-4">Revised Qty</th>
                      <th className="py-3 px-4">Feasibility</th>
                      <th className="py-3 px-4">Operational Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-700">
                    {simulation.results.revised_allocations.map((item, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/50">
                        <td className="py-3.5 px-4 font-bold text-stone-900">{item.supplierName}</td>
                        <td className="py-3.5 px-4 font-medium">{item.recipientName}</td>
                        <td className="py-3.5 px-4">{item.foodName}</td>
                        <td className="py-3.5 px-4 font-semibold text-stone-400 line-through">
                          {item.originalQty} kg
                        </td>
                        <td className="py-3.5 px-4 font-bold text-emerald-800">
                          {item.revisedQty} kg
                        </td>
                        <td className="py-3.5 px-4">
                          {item.feasible ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Feasible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-red-700">
                              <XCircle className="w-3.5 h-3.5" /> Infeasible
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-stone-500">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center space-y-3">
            <CloudRain className="w-12 h-12 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No Simulation Executed Yet</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Select your climate shock parameters above and click <strong>"Run Scenario Simulation"</strong> to stress-test Tamil Nadu food rescue logistics under extreme weather.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
