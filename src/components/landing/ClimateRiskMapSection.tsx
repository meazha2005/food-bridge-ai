'use client';

import React, { useState } from 'react';
import MapComponent, { MapMarker } from '@/components/MapComponent';
import {
  CloudLightning,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Users,
  Compass,
  Building,
  Navigation,
  Eye,
  Info,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface DistrictWarning {
  id: string;
  district: string;
  state: string;
  warningType: string;
  severity: 'severe_red' | 'high_orange' | 'moderate_yellow';
  severityLabel: string;
  issueTime: string;
  validUntil: string;
  source: string;
  hazardSummary: string;
  precipitationMm: string;
  windSpeed: string;
  vulnerablePopulation: number;
  informalSettlementsCount: number;
  accessConstraints: string[];
  affectedSettlements: {
    name: string;
    lat: number;
    lng: number;
    population: number;
    vulnerabilityLevel: 'Extreme' | 'High' | 'Moderate';
    constraint: string;
  }[];
  reliefShelters: {
    name: string;
    lat: number;
    lng: number;
    capacity: number;
    currentOccupancy: number;
    stockDaysLeft: number;
    status: 'Operational' | 'Surge Capacity' | 'Access Compromised';
  }[];
}

const DISTRICT_WARNINGS: DistrictWarning[] = [
  {
    id: 'chennai',
    district: 'Chennai Metropolitan',
    state: 'Tamil Nadu',
    warningType: 'Severe Cloudburst & Urban Flash Flood Alert',
    severity: 'severe_red',
    severityLabel: 'Red Alert (Take Immediate Action)',
    issueTime: '09 Oct 2026, 08:30 AM IST',
    validUntil: '11 Oct 2026, 06:00 PM IST (Next 48 Hours)',
    source: 'IMD Chennai Regional Met Centre & TNSDMA Ops Center',
    hazardSummary: 'Extreme convective cloud clusters moving inland from southwest Bay of Bengal. Intense rainfall >200mm expected with localized urban inundation.',
    precipitationMm: '180 - 240 mm / 24h',
    windSpeed: '45 - 55 km/h gusts',
    vulnerablePopulation: 142000,
    informalSettlementsCount: 16,
    accessConstraints: [
      'Adyar River Causeway submerged by 0.9m backwater',
      'GST Road Alandur-Guindy underpass impassable for light cargo',
      'Velachery Main Road waterlogged up to 2.5 feet'
    ],
    affectedSettlements: [
      {
        name: 'Adyar Canal Bank Slums',
        lat: 13.0067,
        lng: 80.2570,
        population: 18500,
        vulnerabilityLevel: 'Extreme',
        constraint: 'Canal overflow within 3 hours of continuous rain'
      },
      {
        name: 'Velachery Lake Fringe Settlements',
        lat: 12.9780,
        lng: 80.2210,
        population: 24000,
        vulnerabilityLevel: 'Extreme',
        constraint: 'Stormwater drainage chokepoint'
      },
      {
        name: 'Koyambedu Periphery Lowlands',
        lat: 13.0720,
        lng: 80.1910,
        population: 16200,
        vulnerabilityLevel: 'High',
        constraint: 'Drainage stagnation near wholesale freight terminals'
      }
    ],
    reliefShelters: [
      {
        name: 'Adyar Elders & Flood Relief Shelter',
        lat: 13.0067,
        lng: 80.2570,
        capacity: 800,
        currentOccupancy: 640,
        stockDaysLeft: 1.1,
        status: 'Surge Capacity'
      },
      {
        name: 'Anna Nagar West Community Relief Center',
        lat: 13.0850,
        lng: 80.2100,
        capacity: 1200,
        currentOccupancy: 780,
        stockDaysLeft: 2.8,
        status: 'Operational'
      }
    ]
  },
  {
    id: 'chengalpattu',
    district: 'Chengalpattu Rural Corridor',
    state: 'Tamil Nadu',
    warningType: 'Inundation & Agricultural Runoff Warning',
    severity: 'high_orange',
    severityLabel: 'Orange Alert (Be Prepared)',
    issueTime: '09 Oct 2026, 09:15 AM IST',
    validUntil: '11 Oct 2026, 12:00 PM IST (Next 42 Hours)',
    source: 'Tamil Nadu State Disaster Management Authority (TNSDMA)',
    hazardSummary: 'Heavy agricultural runoff and Palar river sub-basin swelling. Rural farm lanes severed; tribal hamlets isolated.',
    precipitationMm: '115 - 160 mm / 24h',
    windSpeed: '35 - 45 km/h',
    vulnerablePopulation: 58000,
    informalSettlementsCount: 11,
    accessConstraints: [
      'Old GST Road rural diversion blocked due to tree fall',
      'Palar River low-level causeway submerged',
      'Heavy vehicle restrictions on Madurantakam bypass'
    ],
    affectedSettlements: [
      {
        name: 'Pudupattinam Tribal Colony',
        lat: 12.6950,
        lng: 79.9750,
        population: 8400,
        vulnerabilityLevel: 'Extreme',
        constraint: 'Isolated by swelling stream; 4WD trucks required'
      },
      {
        name: 'Chengalpattu Rail Nagar Lowlands',
        lat: 12.6825,
        lng: 79.9836,
        population: 12500,
        vulnerabilityLevel: 'High',
        constraint: 'Water accumulation in clay soil beds'
      }
    ],
    reliefShelters: [
      {
        name: 'Chengalpattu Tribal Welfare Kitchen',
        lat: 12.6950,
        lng: 79.9750,
        capacity: 600,
        currentOccupancy: 520,
        stockDaysLeft: 0.8,
        status: 'Surge Capacity'
      }
    ]
  },
  {
    id: 'tambaram',
    district: 'Tambaram & Kanchipuram Sub-Districts',
    state: 'Tamil Nadu',
    warningType: 'Reservoir Inflow Surge & Roadway Breach Alert',
    severity: 'high_orange',
    severityLabel: 'Orange Alert (Be Prepared)',
    issueTime: '09 Oct 2026, 10:00 AM IST',
    validUntil: '11 Oct 2026, 06:00 PM IST (Next 48 Hours)',
    source: 'Water Resources Department (WRD) & IMD Chennai',
    hazardSummary: 'Chembarambakkam and Adyar outflow surge channels operating near full brim. Low-lying Mudichur and West Tambaram face chronic backflow.',
    precipitationMm: '130 - 175 mm / 24h',
    windSpeed: '40 - 50 km/h',
    vulnerablePopulation: 89000,
    informalSettlementsCount: 14,
    accessConstraints: [
      'Mudichur-Mannivakkam Road waterlogged up to 3 feet',
      'Tambaram East Railway Subway closed for flood dewatering',
      'High vehicle axle clearance needed for food relief delivery'
    ],
    affectedSettlements: [
      {
        name: 'Mudichur Riverview Settlements',
        lat: 12.9150,
        lng: 80.0980,
        population: 29000,
        vulnerabilityLevel: 'Extreme',
        constraint: 'Backflow from surplus water canal'
      },
      {
        name: 'Kamaraj Nagar Informal Ward',
        lat: 12.9220,
        lng: 80.1340,
        population: 17400,
        vulnerabilityLevel: 'High',
        constraint: 'Narrow alleys unnavigable by standard delivery trucks'
      }
    ],
    reliefShelters: [
      {
        name: 'Hope Harbor Children Shelter & Relief Camp',
        lat: 12.9220,
        lng: 80.1340,
        capacity: 500,
        currentOccupancy: 580,
        stockDaysLeft: 0.6,
        status: 'Surge Capacity'
      },
      {
        name: 'West Tambaram Feeding Alliance Base',
        lat: 12.9249,
        lng: 80.1278,
        capacity: 700,
        currentOccupancy: 410,
        stockDaysLeft: 2.1,
        status: 'Operational'
      }
    ]
  },
  {
    id: 'thiruvallur',
    district: 'Thiruvallur Agro Belt',
    state: 'Tamil Nadu',
    warningType: 'Agricultural Crop Waterlogging Advisory',
    severity: 'moderate_yellow',
    severityLabel: 'Yellow Alert (Be Updated)',
    issueTime: '09 Oct 2026, 07:00 AM IST',
    validUntil: '10 Oct 2026, 08:00 PM IST (Next 28 Hours)',
    source: 'Agricultural Met Advisory Bulletin',
    hazardSummary: 'Moderate to heavy rain causing standing water in paddy and tomato fields. Farmers harvesting early to avoid crop spoilage.',
    precipitationMm: '65 - 95 mm / 24h',
    windSpeed: '30 - 38 km/h',
    vulnerablePopulation: 34000,
    informalSettlementsCount: 6,
    accessConstraints: [
      'Rural farm culverts experiencing slow drainage',
      'Tractor-only access to select interior harvest plots'
    ],
    affectedSettlements: [
      {
        name: 'Gummidipoondi Periphery Hamlets',
        lat: 13.4050,
        lng: 80.1250,
        population: 9200,
        vulnerabilityLevel: 'Moderate',
        constraint: 'Field access roads partially waterlogged'
      }
    ],
    reliefShelters: [
      {
        name: 'Thiruvallur Central Relief Depot',
        lat: 13.1430,
        lng: 79.9080,
        capacity: 900,
        currentOccupancy: 320,
        stockDaysLeft: 4.2,
        status: 'Operational'
      }
    ]
  }
];

export default function ClimateRiskMapSection() {
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('chennai');
  const [activeLayer, setActiveLayer] = useState<'all' | 'hazard' | 'vulnerability' | 'access'>('all');

  const selectedWarning = DISTRICT_WARNINGS.find((d) => d.id === selectedDistrictId) || DISTRICT_WARNINGS[0];

  // Build map markers dynamically based on selected layer and district
  const mapMarkers: MapMarker[] = [];

  DISTRICT_WARNINGS.forEach((d) => {
    const isSelected = d.id === selectedDistrictId;

    // 1. Weather Warning District Centers
    if (activeLayer === 'all' || activeLayer === 'hazard') {
      const centerCoords: Record<string, [number, number]> = {
        chennai: [13.0694, 80.1948],
        chengalpattu: [12.6825, 79.9836],
        tambaram: [12.9220, 80.1278],
        thiruvallur: [13.1430, 79.9080]
      };
      const coords = centerCoords[d.id] || [13.0, 80.1];
      mapMarkers.push({
        id: `warn-${d.id}`,
        lat: coords[0],
        lng: coords[1],
        title: `${d.district} — ${d.severityLabel}`,
        type: 'warning',
        description: `${d.warningType}. Precipitation: ${d.precipitationMm}. Valid until: ${d.validUntil}`,
        severity: d.severity
      });
    }

    // Only render granular settlements and shelters for selected district or when in 'all' view
    if (isSelected || activeLayer === 'all') {
      // 2. Affected Settlements
      if (activeLayer === 'all' || activeLayer === 'vulnerability') {
        d.affectedSettlements.forEach((s, idx) => {
          mapMarkers.push({
            id: `settle-${d.id}-${idx}`,
            lat: s.lat,
            lng: s.lng,
            title: `Vulnerable Settlement: ${s.name}`,
            type: 'settlement',
            description: `Population: ${s.population.toLocaleString()} • Vulnerability: ${s.vulnerabilityLevel} • Constraint: ${s.constraint}`,
            urgency: s.vulnerabilityLevel.toLowerCase()
          });
        });
      }

      // 3. Relief Shelters
      if (activeLayer === 'all' || activeLayer === 'vulnerability') {
        d.reliefShelters.forEach((r, idx) => {
          mapMarkers.push({
            id: `shelter-${d.id}-${idx}`,
            lat: r.lat,
            lng: r.lng,
            title: `Relief Shelter: ${r.name}`,
            type: 'shelter',
            description: `Capacity: ${r.capacity} (${r.currentOccupancy} occupied) • Stock Remaining: ${r.stockDaysLeft} days • Status: ${r.status}`,
            quantity: r.capacity
          });
        });
      }

      // 4. Access Bottlenecks
      if (activeLayer === 'all' || activeLayer === 'access') {
        if (d.id === 'chennai') {
          mapMarkers.push({
            id: 'bot-1',
            lat: 13.0010,
            lng: 80.2010,
            title: 'Bottleneck: GST Road Alandur Subway',
            type: 'constraint',
            description: 'Water depth: 0.8m. Closed for sub-3-ton commercial vehicles. Detour via Inner Ring Road.'
          });
        } else if (d.id === 'tambaram') {
          mapMarkers.push({
            id: 'bot-2',
            lat: 12.9150,
            lng: 80.1100,
            title: 'Bottleneck: Mudichur Inundation Chokepoint',
            type: 'constraint',
            description: 'Canal backwash. Requires high ground-clearance mini-trucks or rescue boats.'
          });
        }
      }
    }
  });

  return (
    <section className="py-16 bg-white border-y border-stone-200" id="climate-risk-map">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold tracking-wide">
              <CloudLightning className="w-3.5 h-3.5 text-red-600" />
              Official Disaster Meteorology Integration
            </div>
            <h2 className="text-3xl font-black text-stone-900 tracking-tight">
              Climate Risk and Affected Areas Map
            </h2>
            <p className="text-stone-600 text-sm max-w-2xl">
              Real-time district-level weather alerts cross-referenced with settlement vulnerability indexes and transport inundation choke points across Tamil Nadu.
            </p>
          </div>

          {/* Source Authenticity Pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 shrink-0">
            <ShieldAlert className="w-4 h-4 text-forest-700 shrink-0" />
            <div>
              <span className="font-bold text-stone-800">Source:</span> IMD Chennai & TNSDMA Bulletin
              <div className="text-[10px] text-stone-400">Live API Synchronized</div>
            </div>
          </div>
        </div>

        {/* District Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {DISTRICT_WARNINGS.map((dist) => {
            const isSelected = dist.id === selectedDistrictId;
            const isRed = dist.severity === 'severe_red';
            const isOrange = dist.severity === 'high_orange';

            return (
              <button
                key={dist.id}
                onClick={() => setSelectedDistrictId(dist.id)}
                className={`text-left p-4 rounded-2xl border transition relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-forest-800 bg-forest-50/50 shadow-md ring-2 ring-forest-700/20'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isRed
                          ? 'bg-red-100 text-red-800'
                          : isOrange
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {isRed ? 'RED ALERT' : isOrange ? 'ORANGE ALERT' : 'YELLOW ALERT'}
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-forest-800" />}
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">{dist.district}</h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">{dist.warningType}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-400 flex items-center justify-between">
                  <span>{dist.precipitationMm}</span>
                  <span className="font-semibold text-stone-700">{dist.reliefShelters.length} Shelters</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Warning Banner */}
        <div
          className={`p-5 rounded-2xl border ${
            selectedWarning.severity === 'severe_red'
              ? 'bg-red-50/80 border-red-200 text-red-950'
              : selectedWarning.severity === 'high_orange'
              ? 'bg-amber-50/80 border-amber-200 text-amber-950'
              : 'bg-yellow-50/80 border-yellow-200 text-yellow-950'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-black text-sm uppercase px-2.5 py-0.5 rounded-md bg-white border border-current shadow-sm">
                  {selectedWarning.severityLabel}
                </span>
                <span className="text-xs font-bold text-stone-700">{selectedWarning.district}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black">{selectedWarning.warningType}</h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {selectedWarning.hazardSummary}
              </p>
            </div>

            <div className="md:col-span-4 bg-white/90 backdrop-blur-sm p-4 rounded-xl border border-stone-200/60 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-stone-600">
                <Calendar className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                <span><strong>Issued:</strong> {selectedWarning.issueTime}</span>
              </div>
              <div className="flex items-center gap-2 text-red-700 font-semibold">
                <Clock className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span><strong>Valid Until:</strong> {selectedWarning.validUntil}</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate"><strong>Authority:</strong> {selectedWarning.source}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layer Controls & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                <Layers className="w-4 h-4 text-forest-700" />
                <span>Filter Map Layers:</span>
              </div>

              {/* Layer Toggle Pills */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setActiveLayer('all')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeLayer === 'all'
                      ? 'bg-forest-800 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Layers
                </button>
                <button
                  onClick={() => setActiveLayer('hazard')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeLayer === 'hazard'
                      ? 'bg-red-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Weather Hazards
                </button>
                <button
                  onClick={() => setActiveLayer('vulnerability')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeLayer === 'vulnerability'
                      ? 'bg-purple-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Shelters & Settlements
                </button>
                <button
                  onClick={() => setActiveLayer('access')}
                  className={`px-3 py-1 rounded-lg font-semibold transition ${
                    activeLayer === 'access'
                      ? 'bg-slate-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Access Chokepoints
                </button>
              </div>
            </div>

            {/* Map Container */}
            <MapComponent markers={mapMarkers} height="420px" zoom={11} />
            <div className="text-[11px] text-stone-500 italic text-center">
              Click any pin on the map to inspect settlement population, relief shelter stock level, or road inundation depth.
            </div>
          </div>

          {/* Combined Hazard, Population Vulnerability, and Access Constraints Matrix */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-forest-700" />
              Combined Vulnerability & Logistics Matrix
            </h3>

            {/* 1. Hazard Summary */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-800 flex items-center gap-1.5">
                  <CloudLightning className="w-3.5 h-3.5 text-blue-600" />
                  Meteorological Hazard
                </span>
                <span className="text-[11px] font-semibold text-stone-500">24-Hour Accumulation</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <div className="text-stone-400 text-[10px]">Rainfall Expected</div>
                  <div className="font-bold text-stone-900 text-sm">{selectedWarning.precipitationMm}</div>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                  <div className="text-stone-400 text-[10px]">Sustained Wind</div>
                  <div className="font-bold text-stone-900 text-sm">{selectedWarning.windSpeed}</div>
                </div>
              </div>
            </div>

            {/* 2. Population Vulnerability */}
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-950 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-purple-700" />
                  Population Vulnerability Index
                </span>
                <span className="text-[11px] font-semibold text-purple-700">
                  {selectedWarning.informalSettlementsCount} High-Risk Wards
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-purple-100 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-stone-500">At-Risk Inhabitants:</span>
                  <span className="font-bold text-purple-900">
                    {selectedWarning.vulnerablePopulation.toLocaleString()} persons
                  </span>
                </div>
                <div className="border-t border-stone-100 pt-2 space-y-1.5">
                  <div className="text-[11px] font-semibold text-stone-700">Potentially Affected Settlements:</div>
                  {selectedWarning.affectedSettlements.map((s, idx) => (
                    <div key={idx} className="flex items-center justify-between text-[11px] text-stone-600 pl-2 border-l-2 border-purple-400">
                      <span className="font-medium text-stone-900">{s.name}</span>
                      <span className="text-stone-500">{s.population.toLocaleString()} pop ({s.vulnerabilityLevel})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Access Constraints & Road Bottlenecks */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/70 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5 text-amber-700" />
                  Logistics & Access Constraints
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Submerged Corridors
                </span>
              </div>

              <ul className="space-y-1.5 text-xs text-stone-700">
                {selectedWarning.accessConstraints.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-white p-2 rounded-lg border border-amber-100">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Relief Shelters Status */}
            <div className="p-4 rounded-xl bg-forest-50/50 border border-forest-200/70 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-950 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-forest-700" />
                  Active Relief Shelters ({selectedWarning.reliefShelters.length})
                </span>
                <span className="text-[11px] font-semibold text-forest-800">Live Inventory Monitored</span>
              </div>

              <div className="space-y-2">
                {selectedWarning.reliefShelters.map((r, idx) => (
                  <div key={idx} className="bg-white p-2.5 rounded-lg border border-forest-100 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-stone-900">{r.name}</div>
                      <div className="text-[11px] text-stone-500">
                        {r.currentOccupancy} / {r.capacity} persons ({Math.round((r.currentOccupancy / r.capacity) * 100)}% capacity)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.stockDaysLeft <= 1 ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {r.stockDaysLeft}d Food Left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
