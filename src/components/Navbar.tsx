'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sprout, Menu, X, User as UserIcon, LogOut, ShieldAlert, HeartHandshake, Truck, Building2 } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in via auth check API
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.user) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'supplier':
        return '/supplier/dashboard';
      case 'ngo':
        return '/ngo/dashboard';
      case 'recipient':
        return '/recipient/dashboard';
      case 'delivery':
        return '/delivery/dashboard';
      default:
        return '/profile';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white shadow-md shadow-forest-900/10">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-stone-900">
                FoodBridge<span className="text-forest-700"> AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full">
                SDG 2 Zero Hunger
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-7 text-sm font-medium text-stone-600">
            <Link
              href="/"
              className={`hover:text-forest-800 transition ${pathname === '/' ? 'text-forest-800 font-semibold' : ''}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`hover:text-forest-800 transition ${pathname === '/about' ? 'text-forest-800 font-semibold' : ''}`}
            >
              About
            </Link>
            <Link
              href="/how-it-works"
              className={`hover:text-forest-800 transition ${pathname === '/how-it-works' ? 'text-forest-800 font-semibold' : ''}`}
            >
              How It Works
            </Link>
            <Link
              href="/food-availability"
              className={`hover:text-forest-800 transition ${pathname === '/food-availability' ? 'text-forest-800 font-semibold' : ''}`}
            >
              Food Availability
            </Link>
          </nav>

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getDashboardLink()}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-forest-800 text-white hover:bg-forest-900 shadow-sm transition"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  {user.name.split(' ')[0]} ({user.role.toUpperCase()})
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg transition"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-stone-700 hover:text-forest-800 px-3 py-1.5 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-semibold text-white bg-forest-800 hover:bg-forest-900 px-4 py-2 rounded-lg shadow-sm transition"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-stone-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 py-1"
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 py-1"
          >
            About
          </Link>
          <Link
            href="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 py-1"
          >
            How It Works
          </Link>
          <Link
            href="/food-availability"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-base font-medium text-stone-800 py-1"
          >
            Food Availability
          </Link>

          <div className="pt-3 border-t border-stone-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center bg-forest-800 text-white font-medium py-2 rounded-lg"
                >
                  Go to {user.role.toUpperCase()} Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center text-red-600 font-medium py-2"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-stone-700 border border-stone-300 rounded-lg font-medium"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 bg-forest-800 text-white rounded-lg font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
