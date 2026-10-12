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
  UserCheck,
  Shield,
  Check
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
    { to: '/student/exams', label: 'My Exams', icon: Clock },
    { to: '/student/results', label: 'Results', icon: CheckCircle2 },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-[#E5E7EB] p-4 min-h-[calc(100vh-4rem)] flex flex-col justify-between z-30 relative">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-bold text-[#7C3AED] tracking-wider uppercase">
            {isAdmin ? 'Administration' : 'Student Portal'}
          </p>
        </div>

        <nav className="space-y-1">
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
                      ? 'bg-[#EDE9FE] text-[#7C3AED] font-semibold shadow-sm'
                      : 'text-[#64748B] hover:text-[#111827] hover:bg-[#F7F8FC]'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-500 border border-red-100 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Security Status Footnote */}
      <div className="p-3.5 rounded-xl bg-[#F7F8FC] border border-[#E5E7EB] text-xs text-[#64748B] space-y-1">
        <div className="flex items-center gap-2 text-[#7C3AED] font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>AI Proctoring Active</span>
        </div>
        <p className="text-[11px] text-[#9CA3AF] leading-tight">
          Session secured with AI monitoring & integrity enforcement.
        </p>
      </div>
    </aside>
  );
};
export default Sidebar;
