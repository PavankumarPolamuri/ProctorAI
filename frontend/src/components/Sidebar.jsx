import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  FileText, 
  HelpCircle, 
  Activity, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  UserCheck
} from 'lucide-react';

const Sidebar = () => {
  const { isAdmin } = useAuth();

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/exams', label: 'Exams Manager', icon: FileText },
    { to: '/admin/questions', label: 'Question Bank', icon: HelpCircle },
    { to: '/admin/monitoring', label: 'Live Monitoring', icon: Activity, badge: 'LIVE' },
    { to: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldAlert },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/exams', label: 'Available Exams', icon: Clock },
    { to: '/student/results', label: 'My Exam Results', icon: CheckCircle2 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-[#0B1026] border-r border-[#27325A] p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between z-30 relative">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold text-[#A855F7] tracking-wider uppercase">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </p>
        </div>

        <nav className="space-y-1.5">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard' || item.to === '/student/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C3AED]/25 to-[#8B5CF6]/20 text-[#FFFFFF] border border-[#8B5CF6]/40 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                      : 'text-[#CBD5E1] hover:text-[#FFFFFF] hover:bg-[#151B3D] border border-transparent'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-[#A855F7]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Security Status Footnote */}
      <div className="p-3.5 rounded-xl bg-[#111936] border border-[#27325A] text-xs text-[#CBD5E1] space-y-1">
        <div className="flex items-center gap-2 text-[#A855F7] font-semibold">
          <UserCheck className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Anti-Malpractice Active</span>
        </div>
        <p className="text-[11px] text-[#94A3B8] leading-tight">
          Session protected by STOMP over WS, full-screen lock enforcement & AI monitoring.
        </p>
      </div>
    </aside>
  );
};
export default Sidebar;
