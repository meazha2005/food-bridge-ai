'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sprout, Building2, User, Mail, Lock, Phone, MapPin, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { UserRole } from '@/types';

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'supplier';

  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Chennai');
  const [storageCapacity, setStorageCapacity] = useState('1000');
  const [storageType, setStorageType] = useState('ambient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          organizationName,
          organizationType: role,
          address,
          city,
          storageCapacity,
          storageType,
          latitude: city === 'Tambaram' ? 12.9249 : city === 'Chengalpattu' ? 12.6825 : 13.0827,
          longitude: city === 'Tambaram' ? 80.1278 : city === 'Chengalpattu' ? 79.9836 : 80.2707,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to their dashboard
      router.push(`/${role}/dashboard`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafaf9]">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-stone-900 tracking-tight">Create Organization Account</h1>
            <p className="text-xs text-stone-500">
              Join the climate-resilient food rescue network across Tamil Nadu
            </p>
          </div>

          {/* Role Selector Tabs */}
          <div className="bg-white p-2 rounded-2xl border border-stone-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {[
              { id: 'supplier', label: 'Food Supplier', icon: '🌾' },
              { id: 'ngo', label: 'NGO / Food Bank', icon: '🏛️' },
              { id: 'recipient', label: 'Recipient Kitchen', icon: '🍲' },
              { id: 'delivery', label: 'Delivery Fleet', icon: '🚚' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setRole(tab.id as UserRole)}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1.5 ${
                  role === tab.id
                    ? 'bg-forest-800 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. S. Ramanathan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98400 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Official Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@organization.org"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role-Specific Fields */}
              {role !== 'delivery' && (
                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-forest-800">
                    Organization Details
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Organization / Entity Name
                    </label>
                    <input
                      type="text"
                      required
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder={
                        role === 'supplier'
                          ? 'e.g. Koyambedu Agro Wholesale Mandi'
                          : role === 'ngo'
                          ? 'e.g. Chennai Relief Food Foundation'
                          : 'e.g. Hope Shelter & Community Kitchen'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Facility Street Address
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 12, Market Complex Gate 4"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        District / City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none bg-white"
                      >
                        <option value="Chennai">Chennai</option>
                        <option value="Tambaram">Tambaram</option>
                        <option value="Chengalpattu">Chengalpattu</option>
                        <option value="Kanchipuram">Kanchipuram</option>
                        <option value="Sriperumbudur">Sriperumbudur</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Storage Capacity (kg)
                      </label>
                      <input
                        type="number"
                        value={storageCapacity}
                        onChange={(e) => setStorageCapacity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Facility Storage Type
                      </label>
                      <select
                        value={storageType}
                        onChange={(e) => setStorageType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-forest-700 focus:outline-none bg-white"
                      >
                        <option value="ambient">Ambient / Dry Storage</option>
                        <option value="cold_storage">Refrigerated / Cold Storage</option>
                        <option value="frozen">Deep Freezer (-18°C)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-forest-800 hover:bg-forest-900 text-white font-bold text-sm shadow-md shadow-forest-900/10 flex items-center justify-center gap-2 transition disabled:opacity-70"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Register & Access Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-2 border-t border-stone-100 text-center text-xs text-stone-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-forest-800 hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}

