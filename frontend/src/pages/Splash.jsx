import React from 'react';
import { ShieldCheck, Camera, User, FileText, Clock, Shield } from 'lucide-react';

const Splash = () => {
  return (
    <div className="min-h-screen bg-[#050816] font-sans text-slate-100 selection:bg-[#7C3AED]/30 overflow-x-hidden relative">
      
      {/* Dark Navy + Violet background */}
      <div className="fixed inset-0 z-0 bg-[#050816]">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7C3AED]/10 rounded-full blur-[120px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#27325A_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Central Graphic */}
        <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-10">
          
          {/* Concentric Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border border-[#8B5CF6]/30 rounded-full border-dashed animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] border border-[#7C3AED]/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border border-[#27325A]/40 rounded-full"></div>

          {/* Central Shield Orb */}
          <div className="relative z-20 flex items-center justify-center w-[120px] h-[120px] bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-full shadow-[0_0_60px_rgba(139,92,246,0.55)]">
            <ShieldCheck className="w-14 h-14 text-[#050816]" strokeWidth={2.2} />
          </div>

          {/* Orbiting Icons */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0B1026] p-2.5 rounded-2xl border border-[#27325A] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <Camera className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="absolute top-1/2 -right-3 -translate-y-1/2 bg-[#0B1026] p-2.5 rounded-2xl border border-[#27325A] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <User className="w-4 h-4 text-[#A855F7]" />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0B1026] p-2.5 rounded-2xl border border-[#27325A] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <FileText className="w-4 h-4 text-[#C084FC]" />
            </div>
            <div className="absolute top-1/2 -left-3 -translate-y-1/2 bg-[#0B1026] p-2.5 rounded-2xl border border-[#27325A] shadow-[0_0_12px_rgba(139,92,246,0.25)]">
              <Clock className="w-4 h-4 text-[#8B5CF6]" />
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="w-8 h-8 text-[#8B5CF6] filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" strokeWidth={2.5} />
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] uppercase">
            PROCTOR<span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E879F9] bg-clip-text text-transparent">AI</span>
          </h1>
        </div>

        {/* Divider / Glow Line */}
        <div className="w-64 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent mb-8"></div>

        {/* Taglines */}
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-3 tracking-wide">
          Safe. Reliable. Fair.
        </h2>
        <p className="text-[#CBD5E1] text-sm md:text-base max-w-xs mx-auto leading-relaxed mb-14">
          Empowering the future<br/>of assessments.
        </p>

        {/* Footer */}
        <p className="text-xs text-[#94A3B8] font-medium">
          &copy; {new Date().getFullYear()} ProctorAI. All rights reserved.
        </p>

      </main>

    </div>
  );
};

export default Splash;
