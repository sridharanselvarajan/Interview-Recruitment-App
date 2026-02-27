"use client";
import { ArrowRight, CheckCircle, Clock, Home, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function InterviewComplete() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-6">

            {/* Subtle background blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-1/4 left-1/6 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl animate-orb" />
                <div className="absolute bottom-1/4 right-1/6 w-64 h-64 bg-purple-200 rounded-full opacity-20 blur-3xl animate-orb delay-300" />
            </div>

            {/* Main content card */}
            <div className="w-full max-w-lg animate-scale-in">
                <div className="card-premium overflow-hidden">

                    {/* Gradient top accent */}
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500" />

                    <div className="p-8 text-center space-y-6">
                        {/* Success Icon */}
                        <div className="flex justify-center animate-fade-in-up">
                            <div className="relative">
                                <div className="absolute inset-0 bg-green-400 rounded-full opacity-20 animate-ping scale-150" />
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-2xl shadow-green-500/30 relative z-10">
                                    <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Title */}
                        <div className="space-y-2 animate-fade-in-up delay-100">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800/40 text-indigo-700 dark:text-indigo-400 text-xs font-medium mb-2">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                Interview Recorded Successfully
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                Interview Complete!
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-base">
                                Thank you for your time and thoughtful responses.
                            </p>
                        </div>

                        {/* Illustration */}
                        <div className="relative animate-fade-in-up delay-200">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-100/50 to-purple-100/50 rounded-2xl blur-xl" />
                            <Image
                                src="/interview-complete.png"
                                alt="Completion illustration"
                                width={400}
                                height={240}
                                className="relative rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 mx-auto"
                            />
                        </div>

                        {/* What's Next */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-2xl p-5 text-left space-y-3 border border-indigo-100 dark:border-indigo-800/30 animate-fade-in-up delay-300">
                            <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 font-semibold">
                                <Clock className="w-4 h-4 text-indigo-500" />
                                What happens next?
                            </div>
                            <div className="space-y-2">
                                {[
                                    "AI is analyzing your responses",
                                    "Detailed feedback is being generated",
                                    "Results will be available shortly",
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-2.5 text-gray-600 dark:text-gray-300 text-sm">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs text-white font-bold flex-shrink-0">
                                            {i + 1}
                                        </div>
                                        {step}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="animate-fade-in-up delay-400">
                            <Link href="/dashboard" passHref>
                                <button className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl btn-shimmer text-white font-semibold text-base shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group">
                                    <Home className="w-5 h-5" />
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InterviewComplete;