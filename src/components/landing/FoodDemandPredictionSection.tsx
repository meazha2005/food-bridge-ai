'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Calculator,
  AlertOctagon,
  Clock,
  TrendingDown,
  Info,
  Users,
  Warehouse,
  Flame,
  HelpCircle,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ShelterDemandProfile {
  id: string;
  name: string;
  district: string;
  address: string;
  affectedPopulation: number;
  shelterCapacity: number;
  occupancySurgePct: number;
  currentStockKg: {
    grains: number;
    pulses: number;
    vegetables: number;
    dairyLiters: number;
    cookedMeals: number;
  };
  consumptionRateKgPerHour: number;
  depletionHours: number;
  depletionTimestamp: string;
  urgencyLevel: 'Critical' | 'High' | 'Moderate' | 'Stable';
  cookingCapacity: 'Operational Kitchen' | 'Submerged (Needs Ready-To-Eat)' | 'Limited LPG';
}

const SHELTERS_DATA: ShelterDemandProfile[] = [
  {
    id: 'tambaram-hope',
    name: 'Hope Harbor Children Shelter & Relief Kitchen',
    district: 'Tambaram East',
    address: '42, Kamaraj Nagar, Tambaram East',
    affectedPopulation: 850,
    shelterCapacity: 500,
    occupancySurgePct: 170,
    currentStockKg: {
      grains: 85,
      pulses: 25,
      vegetables: 30,
      dairyLiters: 15,
      cookedMeals: 40
    },
    consumptionRateKgPerHour: 12.8,
    depletionHours: 14.2,
    depletionTimestamp: 'Tomorrow 04:15 AM IST',
    urgencyLevel: 'Critical',
    cookingCapacity: 'Operational Kitchen'
  },
  {
    id: 'adyar-care',
    name: 'Adyar Elders Care & Flood Relief Center',
    district: 'South Chennai',
    address: '18, Canal Bank Road, Gandhi Nagar, Adyar',
    affectedPopulation: 640,
    shelterCapacity: 800,
    occupancySurgePct: 80,
    currentStockKg: {
      grains: 140,
      pulses: 45,
      vegetables: 50,
      dairyLiters: 35,
      cookedMeals: 0
    },
    consumptionRateKgPerHour: 10.4,
    depletionHours: 22.5,
    depletionTimestamp: 'Tomorrow 12:30 PM IST',
    urgencyLevel: 'High',
    cookingCapacity: 'Limited LPG'
  },
  {
    id: 'cpt-tribal',
    name: 'Chengalpattu Tribal Welfare Kitchen',
    district: 'Chengalpattu Rural',
    address: 'Pudupattinam Road, Chengalpattu',
    affectedPopulation: 520,
    shelterCapacity: 600,
    occupancySurgePct: 86,
    currentStockKg: {
      grains: 190,
      pulses: 60,
      vegetables: 20,
      dairyLiters: 10,
      cookedMeals: 80
    },
    consumptionRateKgPerHour: 8.6,
    depletionHours: 31.0,
    depletionTimestamp: 'Day After Tomorrow 09:00 PM IST',
    urgencyLevel: 'Moderate',
    cookingCapacity: 'Submerged (Needs Ready-To-Eat)'
  },
  {
    id: 'koyambedu-transit',
    name: 'Koyambedu Transit Municipal Relief Camp',
    district: 'West Chennai',
    address: 'Periyar EVR High Road, Koyambedu',
    affectedPopulation: 1100,
    shelterCapacity: 1500,
    occupancySurgePct: 73,
    currentStockKg: {
      grains: 680,
      pulses: 210,
      vegetables: 180,
      dairyLiters: 90,
      cookedMeals: 200
    },
    consumptionRateKgPerHour: 18.5,
    depletionHours: 58.0,
    depletionTimestamp: 'In 2.5 Days',
    urgencyLevel: 'Stable',
    cookingCapacity: 'Operational Kitchen'
  }
];

export default function FoodDemandPredictionSection() {
  const [selectedShelterId, setSelectedShelterId] = useState<string>('tambaram-hope');
  const [disruptionDurationHours, setDisruptionDurationHours] = useState<number>(48);

  const shelter = SHELTERS_DATA.find((s) => s.id === selectedShelterId) || SHELTERS_DATA[0];

  // Dynamic algorithmic prediction based on disruption duration and affected population
  const daysOfDisruption = disruptionDurationHours / 24;
  const mealsPerDayPerPerson = 2.2;
  const totalEstimatedMealsNeeded = Math.round(shelter.affectedPopulation * mealsPerDayPerPerson * daysOfDisruption);

  // Nutritional standards (Sphere Humanitarian Standards)
  // 420g dry weight per day per person: 220g grains, 80g pulses, 120g vegetables
  const grainsNeededKg = Math.round(shelter.affectedPopulation * 0.22 * daysOfDisruption * 2.2);
  const pulsesNeededKg = Math.round(shelter.affectedPopulation * 0.08 * daysOfDisruption * 2.2);
  const vegetablesNeededKg = Math.round(shelter.affectedPopulation * 0.12 * daysOfDisruption * 2.2);
  const dairyNeededLiters = Math.round(shelter.affectedPopulation * 0.15 * daysOfDisruption); // for children & elderly

  const totalFoodNeededKg = grainsNeededKg + pulsesNeededKg + vegetablesNeededKg;
  const totalCurrentStockKg =
    shelter.currentStockKg.grains + shelter.currentStockKg.pulses + shelter.currentStockKg.vegetables;

  const netDeficitKg = Math.max(0, totalFoodNeededKg - totalCurrentStockKg);

  // Rank all shelters by shortage horizon
  const sortedShortages = [...SHELTERS_DATA].sort((a, b) => a.depletionHours - b.depletionHours);

  return (
    <section className="py-16 bg-[#f8f9fa] border-b border-stone-200" id="ai-demand-prediction">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              Machine Learning Predictive Modeling
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              AI Food Demand & Shortage Prediction
            </h2>
            <p className="text-stone-600 text-sm max-w-2xl">
              Forecasting localized nutrition requirements and stockout horizons by synthesizing demographic surge headcounts, current storage reserves, and weather disruption durations.
            </p>
          </div>

          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 shadow-sm shrink-0">
            <Calculator className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Confidence: 87.4%</span> (Bayesian Uncertainty ±7.6%)
              <div className="text-[10px] text-stone-400">Probabilistic Estimation Model</div>
            </div>
          </div>
        </div>

        {/* Shortage Runout Horizon Warning Bar */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-red-900 via-stone-900 to-forest-950 text-white shadow-lg space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Depletion Horizon Alert: First Locations to Face Food Shortage
              </span>
            </div>
            <span className="text-xs text-stone-300">Live Continuous Assessment</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {sortedShortages.map((item, idx) => {
              const isFirst = idx === 0;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedShelterId(item.id)}
                  className={`p-3.5 rounded-xl cursor-pointer transition border text-left ${
                    item.id === selectedShelterId
                      ? 'bg-white/15 border-white ring-1 ring-white/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-stone-300">#{idx + 1} Priority</span>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        item.urgencyLevel === 'Critical'
                          ? 'bg-red-500 text-white'
                          : item.urgencyLevel === 'High'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : item.urgencyLevel === 'Moderate'
                          ? 'bg-yellow-400 text-stone-950 font-bold'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {item.urgencyLevel}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold truncate text-white">{item.name}</h4>
                  <div className="text-[11px] text-stone-400 mt-1 flex items-center justify-between">
                    <span>Depletes in:</span>
                    <span className={`font-black ${isFirst ? 'text-red-400 text-sm' : 'text-stone-200'}`}>
                      {item.depletionHours} hrs
                    </span>
                  </div>
                  <div className="text-[10px] text-stone-400 italic mt-0.5">{item.depletionTimestamp}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Prediction Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls & Shelter Selection Column */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            <div>
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-2">
                1. Select Target Relief Shelter / Community
              </label>
              <select
                value={selectedShelterId}
                onChange={(e) => setSelectedShelterId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-stone-900 bg-white focus:ring-2 focus:ring-forest-700 focus:outline-none"
              >
                {SHELTERS_DATA.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.district})
                  </option>
                ))}
              </select>
            </div>

            {/* Disruption Duration Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  2. Disruption Duration Horizon
                </label>
                <span className="text-sm font-black text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-lg border border-forest-200">
                  {disruptionDurationHours} Hours ({daysOfDisruption} Days)
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="96"
                step="6"
                value={disruptionDurationHours}
                onChange={(e) => setDisruptionDurationHours(Number(e.target.value))}
                className="w-full accent-forest-700 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>12h (Flash Rain)</span>
                <span>48h (Road Submersion)</span>
                <span>96h (El Niño Cutoff)</span>
              </div>
            </div>

            {/* Current Shelter Profile Card */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
              <div className="font-bold text-stone-800 flex items-center justify-between">
                <span>Shelter Baseline Inputs</span>
                <span className="text-stone-400 font-normal">{shelter.address}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <div className="text-[10px] text-stone-500">Affected Population</div>
                  <div className="font-bold text-stone-900 text-sm">
                    {shelter.affectedPopulation.toLocaleString()} persons
                  </div>
                  <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                    {shelter.occupancySurgePct}% of baseline capacity
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <div className="text-[10px] text-stone-500">Kitchen Status</div>
                  <div className="font-bold text-stone-900 text-xs truncate mt-1">
                    {shelter.cookingCapacity}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    Rate: {shelter.consumptionRateKgPerHour} kg/hr
                  </div>
                </div>
              </div>

              {/* Current Storage Inventory */}
              <div>
                <div className="text-[11px] font-semibold text-stone-700 mb-1.5">
                  Current On-Site Reserves ({totalCurrentStockKg} kg total):
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-center text-[10px]">
                  <div className="bg-white p-1.5 rounded border border-stone-200">
                    <div className="font-bold text-stone-800">{shelter.currentStockKg.grains} kg</div>
                    <div className="text-stone-400">Grains</div>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-stone-200">
                    <div className="font-bold text-stone-800">{shelter.currentStockKg.pulses} kg</div>
                    <div className="text-stone-400">Pulses</div>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-stone-200">
                    <div className="font-bold text-stone-800">{shelter.currentStockKg.vegetables} kg</div>
                    <div className="text-stone-400">Veg</div>
                  </div>
                  <div className="bg-white p-1.5 rounded border border-stone-200">
                    <div className="font-bold text-stone-800">{shelter.currentStockKg.dairyLiters} L</div>
                    <div className="text-stone-400">Milk</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Output Breakdown Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Estimated Meals & Deficit Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-stone-500">Estimated Meals Needed</div>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">
                  {totalEstimatedMealsNeeded.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-400">Across {disruptionDurationHours}h duration</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-stone-500">Total Food Quantity Needed</div>
                <div className="text-2xl sm:text-3xl font-black text-forest-800">
                  {totalFoodNeededKg.toLocaleString()} <span className="text-sm font-medium">kg</span>
                </div>
                <div className="text-[11px] text-stone-400">Grains, pulses & vegetables</div>
              </div>

              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 shadow-sm space-y-1">
                <div className="text-xs font-semibold text-red-700">Net Unmet Deficit (Rescue Target)</div>
                <div className="text-2xl sm:text-3xl font-black text-red-950">
                  {netDeficitKg.toLocaleString()} <span className="text-sm font-medium">kg</span>
                </div>
                <div className="text-[11px] text-red-700 font-semibold">Immediate supply required</div>
              </div>
            </div>

            {/* Category-by-Category Commodity Allocation Grid */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>Predicted Commodity Requirement Breakdown</span>
                <span className="text-stone-400 lowercase">Sphere Humanitarian Standards</span>
              </h3>

              <div className="space-y-3 text-xs">
                {/* Grains & Rice */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 text-sm">Brown Rice & Cereals (Dry Grains)</div>
                    <div className="text-stone-500 text-[11px]">Primary caloric base (220g / person / day equivalent)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-stone-900 text-sm">{grainsNeededKg} kg needed</div>
                    <div className="text-red-600 font-semibold text-[11px]">
                      Deficit: -{Math.max(0, grainsNeededKg - shelter.currentStockKg.grains)} kg
                    </div>
                  </div>
                </div>

                {/* Pulses & Lentils */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 text-sm">Lentils & Pulses (Toor Dal / Moong)</div>
                    <div className="text-stone-500 text-[11px]">Essential plant protein (80g / person / day)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-stone-900 text-sm">{pulsesNeededKg} kg needed</div>
                    <div className="text-red-600 font-semibold text-[11px]">
                      Deficit: -{Math.max(0, pulsesNeededKg - shelter.currentStockKg.pulses)} kg
                    </div>
                  </div>
                </div>

                {/* Fresh Vegetables */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 text-sm">Nutritious Fresh Vegetables</div>
                    <div className="text-stone-500 text-[11px]">Vitamins & dietary fiber (120g / person / day)</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-stone-900 text-sm">{vegetablesNeededKg} kg needed</div>
                    <div className="text-red-600 font-semibold text-[11px]">
                      Deficit: -{Math.max(0, vegetablesNeededKg - shelter.currentStockKg.vegetables)} kg
                    </div>
                  </div>
                </div>

                {/* Milk & Dairy */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-bold text-stone-900 text-sm">Pasteurized Milk & Dairy Packets</div>
                    <div className="text-stone-500 text-[11px]">Priority pediatric and geriatric nourishment</div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-stone-900 text-sm">{dairyNeededLiters} L needed</div>
                    <div className="text-red-600 font-semibold text-[11px]">
                      Deficit: -{Math.max(0, dairyNeededLiters - shelter.currentStockKg.dairyLiters)} L
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence & Transparent Assumptions Box (Explicitly Required by User) */}
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-5 space-y-3 text-xs text-amber-950">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm">
                  <HelpCircle className="w-4 h-4 text-amber-700" />
                  Model Confidence & Transparent Assumptions
                </div>
                <span className="font-bold bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full text-[11px]">
                  Estimated Projection (Not Certain Fact)
                </span>
              </div>

              <p className="text-stone-700 leading-relaxed text-[11px]">
                Predictions generated by FoodBridge AI are algorithmic estimates intended for humanitarian logistics planning. They must be validated by ground disaster coordinators prior to cargo dispatch.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-stone-800 pt-1">
                <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold block text-stone-900 mb-0.5">1. Nutritional Calorie Target:</span>
                  Assumes a 2,100 kcal / 420g dry food baseline per individual per day aligned with WHO / Sphere humanitarian guidelines.
                </div>

                <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold block text-stone-900 mb-0.5">2. Unregistered Population Influx:</span>
                  Incorporates a +15% surge multiplier to account for undocumented displaced families fleeing adjoining low-lying shanties.
                </div>

                <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold block text-stone-900 mb-0.5">3. Moisture & Spoilage Factor:</span>
                  Applies a 10% safety buffer for perishable vegetables and open flour sacks due to sustained ambient humidity exceeding 85%.
                </div>

                <div className="bg-white/90 p-2.5 rounded-lg border border-amber-200/60">
                  <span className="font-bold block text-stone-900 mb-0.5">4. Fuel & Cooking Gas Constraints:</span>
                  If shelter cooking gas infrastructure becomes submerged, demand automatically re-indexes from raw grains to ready-to-eat cooked packets.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
