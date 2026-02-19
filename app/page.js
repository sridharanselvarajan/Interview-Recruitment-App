"use client"
import { useUser } from "@/app/provider";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InterviewAssistantPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Head>
        <title>AiCruiter | The Future of Hiring</title>
        <meta name="description" content="AI voice agent for streamlined candidate interviews" />
      </Head>

      <div className="min-h-screen bg-white overflow-x-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
        
        {/* Navigation */}
        <header className="fixed w-full top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
            
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-2 ring-indigo-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                AiCruiter
              </span>
            </div>

            {/* Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'How It Works', 'Pricing'].map((item) => (
                <Link 
                  key={item} 
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all group-hover:w-full rounded-full"></span>
                </Link>
              ))}
              <Link href="/auth">
                <Button className="ml-4 px-6 py-2.5 rounded-full bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 font-semibold">
                  Get Started
                </Button>
              </Link>
            </nav>
          </div>
        </header>

        <main className="pt-20">
          {/* Hero Section */}
          <section className="relative pt-24 pb-32 px-6 overflow-hidden">
            {/* Background Decor - Animated gradient blobs */}
            <div className="absolute top-0 inset-x-0 h-full overflow-hidden -z-10 bg-white">
                <div className="absolute -top-[20%] -left-[10%] w-[700px] h-[700px] bg-purple-200/30 rounded-full blur-[120px] animate-blob mix-blend-multiply" />
                <div className="absolute top-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply" />
                <div className="absolute -bottom-[20%] left-[20%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply" />
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div className="text-center md:text-left space-y-8 animate-fade-in-up md:pr-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 text-indigo-700 text-sm font-semibold mb-4 mx-auto md:mx-0 shadow-sm hover:shadow-md transition-shadow cursor-default">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                  </span>
                  New: GPT-4o Voice Engine Integrated
                </div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Hire Smarter with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 animate-gradient-text">
                    AI Voice Agents
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 max-w-lg mx-auto md:mx-0 leading-relaxed font-medium">
                  Automate phone screens, reduce bias, and find top talent 10x faster. 
                  Let our AI conduct the first round while you focus on the final decision.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Link href="/auth">
                    <Button className="h-14 px-8 text-lg rounded-2xl bg-gray-900 text-white hover:bg-gray-800 shadow-xl shadow-gray-200/50 transition-all hover:scale-105 active:scale-95 font-bold">
                      Start Interviewing Now
                    </Button>
                  </Link>
                  <Button 
                    variant="outline"
                    onClick={openModal} 
                    className="h-14 px-8 text-lg rounded-2xl border-2 border-gray-200 text-gray-700 hover:border-gray-900 hover:bg-white transition-all font-bold backdrop-blur-sm"
                  >
                    Watch Demo
                  </Button>
                </div>

                <div className="pt-8 flex items-center justify-center md:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                   {/* Placeholder logos */}
                   <span className="font-bold text-lg select-none">Google</span>
                   <span className="font-bold text-lg select-none">Microsoft</span>
                   <span className="font-bold text-lg select-none">Spotify</span>
                   <span className="font-bold text-lg select-none">Notion</span>
                </div>
              </div>

              {/* Enhanced Hero Image Area */}
              <div className="relative animate-fade-in-up delay-200 h-[600px] flex items-center justify-center">
                 {/* Main Glowing Circle Background */}
                 <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse-slow"></div>
                 
                 {/* Main Image Container */}
                 <div className="relative z-10 w-full max-w-md transform transition-transform hover:scale-[1.02] duration-500">
                    <div className="relative bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-200/40 border-[6px] border-white overflow-hidden aspect-[4/5]">
                       <Image
                        src="/login.png" // Using login illustration as a base for now, can be replaced
                        alt="AI Interview Interface"
                        fill
                        className="object-cover"
                        priority
                       />
                       {/* Overlay Gradient for depth */}
                       <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/40 to-transparent mix-blend-overlay"></div>
                    </div>

                    {/* Floating Card 1: Transcription */}
                    <div className="absolute -left-12 top-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl shadow-indigo-100 border border-white animate-float-slow z-20 max-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                           <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">AI</div>
                           <div className="h-2 w-20 bg-indigo-50 rounded-full"></div>
                        </div>
                        <div className="space-y-1.5">
                           <div className="h-1.5 w-full bg-gray-100 rounded-full"></div>
                           <div className="h-1.5 w-3/4 bg-gray-100 rounded-full"></div>
                        </div>
                    </div>

                    {/* Floating Card 2: Success Badge */}
                    <div className="absolute -right-8 bottom-32 bg-white p-3 pr-6 rounded-full shadow-lg border border-white flex items-center gap-3 animate-float-fast z-20">
                       <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md shadow-green-200">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top Match</p>
                          <p className="text-sm font-bold text-gray-900">95% Score</p>
                       </div>
                    </div>

                    {/* Floating Card 3: User Avatar */}
                     <div className="absolute -left-4 bottom-12 bg-white p-2 rounded-2xl shadow-lg border border-white animate-float-reverse z-20">
                        <div className="relative w-12 h-12 bg-gray-200 rounded-xl overflow-hidden">
                           <Image src="/check.png" alt="User" width={48} height={48} className="object-cover opacity-80" />
                        </div>
                     </div>

                     {/* Audio Waveform Decoration */}
                     <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-white rounded-full shadow-xl flex items-center justify-center animate-bounce-slow z-10">
                        <div className="flex gap-1 items-end h-8">
                           <div className="w-1.5 bg-indigo-500 rounded-full h-4 animate-wave"></div>
                           <div className="w-1.5 bg-indigo-500 rounded-full h-8 animate-wave animation-delay-100"></div>
                           <div className="w-1.5 bg-indigo-500 rounded-full h-6 animate-wave animation-delay-200"></div>
                           <div className="w-1.5 bg-indigo-500 rounded-full h-3 animate-wave animation-delay-300"></div>
                        </div>
                     </div>
                 </div>
              </div>
            </div>
          </section>

          {/* Features Grid */}
          <section id="features" className="py-24 px-6 bg-gray-50/50 relative">
            <div className="max-w-7xl mx-auto">
              <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                 <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-3 bg-indigo-50 inline-block px-3 py-1 rounded-full border border-indigo-100">Powerful Features</h2>
                 <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">Everything you need to scale hiring</h3>
                 <p className="text-xl text-gray-600">Powerful tools designed to make your recruitment process seamless, unbiased, and data-driven.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: "⚡", title: "Instant Screening", desc: "Screen hundreds of candidates simultaneously. No more scheduling conflicts." },
                  { icon: "🧠", title: "Deep Insights", desc: "Get comprehensive behavioral and technical analysis beyond just keywords." },
                  { icon: "🌍", title: "Bias-Free Hiring", desc: "Standardized interviews ensure every candidate gets a fair, equal opportunity." },
                ].map((feature, i) => (
                  <div key={i} className="group p-10 rounded-[2.5rem] bg-white border border-gray-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-bl-[100px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mb-8 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all">
                      {feature.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h4>
                    <p className="text-gray-600 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-24 px-6 bg-white relative overflow-hidden">
             <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                  <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">Simple 3-Step Process</h3>
                  <p className="text-gray-500 mt-4 text-lg">Detailed insights in minutes, not days</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-12 relative">
                   {/* Connecting Line */}
                   <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent border-t border-dashed border-indigo-300 z-0" />

                   {[
                     { step: "01", title: "Create Interview", desc: "Define role requirements and questions." },
                     { step: "02", title: "Invite Candidates", desc: "Send a magic link. No apps to download." },
                     { step: "03", title: "View Results", desc: "Review AI scores and transcripts instantly." },
                   ].map((item, i) => (
                      <div key={i} className="text-center relative z-10 group">
                         <div className="w-28 h-28 mx-auto bg-white rounded-full shadow-2xl shadow-indigo-100 border-4 border-white flex items-center justify-center text-3xl font-black text-indigo-600 mb-8 relative transition-transform group-hover:scale-110">
                            {item.step}
                            <div className="absolute inset-0 rounded-full border border-indigo-50 animate-ping opacity-0 group-hover:opacity-20" />
                         </div>
                         <h4 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h4>
                         <p className="text-gray-600 font-medium px-8">{item.desc}</p>
                      </div>
                   ))}
                </div>
             </div>
          </section>

          {/* CTA Section */}
          <section id="pricing" className="py-24 px-6">
             <div className="max-w-6xl mx-auto bg-gray-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-gray-400">
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-gray-900 to-gray-900" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-blob" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-blob animation-delay-2000" />
                
                <div className="relative z-10">
                   <h2 className="text-4xl md:text-6xl font-extrabold mb-8 tracking-tight leading-tight">Ready to transform your hiring?</h2>
                   <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-medium">
                     Join thousands of forward-thinking recruiters using AiCruiter to build world-class teams.
                   </p>
                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                       <Link href="/auth">
                          <Button className="h-16 px-12 text-xl rounded-full bg-white text-gray-900 hover:bg-gray-100 border-0 shadow-xl transition-all font-bold hover:scale-105 transform">
                             Get Started for Free
                          </Button>
                       </Link>
                        
                   </div>
                   <p className="mt-8 text-sm text-gray-500 font-medium">No credit card required • 14-day free trial • Cancel anytime</p>
                </div>
             </div>
          </section>

        </main>

        <footer className="bg-white border-t border-gray-100 py-16 px-6">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                 </div>
                 <span className="text-2xl font-bold text-gray-900 tracking-tight">AiCruiter</span>
              </div>
              <div className="text-gray-500 font-medium">
                 &copy; {new Date().getFullYear()} AiCruiter Inc. All rights reserved.
              </div>
              <div className="flex gap-8">
                 <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">Twitter</a>
                 <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">LinkedIn</a>
                 <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors font-medium">Terms</a>
              </div>
           </div>
        </footer>

        {/* Info Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" onClick={closeModal} />
            <div className="relative bg-white rounded-[2rem] shadow-2xl max-w-lg w-full p-10 animate-scale-in">
              <button onClick={closeModal} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center text-4xl mb-8 text-indigo-600 shadow-inner">
                ✨
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About AiCruiter</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed font-medium">
                <p>
                  <strong className="text-indigo-600">AiCruiter</strong> is an advanced AI interview agent designed to revolutionize how you hire.
                </p>
                <p>
                  By analyzing voice intonation, response content, and behavioral markers, we provide a holistic view of every candidate before you even pick up the phone.
                </p>
              </div>
              <div className="mt-10">
                <Button onClick={closeModal} className="w-full h-14 text-lg rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg font-bold">
                  Got it, thanks!
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes wave {
           0%, 100% { height: 10px; }
           50% { height: 25px; }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .animate-float-reverse { animation: float-reverse 5s ease-in-out infinite; }
        .animate-scale-in { animation: scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-blob { animation: blob 10s infinite; }
        .animate-wave { animation: wave 1s infinite ease-in-out; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-100 { animation-delay: 0.1s; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-300 { animation-delay: 0.3s; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </>
  );
};

export default InterviewAssistantPage;