"use client";
import { supabase } from "@/services/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Login() {
    const router = useRouter();

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) router.push('/dashboard');
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (session) {
            router.push('/dashboard');
          }
        }
      );

      return () => subscription.unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: process.env.NEXT_PUBLIC_HOST_URL + '/dashboard'
            }
        });

        if (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gray-50">
            {/* Animated gradient background - Light Theme */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 animate-gradient-shift" />

            {/* Floating orbs - Softer colors */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-orb" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-orb delay-300" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-300/20 rounded-full blur-3xl animate-float-slow delay-500" />

            {/* Decoration Rings */}
            <div className="absolute top-12 right-12 w-32 h-32 border-2 border-indigo-100 rounded-full animate-spin-slow" />
            <div className="absolute bottom-12 left-12 w-24 h-24 border-2 border-purple-100 rounded-full animate-spin-slow delay-300" />

            {/* Main card */}
            <div className="relative z-10 w-full max-w-sm animate-scale-in">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-100 border border-white overflow-hidden ring-1 ring-white/50">
                    
                    {/* Header Section */}
                    <div className="pt-10 pb-6 px-8 text-center bg-gradient-to-b from-white/50 to-transparent">
                        <div className="flex justify-center mb-6 animate-float">
                            <div className="bg-white p-4 rounded-2xl shadow-lg shadow-indigo-100 border border-indigo-50 ring-4 ring-indigo-50/50">
                                <Image
                                    src="/logo.png"
                                    alt="AiCruiter Logo"
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                            </div>
                        </div>
                        
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight animate-fade-in-up delay-100">
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm font-medium animate-fade-in-up delay-200">
                            Sign in to continue your AI hiring journey
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="px-8 pb-10 space-y-8">
                        
                        {/* Google Sign In Button */}
                        <div className="animate-fade-in-up delay-300">
                            <button
                                onClick={signInWithGoogle}
                                className="w-full flex items-center justify-center gap-3.5 py-4 px-6 rounded-2xl bg-gray-900 text-white font-semibold text-sm shadow-xl shadow-gray-200 hover:shadow-2xl hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group ring-4 ring-gray-50 border border-transparent"
                            >
                                <div className="bg-white p-1 rounded-full">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                    </svg>
                                </div>
                                <span className="group-hover:tracking-wide transition-all duration-300">Continue with Google</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex items-center animate-fade-in-up delay-400">
                             <div className="flex-grow border-t border-gray-100"></div>
                             <span className="flex-shrink-0 mx-4 text-gray-300 text-[10px] font-bold tracking-widest uppercase">Trusted By</span>
                             <div className="flex-grow border-t border-gray-100"></div>
                        </div>

                        {/* Features / Trust Badges - Minimalist */}
                        <div className="flex justify-center gap-6 animate-fade-in-up delay-500">
                            {[
                                { icon: "✨", label: "Smart AI" },
                                { icon: "🚀", label: "Fast" },
                                { icon: "🛡️", label: "Secure" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center gap-1.5 group cursor-default">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-lg border border-gray-100 transition-transform group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-100">
                                        {item.icon}
                                    </div>
                                    <span className="text-[10px] font-semibold text-gray-400 group-hover:text-indigo-400 transition-colors uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Footer Link */}
                        <div className="text-center animate-fade-in-up delay-500 pt-2">
                             <a href="#" className="text-xs text-gray-400 hover:text-indigo-500 font-medium transition-colors">
                                Terms of Service • Privacy Policy
                             </a>
                        </div>

                    </div>
                </div>
                
                {/* Bottom decorative text */}
                <p className="text-center text-gray-400 text-xs font-medium mt-8 opacity-60">
                    &copy; {new Date().getFullYear()} InterviewIQ. All rights reserved.
                </p>

            </div>
        </div>
    );
}

export default Login;
