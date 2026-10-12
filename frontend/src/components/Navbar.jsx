import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, LogOut, User, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-md border-b border-[#27325A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 group-hover:scale-105 transition-transform">
            <Shield className="w-8 h-8 text-[#8B5CF6] absolute" fill="currentColor" />
            <Check className="w-4 h-4 text-[#050816] absolute mt-0.5" strokeWidth={4} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-[#F8FAFC]">
                Proctor
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#7C3AED]/15 text-[#A855F7] border border-[#8B5CF6]/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]">
                AI
              </span>
            </div>
            <p className="text-[10px] text-[#94A3B8] font-mono">AI Proctoring Platform</p>
          </div>
        </Link>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link
                to="/admin/monitoring"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#C084FC] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all radar-live"
              >
                <Activity className="w-3.5 h-3.5" />
                Live Proctoring
              </Link>
            )}

            <div className="flex items-center gap-3 pl-3 border-l border-[#27325A]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-[#F8FAFC]">{user.name}</p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-[#CBD5E1]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-[#A855F7] shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]'}`}></span>
                  <span>{user.role}</span>
                  {user.studentId && <span className="font-mono text-[11px] text-[#94A3B8]">({user.studentId})</span>}
                </div>
              </div>

              <div className="h-9 w-9 rounded-full bg-[#0B1026] border border-[#27325A] flex items-center justify-center text-[#F8FAFC] font-semibold text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-[#94A3B8] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-[#CBD5E1] hover:text-[#F8FAFC] px-3.5 py-1.5 rounded-xl hover:bg-[#151B3D] transition-colors border border-transparent hover:border-[#27325A]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] px-4 py-1.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
            >
              Register Student
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
