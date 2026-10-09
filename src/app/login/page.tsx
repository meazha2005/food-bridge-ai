'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sprout, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@foodbridge.org', pass: 'Admin@123', label: 'Admin Command', desc: 'Platform oversight & simulation', color: 'bg-stone-800' },
  { role: 'Supplier', email: 'supplier@farmfresh.org', pass: 'Supplier@123', label: 'Supplier Hub', desc: 'Koyambedu Agro trader', color: 'bg-emerald-700' },
  { role: 'NGO', email: 'ngo@chennaiaid.org', pass: 'Ngo@123', label: 'NGO / Food Bank', desc: 'Chennai Food Rescue', color: 'bg-blue-700' },
  { role: 'Recipient', email: 'shelter@hopehome.org', pass: 'Recipient@123', label: 'Recipient Kitchen', desc: 'Hope Harbor Shelter', color: 'bg-red-700' },
  { role: 'Delivery', email: 'driver@expressrescue.org', pass: 'Driver@123', label: 'Delivery Partner', desc: 'Express Rescue Driver', color: 'bg-purple-700' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (loginEmail?: string, loginPassword?: string) => {
    setError('');
    setLoading(true);

    const emailToSend = loginEmail || email;
    const passwordToSend = loginPassword || password;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToSend, password: passwordToSend }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Role-based redirect
      const role = data.user.role;
      switch (role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'supplier':
          router.push('/supplier/dashboard');
          break;
        case 'ngo':
          router.push('/ngo/dashboard');
          break;
        case 'recipient':
          router.push('/recipient/dashboard');
          break;
        case 'delivery':
          router.push('/delivery/dashboard');
          break;
        default:
          router.push('/profile');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const fillDemoAccount = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    handleLogin(acc.email, acc.pass);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-forest-800 text-emerald-300 items-center justify-center shadow-lg shadow-forest-900/10 mb-1">
              <Sprout className="w-7 h-7" />
            </div>
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Sign In to FoodBridge AI</h1>
            <p className="text-xs text-stone-500">
              Access your role-based rescue dashboard or test using seeded demo accounts
            </p>
          </div>

          {/* 1-Click Demo Accounts Pill Bar */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700">
              <span className="flex items-center gap-1.5 text-forest-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> 1-Click Demo Testing
              </span>
              <span className="text-[10px] text-stone-400 font-normal">Click to login directly</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  disabled={loading}
                  onClick={() => fillDemoAccount(acc)}
                  className="p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-forest-50 hover:border-forest-300 text-left transition group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 group-hover:text-forest-900">{acc.label}</span>
                    <span className={`w-2 h-2 rounded-full ${acc.color}`} />
                  </div>
                  <span className="text-[10px] text-stone-500 mt-0.5 truncate">{acc.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@organization.org"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Password</label>
                  <Link href="/forgot-password" className="text-xs text-forest-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-forest-700 focus:border-transparent transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md shadow-forest-900/10 flex items-center justify-center gap-2 transition disabled:opacity-70"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-stone-100 text-center text-xs text-stone-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-forest-800 hover:underline">
                Register organization
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
