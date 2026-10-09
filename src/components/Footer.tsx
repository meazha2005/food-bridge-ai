import React from 'react';
import Link from 'next/link';
import { Sprout, Globe, Shield, HeartHandshake } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5 text-emerald-200" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">FoodBridge AI</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Bridging the gap between food availability and accessibility during El Niño and climate-related disruptions. Advancing UN SDG 2: Zero Hunger through intelligent supply matching and resilient logistics.
            </p>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-stone-800 border border-stone-700 text-[11px] text-emerald-400 font-medium">
              <Globe className="w-3.5 h-3.5" />
              Operational across Tamil Nadu, India
            </div>
          </div>

          {/* Platform Roles */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Roles & Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/supplier/dashboard" className="hover:text-emerald-400 transition">
                  Food Suppliers (Farmers & Wholesalers)
                </Link>
              </li>
              <li>
                <Link href="/ngo/dashboard" className="hover:text-emerald-400 transition">
                  NGOs & Regional Food Banks
                </Link>
              </li>
              <li>
                <Link href="/recipient/dashboard" className="hover:text-emerald-400 transition">
                  Recipient Kitchens & Shelters
                </Link>
              </li>
              <li>
                <Link href="/delivery/dashboard" className="hover:text-emerald-400 transition">
                  Logistics & Delivery Partners
                </Link>
              </li>
              <li>
                <Link href="/admin/dashboard" className="hover:text-emerald-400 transition">
                  Disruption Command Center (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Platform Resources</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/food-availability" className="hover:text-emerald-400 transition">
                  Public Available Food Board
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-400 transition">
                  AI Optimization Workflow
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  El Niño & Climate Resilience
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase mb-3">Governance & Policies</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition">
                  Privacy Policy & Data Isolation
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition">
                  Terms of Service & Food Safety
                </Link>
              </li>
              <li>
                <div className="mt-4 p-3 rounded-lg bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-400">
                  <div className="flex items-center gap-1.5 font-medium text-stone-300 mb-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Verified Demo Infrastructure
                  </div>
                  Connected to verified cPanel MySQL & secure SMTP notification pipeline.
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 gap-4">
          <p>© 2026 FoodBridge AI Platform. All rights reserved. Zero Hunger Hackathon Project.</p>
          <div className="flex items-center gap-4">
            <span className="text-emerald-500 font-semibold">● Operational Live Status: Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
