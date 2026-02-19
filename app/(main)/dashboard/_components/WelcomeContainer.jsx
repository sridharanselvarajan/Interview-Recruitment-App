"use client";
import { useUser } from "@/app/provider";
import { Sparkles, TrendingUp } from "lucide-react";
import Image from "next/image";

function WelcomeContainer() {
  const { user, loading } = useUser();

  let userName;
  if (loading) {
    userName = "...";
  } else if (user) {
    userName = user.name || user.email || "User";
  } else {
    userName = "Please login";
  }

  const firstName = userName.split(" ")[0];

  return (
    <div className="relative overflow-hidden rounded-3xl mb-8 animate-fade-in-up">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-gradient-shift" />
      
      {/* Decorative orbs */}
      <div className="absolute -top-8 -right-8 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-orb" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 bg-purple-300/20 rounded-full blur-2xl animate-float-slow" />
      <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-300/15 rounded-full blur-xl animate-float" />

      {/* Dot grid pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-7 flex justify-between items-center">
        <div className="space-y-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white/90 text-xs font-medium backdrop-blur-sm mb-3">
            <Sparkles className="w-3 h-3" />
            AI-Powered Hiring Platform
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            Welcome back, <span className="text-yellow-300">{firstName}!</span> 👋
          </h2>
          <p className="text-white/75 text-sm md:text-base font-medium">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>

          {/* Stats row */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-green-300" />
              <span>Smart Screening Active</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-white/40" />
            <div className="flex items-center gap-1.5 text-white/80 text-xs">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>

        {/* Avatar */}
        {user?.picture && (
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse" />
            <div className="relative h-16 w-16 rounded-full border-3 border-white/60 shadow-2xl overflow-hidden ring-4 ring-white/20">
              <Image
                src={user.picture}
                alt="userAvatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

export default WelcomeContainer;
