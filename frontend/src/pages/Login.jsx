import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, User, Eye, EyeOff, Camera, FileText, Clock, ShieldCheck, ChevronRight, Key, BookOpen } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F7F8FC] flex font-sans text-[#111827] relative overflow-hidden selection:bg-[#7C3AED]/20">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#EDE9FE]/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DDD6FE]/30 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex w-full max-w-7xl mx-auto z-10">
        
        {/* Left Side — Branding Panel */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between items-center py-12 px-8 relative">
          <div></div>
          
          <div className="relative flex flex-col items-center">
            
            <div className="relative w-[340px] h-[340px] flex items-center justify-center mb-10">
              {/* Concentric circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] border border-[#DDD6FE] rounded-full border-dashed animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border border-[#EDE9FE] rounded-full"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] border border-[#F3F0FF] rounded-full"></div>

              {/* Central Shield */}
              <div className="relative z-20 flex items-center justify-center w-[120px] h-[120px] bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-full shadow-purple-glow-lg">
                <ShieldCheck className="w-14 h-14 text-white" strokeWidth={2.2} />
              </div>

              {/* Orbiting Icons */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute top-[8%] left-[8%] bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-card">
                  <Camera className="w-5 h-5 text-[#7C3AED]" strokeWidth={2} />
                </div>
                <div className="absolute top-[8%] right-[8%] bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-card">
                  <User className="w-5 h-5 text-[#8B5CF6]" strokeWidth={2} />
                </div>
                <div className="absolute bottom-[8%] left-[8%] bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-card">
                  <FileText className="w-5 h-5 text-[#A78BFA]" strokeWidth={2} />
                </div>
                <div className="absolute bottom-[8%] right-[8%] bg-white p-3 rounded-2xl border border-[#E5E7EB] shadow-card">
                  <Clock className="w-5 h-5 text-[#7C3AED]" strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Brand */}
            <div className="text-center relative z-20">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-[#7C3AED] mr-2.5" strokeWidth={2.5} />
                <h1 className="text-3xl font-extrabold tracking-tight text-[#111827] uppercase">
                  PROCTOR<span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">AI</span>
                </h1>
              </div>
              <div className="w-24 h-1 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] mx-auto mb-5 rounded-full"></div>
              <p className="text-[#111827] font-bold text-lg mb-1">Safe. Reliable. Fair.</p>
              <p className="text-[#64748B] max-w-sm mx-auto text-sm leading-relaxed">
                Empowering the future<br/>of assessments.
              </p>
            </div>
          </div>
          
          <div className="text-center text-[#9CA3AF] text-xs font-medium w-full z-20">
            &copy; {new Date().getFullYear()} ProctorAI. All rights reserved.
          </div>
        </div>

        {/* Right Side — Login Card */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-16 relative z-10">
          <div className="mx-auto w-full max-w-md">
            
            <div className="bg-white py-10 px-8 sm:px-10 rounded-2xl border border-[#E5E7EB] shadow-card-lg relative">
              
              <div className="text-center mb-8">
                {/* Mobile logo */}
                <div className="flex items-center justify-center mb-4 lg:hidden">
                  <Shield className="w-6 h-6 text-[#7C3AED] mr-2" strokeWidth={2.5} />
                  <span className="text-xl font-extrabold tracking-tight text-[#111827] uppercase">
                    PROCTOR<span className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] bg-clip-text text-transparent">AI</span>
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-[#111827] mb-2 tracking-tight">Welcome Back</h2>
                <p className="text-sm text-[#64748B] font-medium">
                  {loginMode ? `Login to continue to your account` : 'Select your portal to continue'}
                </p>
                <div className="w-16 h-1 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] mx-auto mt-4 rounded-full"></div>
              </div>

              {!loginMode ? (
                <div className="space-y-4 mt-8">
                  <button
                    onClick={() => handleRoleSelection('STUDENT')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-[#111827] bg-[#F7F8FC] border border-[#E5E7EB] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] hover:text-[#7C3AED] transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-3.5 text-[#7C3AED]" strokeWidth={2} />
                      Student Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                  </button>

                  <button
                    onClick={() => handleRoleSelection('ADMIN')}
                    className="w-full flex items-center justify-between py-4 px-6 rounded-xl text-base font-semibold text-[#111827] bg-[#F7F8FC] border border-[#E5E7EB] hover:bg-[#EDE9FE] hover:border-[#C4B5FD] hover:text-[#7C3AED] transition-all duration-300 group"
                  >
                    <div className="flex items-center">
                      <ShieldCheck className="w-5 h-5 mr-3.5 text-[#7C3AED]" strokeWidth={2} />
                      Admin Login
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#7C3AED] group-hover:translate-x-1 transition-all" />
                  </button>

                  {/* Practice exam link */}
                  <div className="pt-4 border-t border-[#E5E7EB]">
                    <button
                      onClick={() => navigate('/practice')}
                      className="w-full flex items-center justify-center py-3 px-6 rounded-xl text-sm font-semibold text-[#7C3AED] bg-white border border-[#DDD6FE] hover:bg-[#EDE9FE] transition-all"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Try a Free Practice Exam
                    </button>
                  </div>
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
                    className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-2 flex items-start space-x-3 cursor-pointer hover:bg-amber-100/60 transition-all group"
                  >
                    <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 group-hover:scale-105 transition-transform mt-0.5">
                      <Key className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-[#111827] text-xs">Demo Credentials</span>
                        <span className="text-[10px] text-amber-600 group-hover:underline font-semibold">Click to fill</span>
                      </div>
                      <div className="text-[#64748B] font-mono space-y-0.5 text-[12px]">
                        <p><span className="text-[#9CA3AF]">Email:</span> {loginMode === 'ADMIN' ? 'admin@gmail.com' : 'student@gmail.com'}</p>
                        <p><span className="text-[#9CA3AF]">Password:</span> {loginMode === 'ADMIN' ? 'Admin@123' : 'Student@123'}</p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-3.5 rounded-lg">
                      <p className="text-xs sm:text-sm text-red-600 font-medium">{error}</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-[#111827] mb-2">
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
                        className="block w-full pl-4 pr-10 py-3 text-sm text-[#111827] border border-[#E5E7EB] rounded-xl bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all placeholder-[#9CA3AF] outline-none"
                        placeholder="Enter your user ID or email"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                        <User className="h-4 w-4 text-[#7C3AED]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-[#111827] mb-2">
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
                        className="block w-full pl-4 pr-10 py-3 text-sm text-[#111827] border border-[#E5E7EB] rounded-xl bg-white focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE] transition-all placeholder-[#9CA3AF] outline-none"
                        placeholder="Enter your password"
                      />
                      <div 
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <Eye className="h-4 w-4 text-[#7C3AED] hover:text-[#6D28D9] transition-colors" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-[#9CA3AF] hover:text-[#64748B] transition-colors" />
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
                        className="h-4 w-4 text-[#7C3AED] focus:ring-[#7C3AED] border-[#E5E7EB] bg-white rounded cursor-pointer accent-[#7C3AED]"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-[#64748B] text-xs font-medium cursor-pointer">
                        Remember me
                      </label>
                    </div>
                    <a href="#" className="font-semibold text-xs text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
                      Forgot Password?
                    </a>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3.5 px-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] shadow-purple-glow hover:shadow-purple-glow-lg focus:outline-none transition-all duration-300 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </button>

                  <div className="text-center mt-6 text-xs font-medium text-[#9CA3AF] pt-4 border-t border-[#E5E7EB]">
                    <button type="button" onClick={() => setLoginMode(null)} className="hover:text-[#111827] transition-colors mr-4">
                      &larr; Back to Portal Selection
                    </button>
                    {loginMode === 'STUDENT' && (
                      <span className="mt-3 block sm:inline-block">
                        Don't have an account?{' '}
                        <a href="/register" className="font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
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
