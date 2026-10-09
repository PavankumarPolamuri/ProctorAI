import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Check, 
  BrainCircuit, 
  Lock, 
  BarChart3, 
  ChevronRight, 
  CheckCircle2, 
  Eye, 
  UserCheck, 
  ShieldCheck, 
  X,
  Mail,
  Info
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const scrollToSection = (id) => {
    setActiveTab(id);
    if (id === 'about') {
      setShowAboutModal(true);
      return;
    }
    if (id === 'contact') {
      setShowContactModal(true);
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureCards = [
    {
      icon: <BrainCircuit className="w-7 h-7 text-[#8B5CF6]" />,
      title: 'AI-Based Proctoring',
      description: 'Advanced behavioral analysis and computer vision to detect suspicious activities in real-time.'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-[#A855F7]" />,
      title: 'Anti-Malpractice',
      description: 'Multi-layered protection against tab switching, screen sharing, and unauthorized devices.'
    },
    {
      icon: <Lock className="w-7 h-7 text-[#C084FC]" />,
      title: 'Secure & Encrypted',
      description: 'End-to-end encryption for all exam data, ensuring integrity and strict confidentiality.'
    },
    {
      icon: <BarChart3 className="w-7 h-7 text-[#E879F9]" />,
      title: 'Instant Analytics',
      description: 'Comprehensive reporting and deep insights generated immediately upon exam completion.'
    }
  ];

  return (
    <div id="home" className="min-h-screen bg-[#030712] font-sans text-[#F8FAFC] selection:bg-[#7C3AED]/30 overflow-x-hidden relative flex flex-col justify-between">
      
      {/* Sophisticated Dark Futuristic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
        {/* Subtle Navy & Violet Gradient Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#080B24] rounded-full blur-[160px] opacity-80"></div>
        <div className="absolute top-[15%] right-[-15%] w-[50%] h-[50%] bg-[#7C3AED]/12 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-[#8B5CF6]/10 rounded-full blur-[170px]"></div>
        
        {/* Faint Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.15)_1px,transparent_1px)] [background-size:36px_36px] opacity-35"></div>
        
        {/* Subtle glowing lines aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-[#7C3AED]/10 via-[#A855F7]/5 to-transparent blur-3xl opacity-60 rounded-full"></div>
      </div>

      <div>
        {/* HEADER / NAVIGATION */}
        <header className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-[#8B5CF6]/20 transition-all">
          <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            
            {/* Left: ProctorAI logo + shield icon */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => scrollToSection('home')}
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] p-0.5 shadow-lg shadow-[#7C3AED]/30 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full bg-[#0B1026] rounded-[10px] flex items-center justify-center relative">
                  <Shield className="w-6 h-6 text-[#8B5CF6] absolute" fill="currentColor" fillOpacity={0.2} />
                  <Check className="w-3.5 h-3.5 text-[#E879F9] relative z-10" strokeWidth={3.5} />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-[#F8FAFC]">
                    Proctor
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white shadow-sm shadow-[#7C3AED]/40">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-[#94A3B8] font-mono tracking-wider">ASSESSMENT SECURITY</p>
              </div>
            </div>
            
            {/* Center: Home, About, Contact */}
            <div className="hidden md:flex items-center gap-1.5 bg-[#0B1026]/90 border border-[rgba(139,92,246,0.25)] rounded-full px-5 py-1.5 backdrop-blur-md shadow-inner">
              {[
                { id: 'home', label: 'Home' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' }
              ].map((navItem) => (
                <button
                  key={navItem.id}
                  onClick={() => scrollToSection(navItem.id)}
                  className={`relative px-5 py-1.5 text-sm font-semibold transition-all duration-200 rounded-full ${
                    activeTab === navItem.id
                      ? 'text-[#F8FAFC]'
                      : 'text-[#CBD5E1] hover:text-[#F8FAFC]'
                  }`}
                >
                  {navItem.label}
                  {activeTab === navItem.id && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#8B5CF6] rounded-full shadow-[0_0_8px_#8B5CF6]"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Right: Login button */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="relative group overflow-hidden text-sm font-bold text-[#F8FAFC] bg-[#0B1026] border border-[rgba(139,92,246,0.45)] hover:border-[#8B5CF6] px-6 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#A855F7]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>

          </nav>
        </header>

        {/* HERO SECTION CONTAINER */}
        <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-16 text-center flex flex-col items-center">
          
          {/* Centered Hero Layout */}
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0B1026] border border-[rgba(139,92,246,0.45)] text-[#C084FC] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.2)]">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>THE PLATFORM OF ASSESSMENTS</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight text-[#F8FAFC] leading-[1.05]">
              PROCTOR
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E879F9] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
                AI
              </span>
            </h1>
            
            {/* Subtitle */}
            <h2 className="text-xl sm:text-2xl font-bold text-[#C084FC] tracking-wide">
              AI-Powered Online Examination & Proctoring Platform
            </h2>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-xl leading-relaxed">
              Empowering educational institutions and enterprises with ultra-secure assessment tools to eliminate malpractice and streamline results.
            </p>

            {/* CTA Button */}
            <div className="pt-4">
              <button 
                onClick={() => navigate('/register')}
                className="group relative inline-flex items-center justify-center px-9 py-4 text-base font-extrabold text-white bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-2xl shadow-[0_0_35px_rgba(124,58,237,0.45)] hover:shadow-[0_0_50px_rgba(139,92,246,0.65)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>GET STARTED</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* FOUR FEATURE CARDS BELOW HERO */}
          <div id="features" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 text-left w-full">
            {featureCards.map((card, index) => (
              <div 
                key={index} 
                className="group relative bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.35)] hover:border-[#8B5CF6] rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-10px_rgba(139,92,246,0.35)] flex flex-col justify-between overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#151B3D] border border-[#8B5CF6]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#8B5CF6] transition-all duration-300 shadow-md">
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-2.5 tracking-tight group-hover:text-[#E879F9] transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-[#CBD5E1] leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </section>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-[#8B5CF6]/20 bg-[#030712] py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#8B5CF6]" fill="currentColor" fillOpacity={0.2} />
            <span className="font-bold text-sm text-[#F8FAFC]">ProctorAI Platform</span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            &copy; {new Date().getFullYear()} ProctorAI – AI-Powered Online Examination & Proctoring Platform. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ABOUT MODAL DIALOG */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0B1026] border border-[rgba(139,92,246,0.45)] rounded-2xl max-w-lg w-full p-6 relative shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <button 
              onClick={() => setShowAboutModal(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Info className="w-6 h-6 text-[#8B5CF6]" />
              <h3 className="text-xl font-bold text-[#F8FAFC]">About ProctorAI</h3>
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed mb-4">
              ProctorAI is an enterprise-grade AI-powered online examination and proctoring platform designed to eliminate malpractice in remote and computer-based assessments.
            </p>
            <div className="space-y-2 text-xs text-[#94A3B8] border-t border-[#8B5CF6]/20 pt-3">
              <p>• Multi-layered behavioral anomaly detection</p>
              <p>• Automated browser lock & screen monitoring</p>
              <p>• Real-time candidate telemetry & instant audit trail</p>
            </div>
            <button 
              onClick={() => setShowAboutModal(false)}
              className="mt-6 w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* CONTACT MODAL DIALOG */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0B1026] border border-[rgba(139,92,246,0.45)] rounded-2xl max-w-lg w-full p-6 relative shadow-[0_0_40px_rgba(124,58,237,0.3)]">
            <button 
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Mail className="w-6 h-6 text-[#8B5CF6]" />
              <h3 className="text-xl font-bold text-[#F8FAFC]">Contact Support</h3>
            </div>
            <p className="text-sm text-[#CBD5E1] leading-relaxed mb-4">
              Have questions regarding institution onboarding, administrator access, or exam creation? Reach out to our technical team:
            </p>
            <div className="bg-[#151B3D] border border-[#8B5CF6]/30 rounded-xl p-4 text-center space-y-1 mb-4">
              <p className="text-xs text-[#94A3B8]">Support Email</p>
              <p className="text-base font-mono font-bold text-[#E879F9]">support@proctorai.io</p>
            </div>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-full py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold rounded-xl text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Landing;


