import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Eye, EyeOff, Camera, FileText, Clock, ShieldCheck, ChevronRight, Key } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState(location.state?.mode || null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, logout } = useAuth();
  
  const handleRoleSelection = (role) => {
    setLoginMode(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid Email address.');
      return;
    }

    setLoading(true);
    
    try {
      const user = await login(email, password);
      
      // Determine effective user role safely from authenticated user object
      let userRole = user?.role;
      if (typeof userRole === 'object' && userRole?.name) {
        userRole = userRole.name;
      }
      if (typeof userRole === 'string') {
        userRole = userRole.toUpperCase();
      }

      if (!userRole) {
        setError('Login failed: User role was not returned by the server.');
        setLoading(false);
        return;
      }

      user.role = userRole;

      // Check role authorization
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard');
        return;
      }

      if (userRole === 'STUDENT') {
        if (loginMode === 'ADMIN') {
          logout();
          setError('Access Denied: Student accounts cannot access the Admin Portal.');
          setLoading(false);
          return;
        }
        navigate('/student/dashboard');
        return;
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 404)) {
        setError('Invalid credentials or no account found.');
      } else {
        let errorMsg = err.response?.data?.message || 'Login failed. Please try again.';
        
        if (typeof errorMsg === 'string') {
          if (errorMsg.includes('Invalid email format') || errorMsg.includes('{email=')) {
            errorMsg = 'Please enter a valid Email address.';
          } else if (errorMsg.startsWith('{') && errorMsg.endsWith('}')) {
            const matches = errorMsg.match(/=([^,}]+)/g);
            if (matches) {
              errorMsg = matches.map(m => m.substring(1)).join(', ');
            }
          }
        }
        
        setError(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex font-sans text-slate-100 relative overflow-hidden selection:bg-[#7C3AED]/30">
      
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
              
              {/* Concentric circles with subtle violet border */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[170px] h-[170px] border border-[#8B5CF6]/25 rounded-full border-dashed animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[270px] h-[270px] border border-[#7C3AED]/15 rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[370px] h-[370px] border border-[#27325A]/40 rounded-full"></div>

              {/* Central Glowing Shield Orb */}
              <div className="relative z-20 flex items-center justify-center w-[130px] h-[130px] bg-gradient-to-tr from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] rounded-full shadow-[0_0_60px_rgba(139,92,246,0.55)]">
                <ShieldCheck className="w-16 h-16 text-[#050816]" strokeWidth={2.2} />
              </div>

              {/* Orbiting Icons with Violet Accents */}
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

            {/* Brand Logo Header */}
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

        {/* Right Side Authentication Card */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="mx-auto w-full max-w-md">
            
            <div className="bg-[#0F172A]/85 backdrop-blur-xl py-10 px-8 sm:px-10 rounded-2xl border border-[rgba(139,92,246,0.35)] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.15)] relative">
              
              <div className="text-center mb-8 relative z-10">
                <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-[#CBD5E1] font-medium">
                  {loginMode ? `Login to continue to your account` : 'Select your portal to continue'}
                </p>
                {/* Accent line under heading */}
                <div className="w-16 h-1 bg-gradient-to-r from-[#7C3AED] via-[#A855F7] to-[#E879F9] mx-auto mt-4 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)]"></div>
              </div>

              {!loginMode ? (
                <div className="space-y-4 relative z-10 mt-8">
                  <button
                    onClick={() => handleRoleSelection('STUDENT')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-[#F8FAFC] bg-[#151B3D] border border-[rgba(139,92,246,0.35)] hover:bg-gradient-to-r hover:from-[#6D28D9] hover:to-[#8B5CF6] hover:border-[#A855F7] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3.5 text-[#8B5CF6] group-hover:text-white transition-colors" strokeWidth={2} />
                      Student Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => handleRoleSelection('ADMIN')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-[#F8FAFC] bg-[#151B3D] border border-[rgba(139,92,246,0.35)] hover:bg-gradient-to-r hover:from-[#6D28D9] hover:to-[#8B5CF6] hover:border-[#A855F7] hover:shadow-[0_0_25px_rgba(139,92,246,0.4)] transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-3.5 text-[#8B5CF6] group-hover:text-white transition-colors" strokeWidth={2} />
                      Admin Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </button>
                </div>
              ) : (
                <form className="space-y-5 relative z-10" onSubmit={handleSubmit}>
                  {/* Demo Credentials Notice */}
                  <div 
                    onClick={() => {
                      if (loginMode === 'ADMIN') {
                        setEmail('admin@gmail.com');
                        setPassword('Admin@123');
                      } else {
                        setEmail('student@gmail.com');
                        setPassword('Student@123');
                      }
                    }}
                    className="bg-[#241715]/80 border border-[#D97706]/40 hover:border-[#F59E0B]/70 rounded-xl p-3.5 mb-2 flex items-start space-x-3 cursor-pointer hover:bg-[#2C1C19] transition-all group"
                  >
                    <div className="p-1.5 bg-[#D97706]/20 rounded-lg text-[#F59E0B] group-hover:scale-105 transition-transform mt-0.5">
                      <Key className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#F8FAFC] text-xs">Demo Credentials</span>
                        <span className="text-[10px] text-[#F59E0B] group-hover:underline font-semibold">Click to fill</span>
                      </div>
                      <div className="text-slate-300 font-mono space-y-0.5 text-[12px]">
                        <p><span className="text-slate-400">Email:</span> {loginMode === 'ADMIN' ? 'admin@gmail.com' : 'student@gmail.com'}</p>
                        <p><span className="text-slate-400">Password:</span> {loginMode === 'ADMIN' ? 'Admin@123' : 'Student@123'}</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border-l-4 border-red-500 p-3.5 rounded-lg">
                      <p className="text-xs sm:text-sm text-red-400 font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#CBD5E1] mb-2">
                      User ID / Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                        placeholder="Enter your user ID or email"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-[#8B5CF6]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-[#CBD5E1] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-4 pr-10 py-3 text-sm text-[#F8FAFC] border border-[#27325A] rounded-xl bg-[#0B1026] focus:border-[#8B5CF6] focus:ring-1 focus:ring-[#8B5CF6] focus:shadow-[0_0_15px_rgba(139,92,246,0.25)] transition-all placeholder-[#64748B] outline-none"
                        placeholder="Enter your password"
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

                  <div className="flex items-center justify-between text-sm pt-1 pb-1">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#7C3AED] focus:ring-[#8B5CF6] border-[#27325A] bg-[#0B1026] rounded cursor-pointer accent-[#7C3AED]"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-[#CBD5E1] text-xs font-medium cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="font-semibold text-xs text-[#8B5CF6] hover:text-[#C084FC] transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(124,58,237,0.4)] text-base font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] focus:outline-none transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center mt-6 text-xs font-medium text-[#94A3B8] pt-4 border-t border-[#27325A]">
                    <button type="button" onClick={() => setLoginMode(null)} className="hover:text-[#F8FAFC] transition-colors mr-4">
                      &larr; Back to Portal Selection
                    </button>
                    {loginMode === 'STUDENT' && (
                      <span className="mt-3 block sm:inline-block">
                        Don't have an account?{' '}
                        <a href="/register" className="font-bold text-[#8B5CF6] hover:text-[#C084FC] transition-colors" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
                          Register
                        </a>
                      </span>
                    )}
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
