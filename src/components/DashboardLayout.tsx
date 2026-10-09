'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  PackagePlus,
  Boxes,
  HandHeart,
  Truck,
  MapPin,
  Sparkles,
  CloudRain,
  BarChart3,
  Users,
  Building2,
  FileText,
  AlertCircle,
  Settings,
  Bell,
  LogOut,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Menu,
  X,
  ChevronRight,
  ClipboardList
} from 'lucide-react';
import { User, UserRole } from '@/types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRole?: UserRole | UserRole[];
}

export default function DashboardLayout({ children, allowedRole }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (!res.ok) throw new Error('Unauthenticated');
        return res.json();
      })
      .then((data) => {
        if (!data.user) {
          router.push('/login');
          return;
        }

        // Check allowed role if specified
        if (allowedRole) {
          const roles = Array.isArray(allowedRole) ? allowedRole : [allowedRole];
          if (!roles.includes(data.user.role) && data.user.role !== 'admin') {
            router.push('/unauthorized');
            return;
          }
        }

        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        router.push('/login');
      });
  }, [allowedRole, router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-forest-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-stone-600">Verifying security session...</p>
        </div>
      </div>
    );
  }

  // Get navigation links depending on user role
  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'supplier':
        return [
          { name: 'Overview', href: '/supplier/dashboard', icon: LayoutDashboard },
          { name: 'My Food Listings', href: '/supplier/listings', icon: Boxes },
          { name: 'Add New Food', href: '/supplier/add-food', icon: PackagePlus },
          { name: 'Donation Requests', href: '/supplier/requests', icon: HandHeart },
          { name: 'Allocations', href: '/supplier/allocations', icon: ClipboardList },
          { name: 'Pickup Tracking', href: '/supplier/pickups', icon: Truck },
          { name: 'Donation History', href: '/supplier/history', icon: Clock },
          { name: 'Impact Analytics', href: '/supplier/analytics', icon: BarChart3 },
          { name: 'Organization Profile', href: '/supplier/profile', icon: Building2 },
          { name: 'Notifications', href: '/supplier/notifications', icon: Bell },
        ];

      case 'ngo':
        return [
          { name: 'Overview', href: '/ngo/dashboard', icon: LayoutDashboard },
          { name: 'Find Available Food', href: '/ngo/find-food', icon: Boxes },
          { name: 'My Reservations', href: '/ngo/reservations', icon: HandHeart },
          { name: 'Warehouse Inventory', href: '/ngo/inventory', icon: PackagePlus },
          { name: 'Recipient Distribution', href: '/ngo/distribution', icon: ClipboardList },
          { name: 'Delivery Tracking', href: '/ngo/deliveries', icon: Truck },
          { name: 'Redistribution History', href: '/ngo/history', icon: Clock },
          { name: 'Hub Profile', href: '/ngo/profile', icon: Building2 },
          { name: 'Notifications', href: '/ngo/notifications', icon: Bell },
        ];

      case 'recipient':
        return [
          { name: 'Overview', href: '/recipient/dashboard', icon: LayoutDashboard },
          { name: 'Request Food Aid', href: '/recipient/request-food', icon: HandHeart },
          { name: 'My Open Requests', href: '/recipient/requests', icon: ClipboardList },
          { name: 'Nearby Available Food', href: '/recipient/available-food', icon: Boxes },
          { name: 'Allocation Tracking', href: '/recipient/allocations', icon: ShieldCheck },
          { name: 'Incoming Deliveries', href: '/recipient/deliveries', icon: Truck },
          { name: 'Confirm Food Receipt', href: '/recipient/confirm-receipt', icon: CheckCircle2 },
          { name: 'Fulfillment History', href: '/recipient/history', icon: Clock },
          { name: 'Center Profile', href: '/recipient/profile', icon: Building2 },
          { name: 'Notifications', href: '/recipient/notifications', icon: Bell },
        ];

      case 'delivery':
        return [
          { name: 'Overview', href: '/delivery/dashboard', icon: LayoutDashboard },
          { name: 'Assigned Deliveries', href: '/delivery/deliveries', icon: Truck },
          { name: 'Live Route Navigator', href: '/delivery/map', icon: MapPin },
          { name: 'Delivery History', href: '/delivery/history', icon: Clock },
          { name: 'Driver Profile', href: '/delivery/profile', icon: UserIcon },
          { name: 'Notifications', href: '/delivery/notifications', icon: Bell },
        ];

      case 'admin':
        return [
          { name: 'Command Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
          { name: 'User Management', href: '/admin/users', icon: Users },
          { name: 'Organization Approvals', href: '/admin/organizations', icon: Building2 },
          { name: 'Food Listings', href: '/admin/food-listings', icon: Boxes },
          { name: 'Recipient Requests', href: '/admin/requests', icon: HandHeart },
          { name: 'Allocation Control', href: '/admin/allocations', icon: ClipboardList },
          { name: 'Delivery Logistics', href: '/admin/deliveries', icon: Truck },
          { name: 'Food Rescue Map (GIS)', href: '/admin/map', icon: MapPin },
          { name: 'AI Matching Engine', href: '/admin/ai-matching', icon: Sparkles },
          { name: 'Climate Simulator', href: '/admin/simulator', icon: CloudRain },
          { name: 'SDG 2 Analytics', href: '/admin/analytics', icon: BarChart3 },
          { name: 'Operational Reports', href: '/admin/reports', icon: FileText },
          { name: 'Reports & Complaints', href: '/admin/complaints', icon: AlertCircle },
          { name: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
          { name: 'System Settings', href: '/admin/settings', icon: Settings },
        ];

      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-forest-800 text-white flex items-center justify-center font-bold text-sm">
            FB
          </div>
          <span className="font-bold text-stone-900 text-sm">
            FoodBridge <span className="text-forest-700 capitalize">{user?.role}</span>
          </span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 text-stone-600 rounded-lg hover:bg-stone-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 inset-y-0 left-0 w-64 bg-stone-900 text-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Sidebar Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <div className="font-bold text-white text-base tracking-tight leading-none">FoodBridge AI</div>
                <div className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase mt-1">
                  {user?.role} Portal
                </div>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Org Card */}
          <div className="px-4 py-3 mx-3 my-3 bg-stone-800/80 rounded-xl border border-stone-700/60">
            <div className="text-xs font-semibold text-white truncate">{user?.name}</div>
            <div className="text-[11px] text-stone-400 truncate mt-0.5">
              {user?.organization_name || user?.email}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 space-y-1 py-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-forest-800 text-white font-semibold shadow-sm shadow-forest-900/30'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-stone-400'}`} />
                  <span className="flex-1 truncate">{item.name}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-70" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="p-3 border-t border-stone-800 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2 text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              Public Website
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Desktop Bar */}
        <div className="hidden md:flex items-center justify-between bg-white px-8 py-3.5 border-b border-stone-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 uppercase tracking-wider">
              {user?.role} Space
            </span>
            <span className="text-xs text-stone-500">
              {user?.organization_name ? `Organization: ${user.organization_name}` : user?.email}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href={`/${user?.role}/notifications`}
              className="relative p-2 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-600"></span>
            </Link>

            <div className="h-4 w-px bg-stone-200" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-forest-800 text-white flex items-center justify-center text-xs font-bold">
                {user?.name.charAt(0)}
              </div>
              <span className="text-xs font-medium text-stone-800">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Child Pages Container */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
