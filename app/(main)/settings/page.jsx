'use client';

import { supabase } from '@/services/supabaseClient';
import { BarChart, CheckCircle, Cpu, LogIn, LogOut, Settings, Shield, Sparkles, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const benefits = [
  {
    icon: Cpu,
    title: "Automated Interview Screening",
    description: "Our AI assistant conducts initial interviews 24/7, saving you hours of screening time.",
    gradient: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Bias-Free Evaluations",
    description: "Standardized questions and objective analysis help minimize unconscious bias.",
    gradient: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: BarChart,
    title: "Data-Driven Insights",
    description: "Get comprehensive candidate evaluations with response analysis and scoring.",
    gradient: "from-purple-500 to-pink-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Faster Hiring Process",
    description: "Reduce time-to-hire by quickly identifying top candidates.",
    gradient: "from-orange-500 to-rose-600",
    bg: "bg-orange-50",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    try {
      setLoading(true);
      if (isLoggedIn) {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        localStorage.clear();
        sessionStorage.clear();
      }
      router.push('/auth');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-white p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-400/30 rounded-2xl blur-lg animate-pulse" />
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
                <Settings className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-500 text-sm mt-0.5">Configure your AIcruiter experience</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="animate-fade-in-up delay-100">
          {/* Section header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-indigo-500 to-purple-600" />
            <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              How AIcruiter Helps You Hire Smarter
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className={`card-premium p-5 animate-fade-in-up`}
                  style={{ animationDelay: `${index * 80 + 200}ms` }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${benefit.gradient} flex items-center justify-center shadow-md flex-shrink-0`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">{benefit.title}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Account Section */}
        <div className="animate-fade-in-up delay-300">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-rose-500 to-orange-500" />
            <h2 className="font-bold text-xl text-gray-800">Account Management</h2>
          </div>

          <div className="card-premium p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${isLoggedIn ? 'bg-gradient-to-br from-rose-500 to-red-600' : 'bg-gradient-to-br from-green-500 to-emerald-600'}`}>
                  {isLoggedIn
                    ? <LogOut className="h-5 w-5 text-white" />
                    : <LogIn className="h-5 w-5 text-white" />
                  }
                </div>
                <div>
                  <p className="font-semibold text-gray-800">
                    {isLoggedIn ? 'Sign out of your account' : 'Sign in to your account'}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {isLoggedIn
                      ? "You'll need to sign in again to access AIcruiter"
                      : 'Sign in to access all features of AIcruiter'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleAuthAction}
                disabled={loading}
                className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed ${
                  isLoggedIn
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-200'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-200'
                }`}
              >
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : isLoggedIn
                    ? <LogOut className="w-4 h-4" />
                    : <LogIn className="w-4 h-4" />
                }
                {loading
                  ? (isLoggedIn ? 'Signing Out...' : 'Signing In...')
                  : (isLoggedIn ? 'Sign Out' : 'Sign In')
                }
              </button>
            </div>

            {/* Status indicator */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isLoggedIn ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`} />
              <span className="text-xs text-gray-500">
                {isLoggedIn ? 'Currently signed in' : 'Not signed in'}
              </span>
            </div>
          </div>
        </div>

        {/* App Info */}
        <div className="animate-fade-in-up delay-400">
          <div className="card-premium p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">AIcruiter v1.0</p>
                <p className="text-xs text-gray-400">All systems operational</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-700">Online</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}