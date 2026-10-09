import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Eye, EyeOff, Camera, FileText, Clock, ShieldCheck, CheckCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid Email address.');
      return;
    }

    setLoading(true);
    
    try {
      await register(name, email, password, 'STUDENT');
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        login(email, password)
          .then(() => navigate('/student/dashboard'))
          .catch(() => navigate('/login', { state: { mode: 'STUDENT' } }));
      }, 2500);
    } catch (err) {
      let errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
      
      if (errorMsg.toLowerCase().includes('already registered') || errorMsg.toLowerCase().includes('already exists') || errorMsg.toLowerCase().includes('duplicate')) {
        errorMsg = 'This account already exists. Please login.';
      } else if (typeof errorMsg === 'string' && errorMsg.startsWith('{') && errorMsg.endsWith('}')) {
        const matches = errorMsg.match(/=([^,}]+)/g);
        if (matches) {
          errorMsg = matches.map(m => m.substring(1)).join(', ');
        }
      }
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex font-sans text-slate-100 relative overflow-hidden selection:bg-[#7C3AED]/30">
      
      {/* Success Toast */}
      {success && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-[#0B1026] text-[#A855F7] px-6 py-3.5 rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.3)] flex items-center space-x-3 border border-[#8B5CF6]/50 animate-bounce">
          <CheckCircle className="w-5 h-5 text-[#8B5CF6]" />
          <span className="font-bold text-sm text-[#F8FAFC]">Account created successfully! Redirecting...</span>
        </div>
      )}

      {/* Background radial lights & subtle violet glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#7C3AED]/10 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-[#8B5CF6]/8 rounded-full blur-[130px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#27325A_1px,transparent_1px)] [background-size:32px_32px] opacity-20"></div>
      </div>

      <div className="flex w-full max-w-7xl mx-auto z-10">
        
        {/* Left Side Graphic Visual */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between items-center py-12 px-8 relative">
          <div></div>

          <div className="relative flex flex-col items-center">
            
            <div className="relative w-[380px] h-[380px] flex items-center justify-center mb-10">
              
              {/* Concentric circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] border border-[#8B5CF6]/25 rounded-full border-dashed animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[270px] h-[270px] border border-[#7C3AED]/15 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[370px] h-[370px] border border-[#27325A]/40 rounded-full"></div>

              {/* Central Glowing Shield Orb */}
              <div className="relative z-20 flex items-center justify-center w-[130px] h-[130px] bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-full shadow-[0_0_60px_rgba(139,92,246,0.55)]">
                <ShieldCheck className="w-16 h-16 text-[#050816]" strokeWidth={2.2} />
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                {/* Top Left - Camera */}
                <div className="absolute top-[8%] left-[8%] bg-[#0B1026] p-3 rounded-2xl border border-[#27325A] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <Camera className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
                </div>
                {/* Top Right - User */}
                <div className="absolute top-[8%] right-[8%] bg-[#0B1026] p-3 rounded-2xl border border-[#27325A] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <User className="w-5 h-5 text-[#A855F7]" strokeWidth={2} />
                </div>
                {/* Bottom Left - File */}
                <div className="absolute bottom-[8%] left-[8%] bg-[#0B1026] p-3 rounded-2xl border border-[#27325A] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <FileText className="w-5 h-5 text-[#C084FC]" strokeWidth={2} />
                </div>
                {/* Bottom Right - Clock */}
                <div className="absolute bottom-[8%] right-[8%] bg-[#0B1026] p-3 rounded-2xl border border-[#27325A] shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                  <Clock className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Brand Header */}
            <div className="text-center relative z-20">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-[#8B5CF6] mr-3 filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]" strokeWidth={2.5} />
                <h1 className="text-3xl font-extrabold tracking-tight text-[#F8FAFC] uppercase">
                  PROCTOR<span className="bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#E879F9] bg-clip-text text-transparent">AI</span>
                </h1>
              </div>
              
              {/* Accent Line */}
              <div className="w-28 h-0.5 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#E879F9] mx-auto mb-6 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
              
              <p className="text-[#F8FAFC] font-bold text-lg mb-1 tracking-wide">Safe. Reliable. Fair.</p>
              <p className="text-[#CBD5E1] max-w-sm mx-auto text-sm leading-relaxed">
                Empowering the future<br/>of assessments.
              </p>
            </div>
            
          </div>
          
          <div className="text-center text-[#94A3B8] text-xs font-medium w-full z-20">
            &copy; {new Date().getFullYear()} ProctorAI. All rights reserved.
          </div>
        </div>

        {/* Right Side Register Form Card */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-16 relative z-10 overflow-y-auto">
          <div className="mx-auto w-full max-w-md my-auto">
            
            <div className="bg-[#0F172A]/85 backdrop-blur-xl py-9 px-8 sm:px-10 rounded-2xl border border-[rgba(139,92,246,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.15)] relative">
              
              <div className="text-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2 tracking-tight">Create Account</h2>
                <p className="text-sm text-[#CBD5E1] font-medium">Register as a student to take exams</p>
                {/* Accent line under heading */}
                <div className="w-16 h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#E879F9] mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)]"></div>
              </div>

              <form className="space-y-4 relative z-10 mt-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border-l-4 border-red-500 p-3 rounded-lg">
                    <p className="text-xs sm:text-sm text-red-400 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                      placeholder="Enter your full name"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                      placeholder="Enter your email"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#8B5CF6]" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                      placeholder="Create a password"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <Eye className="h-4 w-4 text-[#8B5CF6] hover:text-[#A855F7] transition-colors" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-[#64748B] hover:text-[#CBD5E1] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-semibold text-[#CBD5E1] mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full pl-4 pr-10 py-2.5 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                      placeholder="Confirm your password"
                    />
                    <div 
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <Eye className="h-4 w-4 text-[#8B5CF6] hover:text-[#A855F7] transition-colors" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-[#64748B] hover:text-[#CBD5E1] transition-colors" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.4)] text-base font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] focus:outline-none transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading ? 'Creating Account...' : 'Register'}
                  </button>
                </div>

                <div className="text-center mt-5 text-xs font-medium text-[#94A3B8] pt-4 border-t border-[#27325A]">
                  <span className="inline-block">
                    Already have an account?{' '}
                    <a href="/login" className="font-bold text-[#8B5CF6] hover:text-[#C084FC] transition-colors" onClick={(e) => { e.preventDefault(); navigate('/login', { state: { mode: 'STUDENT' } }); }}>
                      Login here
                    </a>
                  </span>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
