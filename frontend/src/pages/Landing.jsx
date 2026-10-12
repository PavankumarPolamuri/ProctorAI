import React, { useState, useEffect, useCallback } from 'react';
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
  Info,
  Play,
  GraduationCap,
  Building2,
  MonitorSmartphone,
  Briefcase,
  Landmark,
  Menu
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const DEMO_VIDEO_URL = 'https://drive.google.com/file/d/1LrvlvW8MUo_O7vfb1TdD8Bz9Naqu5_5e/preview';
  const [iframeSrc, setIframeSrc] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close demo modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showDemoModal) closeDemoModal();
        if (showAboutModal) setShowAboutModal(false);
        if (showContactModal) setShowContactModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDemoModal, showAboutModal, showContactModal]);

  const openDemoModal = useCallback(() => {
    setVideoError(false);
    setIframeSrc(DEMO_VIDEO_URL);
    setShowDemoModal(true);
  }, []);

  const closeDemoModal = useCallback(() => {
    setIframeSrc('');
    setShowDemoModal(false);
  }, []);

  const scrollToSection = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
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

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'contact', label: 'Contact' }
  ];

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

  const floatingCards = [
    { icon: <Eye className="w-4 h-4" />, label: 'AI Monitoring', x: 'left-[-4%]', y: 'top-[8%]', delay: '0s' },
    { icon: <UserCheck className="w-4 h-4" />, label: 'Identity Verification', x: 'right-[0%]', y: 'top-[5%]', delay: '0.5s' },
    { icon: <ShieldCheck className="w-4 h-4" />, label: 'Secure Exams', x: 'left-[-2%]', y: 'bottom-[22%]', delay: '1s' },
    { icon: <BarChart3 className="w-4 h-4" />, label: 'Real-time Analytics', x: 'right-[2%]', y: 'bottom-[15%]', delay: '1.5s' }
  ];

  const trustedInstitutions = [
    { icon: <GraduationCap className="w-8 h-8" />, label: 'Universities' },
    { icon: <Building2 className="w-8 h-8" />, label: 'Colleges' },
    { icon: <MonitorSmartphone className="w-8 h-8" />, label: 'EdTech Platforms' },
    { icon: <Briefcase className="w-8 h-8" />, label: 'Corporate Training' },
    { icon: <Landmark className="w-8 h-8" />, label: 'Government Exams' }
  ];

  const howItWorksSteps = [
    { step: '01', title: 'Register & Setup', desc: 'Create your institution account and configure exam parameters in minutes.' },
    { step: '02', title: 'Create Exams', desc: 'Build assessments with our question bank or import your own content.' },
    { step: '03', title: 'AI Monitors', desc: 'Our AI proctoring system monitors candidates in real-time during exams.' },
    { step: '04', title: 'Get Results', desc: 'Receive instant analytics, integrity reports, and detailed insights.' }
  ];

  return (
    <div id="home" className="min-h-screen bg-[#030712] font-sans text-[#F8FAFC] selection:bg-[#7C3AED]/30 overflow-x-hidden relative">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CSS-RENDERED BACKGROUND — independent of the laptop image  */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030712]">
        {/* Deep navy & violet gradient blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] bg-[#080B24] rounded-full blur-[160px] opacity-80"></div>
        <div className="absolute top-[15%] right-[-15%] w-[50%] h-[50%] bg-[#7C3AED]/12 rounded-full blur-[180px]"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] bg-[#8B5CF6]/10 rounded-full blur-[170px]"></div>
        
        {/* Dotted digital grid */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.15)_1px,transparent_1px)] [background-size:36px_36px] opacity-35"></div>
        
        {/* Soft radial purple glow – positioned behind where the laptop sits */}
        <div className="absolute top-[20%] right-[10%] w-[600px] h-[500px] bg-gradient-to-tr from-[#7C3AED]/12 via-[#A855F7]/8 to-transparent blur-[120px] opacity-70 rounded-full"></div>

        {/* Subtle top-center aura */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-tr from-[#7C3AED]/10 via-[#A855F7]/5 to-transparent blur-3xl opacity-60 rounded-full"></div>

        {/* Particle dots (purely decorative) */}
        <div className="absolute top-[12%] left-[18%] w-1.5 h-1.5 bg-[#A855F7] rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute top-[25%] right-[22%] w-1 h-1 bg-[#E879F9] rounded-full opacity-30 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-[60%] left-[12%] w-1 h-1 bg-[#C084FC] rounded-full opacity-25 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[45%] right-[8%] w-1.5 h-1.5 bg-[#8B5CF6] rounded-full opacity-35 animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-[75%] left-[40%] w-1 h-1 bg-[#A855F7] rounded-full opacity-20 animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-[35%] left-[55%] w-1 h-1 bg-[#E879F9] rounded-full opacity-25 animate-pulse" style={{animationDelay: '3s'}}></div>
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* NAVIGATION BAR                             */}
      {/* ═══════════════════════════════════════════ */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-[#030712]/90 backdrop-blur-xl shadow-lg shadow-black/20' 
          : 'bg-[#030712]/60 backdrop-blur-md'
      } border-b border-[#8B5CF6]/20`}>
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
          
          {/* Center: Nav Links */}
          <div className="hidden lg:flex items-center gap-1 bg-[#0B1026]/90 border border-[rgba(139,92,246,0.25)] rounded-full px-4 py-1.5 backdrop-blur-md shadow-inner">
            {navItems.map((navItem) => (
              <button
                key={navItem.id}
                onClick={() => scrollToSection(navItem.id)}
                className={`relative px-4 py-1.5 text-sm font-semibold transition-all duration-200 rounded-full whitespace-nowrap ${
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

          {/* Right: Login button + Mobile Menu */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/login')}
              className="relative group overflow-hidden text-sm font-bold text-[#F8FAFC] bg-[#0B1026] border border-[rgba(139,92,246,0.45)] hover:border-[#8B5CF6] px-6 py-2.5 rounded-xl transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.35)]"
            >
              <span className="relative z-10">Login</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED]/20 to-[#A855F7]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            {/* Mobile hamburger */}
            <button 
              className="lg:hidden text-[#CBD5E1] hover:text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </nav>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#0B1026]/95 backdrop-blur-xl border-t border-[#8B5CF6]/20 px-6 py-4 space-y-1 animate-slideDown">
            {navItems.map((navItem) => (
              <button
                key={navItem.id}
                onClick={() => scrollToSection(navItem.id)}
                className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === navItem.id
                    ? 'text-[#F8FAFC] bg-[#7C3AED]/20 border-l-2 border-[#8B5CF6]'
                    : 'text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#151B3D]/50'
                }`}
              >
                {navItem.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Two Column Layout                           */}
      {/* Left: text content  |  Right: ISOLATED laptop illustration */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 sm:pt-16 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-6 items-center">
          
          {/* LEFT COLUMN — Content */}
          <div className="flex flex-col space-y-7 text-center lg:text-left order-2 lg:order-1">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0B1026] border border-[rgba(139,92,246,0.45)] text-[#C084FC] px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-[0_0_20px_rgba(124,58,237,0.2)] self-center lg:self-start w-fit">
              <CheckCircle2 className="w-4 h-4 text-[#8B5CF6]" />
              <span>THE PLATFORM OF ASSESSMENTS</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-[#F8FAFC] leading-[1.08]">
              Secure Exams{' '}
              <br className="hidden sm:block" />
              Smarter with{' '}
              <span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E879F9] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(168,85,247,0.4)]">
                AI
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-[#CBD5E1] max-w-xl leading-relaxed mx-auto lg:mx-0">
              Advanced AI proctoring, real-time monitoring, and secure examinations for educational institutions and enterprises.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 justify-center lg:justify-start pt-2">
              <button 
                onClick={() => navigate('/register')}
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-extrabold text-white bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-xl shadow-[0_0_35px_rgba(124,58,237,0.45)] hover:shadow-[0_0_50px_rgba(139,92,246,0.65)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Get Started</span>
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={openDemoModal}
                className="group inline-flex items-center justify-center px-8 py-3.5 text-base font-bold text-[#C084FC] bg-transparent border border-[rgba(139,92,246,0.45)] hover:border-[#8B5CF6] rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:-translate-y-0.5"
              >
                <Play className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>

          </div>

          {/* ─────────────────────────────────────────────────── */}
          {/* RIGHT COLUMN — Isolated laptop illustration        */}
          {/* The laptop PNG sits on transparent/dark background. */}
          {/* All glows and decorations are CSS, not baked in.   */}
          {/* ─────────────────────────────────────────────────── */}
          <div className="relative flex items-center justify-center order-1 lg:order-2 min-h-[320px] sm:min-h-[400px] lg:min-h-[480px]">
            
            {/* Radial purple glow behind the laptop — CSS only */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[70%] h-[70%] bg-[#7C3AED]/18 rounded-full blur-[100px]"></div>
            </div>

            {/* Secondary outer glow ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[90%] h-[85%] bg-[#A855F7]/6 rounded-full blur-[80px]"></div>
            </div>

            {/* Subtle orbital ring SVG — CSS decoration */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[5] opacity-15" viewBox="0 0 600 500" fill="none">
              <ellipse cx="300" cy="250" rx="260" ry="190" stroke="url(#orbGrad)" strokeWidth="0.7" strokeDasharray="4 8" />
              <ellipse cx="300" cy="250" rx="220" ry="155" stroke="url(#orbGrad2)" strokeWidth="0.5" strokeDasharray="3 10" opacity="0.5" />
              <defs>
                <linearGradient id="orbGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7C3AED" />
                  <stop offset="100%" stopColor="#E879F9" />
                </linearGradient>
                <linearGradient id="orbGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#A855F7" />
                  <stop offset="100%" stopColor="#7C3AED" />
                </linearGradient>
              </defs>
            </svg>

            {/* ★ THE ISOLATED LAPTOP IMAGE — only the laptop, no background scene */}
            <img 
              src="/laptop-dashboard.png" 
              alt="PROCTOR AI Dashboard — Laptop showing security shield and exam monitoring interface"
              className="relative z-10 w-full max-w-[580px] h-auto object-contain drop-shadow-[0_20px_60px_rgba(139,92,246,0.35)] select-none"
              loading="eager"
              draggable="false"
            />

            {/* Floating Feature Cards around the laptop */}
            {floatingCards.map((card, index) => (
              <div
                key={index}
                className={`absolute ${card.x} ${card.y} z-20 hidden md:flex items-center gap-2 bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.35)] rounded-xl px-3 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-floatCard`}
                style={{ animationDelay: card.delay }}
              >
                <div className="w-7 h-7 rounded-lg bg-[#151B3D] border border-[#8B5CF6]/30 flex items-center justify-center text-[#A855F7]">
                  {card.icon}
                </div>
                <span className="text-xs font-semibold text-[#E2E8F0] whitespace-nowrap">{card.label}</span>
              </div>
            ))}

            {/* Neon glow at laptop base — CSS effect */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 w-[60%] h-[6px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent blur-md rounded-full z-[6]"></div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FEATURE CARDS                              */}
      {/* ═══════════════════════════════════════════ */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8B5CF6] uppercase mb-3">Why Choose Us</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Built for{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#E879F9] bg-clip-text text-transparent">Integrity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {featureCards.map((card, index) => (
            <div 
              key={index} 
              className="group relative bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.25)] hover:border-[#8B5CF6]/60 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-10px_rgba(139,92,246,0.3)] flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

              <div className="relative z-10">
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

      {/* ═══════════════════════════════════════════ */}
      {/* HOW IT WORKS                               */}
      {/* ═══════════════════════════════════════════ */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <div className="text-center mb-14">
          <p className="text-xs font-bold tracking-[0.2em] text-[#8B5CF6] uppercase mb-3">Simple Process</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            How It{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#E879F9] bg-clip-text text-transparent">Works</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((item, index) => (
            <div key={index} className="relative group">
              {/* Connecting line (hidden on last item) */}
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-40px)] h-px bg-gradient-to-r from-[#8B5CF6]/40 to-[#8B5CF6]/10"></div>
              )}
              
              <div className="text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED]/20 to-[#A855F7]/10 border border-[#8B5CF6]/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-[#8B5CF6] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all duration-300">
                  <span className="text-xl font-black bg-gradient-to-r from-[#8B5CF6] to-[#E879F9] bg-clip-text text-transparent">{item.step}</span>
                </div>
                <h3 className="text-base font-bold text-[#F8FAFC] mb-2">{item.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed max-w-[220px]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* TRUSTED INSTITUTIONS                       */}
      {/* ═══════════════════════════════════════════ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-20 lg:pb-28">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.25em] text-[#64748B] uppercase">
            Trusted by Leading Institutions
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 lg:gap-16">
          {trustedInstitutions.map((inst, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-3 text-[#64748B] hover:text-[#A855F7] transition-colors duration-300 group cursor-default"
            >
              <div className="w-14 h-14 rounded-xl bg-[#0B1026]/80 border border-[#27325A] group-hover:border-[#8B5CF6]/40 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                {inst.icon}
              </div>
              <span className="text-xs font-semibold tracking-wide">{inst.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════ */}
      {/* FOOTER                                     */}
      {/* ═══════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════ */}
      {/* WATCH DEMO VIDEO MODAL                     */}
      {/* ═══════════════════════════════════════════ */}
      {showDemoModal && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-lg"
          onClick={(e) => { if (e.target === e.currentTarget) closeDemoModal(); }}
        >
          <div className="relative bg-[#0B1026] border border-[rgba(139,92,246,0.45)] rounded-2xl max-w-4xl w-full overflow-hidden shadow-[0_0_60px_rgba(124,58,237,0.35)]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#8B5CF6]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#A855F7] flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F8FAFC]">ProctorAI Platform Demo</h3>
                  <p className="text-xs text-[#94A3B8]">See how AI-powered proctoring secures your exams</p>
                </div>
              </div>
              <button 
                onClick={closeDemoModal}
                className="text-[#94A3B8] hover:text-white hover:bg-[#151B3D] rounded-lg p-2 transition-all"
                aria-label="Close demo video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video player — Google Drive embed */}
            <div className="relative bg-black aspect-video">
              {!videoError ? (
                <iframe
                  src={iframeSrc}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="ProctorAI Platform Demo"
                  style={{ border: 'none' }}
                  onError={() => setVideoError(true)}
                />
              ) : (
                /* Fallback when Google Drive video is unavailable */
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-20 h-20 rounded-2xl bg-[#151B3D] border border-[#8B5CF6]/30 flex items-center justify-center mb-6">
                    <Play className="w-8 h-8 text-[#8B5CF6]" />
                  </div>
                  <h4 className="text-xl font-bold text-[#F8FAFC] mb-3">Video Unavailable</h4>
                  <p className="text-sm text-[#94A3B8] max-w-md leading-relaxed mb-4">
                    The demo video could not be loaded. This may happen if Google Drive is blocking playback or the file is not shared publicly.
                  </p>
                  <a
                    href="https://drive.google.com/file/d/1LrvlvW8MUo_O7vfb1TdD8Bz9Naqu5_5e/view?usp=sharing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-xl hover:shadow-[0_0_25px_rgba(124,58,237,0.45)] transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Watch on Google Drive
                  </a>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="px-6 py-3 border-t border-[#8B5CF6]/20 flex items-center justify-between">
              <p className="text-xs text-[#64748B]">
                ProctorAI – AI-Powered Online Examination & Proctoring
              </p>
              <button 
                onClick={closeDemoModal}
                className="text-xs font-semibold text-[#C084FC] hover:text-[#E879F9] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════ */}
      {/* ABOUT MODAL                                */}
      {/* ═══════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════ */}
      {/* CONTACT MODAL                              */}
      {/* ═══════════════════════════════════════════ */}
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
