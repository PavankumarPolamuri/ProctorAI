import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, Check, LogOut, User, Activity, Bell, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] rounded-xl shadow-purple-glow group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white absolute" />
            <Check className="w-3 h-3 text-white absolute mt-0.5" strokeWidth={4} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-[#111827]">
                Proctor
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                AI
              </span>
            </div>
          </div>
        </Link>

        {/* User Actions */}
        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link
                to="/admin/monitoring"
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#EDE9FE] text-[#7C3AED] text-xs font-semibold hover:bg-[#DDD6FE] transition-all radar-live"
              >
                <Activity className="w-3.5 h-3.5" />
                Live Proctoring
              </Link>
            )}

            <button className="p-2 text-[#64748B] hover:text-[#7C3AED] hover:bg-[#F7F8FC] rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pl-3 border-l border-[#E5E7EB]">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#111827]">{user.name}</p>
                <div className="flex items-center justify-end gap-1.5 text-xs text-[#64748B]">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-[#7C3AED]' : 'bg-green-500'}`}></span>
                  <span>{user.role}</span>
                  {user.studentId && <span className="text-[11px] text-[#9CA3AF]">({user.studentId})</span>}
                </div>
              </div>

              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A78BFA] flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 text-[#64748B] hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-[#64748B] hover:text-[#111827] px-3.5 py-1.5 rounded-xl hover:bg-[#F7F8FC] transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="text-sm font-bold bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white px-4 py-1.5 rounded-xl shadow-purple-glow transition-all"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
export default Navbar;
