import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Shield, Search, Filter, AlertTriangle, Monitor, LogIn, FileText, CheckCircle, RefreshCw } from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/audit-logs');
      setLogs(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load audit logs", err);
      setError('Failed to load security audit logs');
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('MALPRACTICE')) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (action.includes('LOGIN') || action.includes('LOGOUT')) return <LogIn className="w-4 h-4 text-[#7C3AED]" />;
    if (action.includes('EXAM') && !action.includes('SUBMIT')) return <FileText className="w-4 h-4 text-[#7C3AED]" />;
    if (action.includes('SUBMIT')) return <CheckCircle className="w-4 h-4 text-emerald-400" />;
    return <Monitor className="w-4 h-4 text-[#9CA3AF]" />;
  };

  const getActionBadgeColor = (action) => {
    if (action.includes('MALPRACTICE')) return 'bg-red-500/10 text-red-400 border-red-500/30';
    if (action.includes('SUBMIT')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    if (action.includes('START')) return 'bg-[#7C3AED]/20 text-[#7C3AED] border-[#7C3AED]/40';
    if (action.includes('LOGIN')) return 'bg-[#F7F8FC] text-gray-600 border-[#E5E7EB]';
    return 'bg-[#7C3AED]/15 text-[#7C3AED] border-[#7C3AED]/30';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterAction === 'ALL') return matchesSearch;
    if (filterAction === 'MALPRACTICE') return matchesSearch && log.action.includes('MALPRACTICE');
    if (filterAction === 'EXAM_ACTIVITY') return matchesSearch && (log.action.includes('START') || log.action.includes('SUBMIT'));
    if (filterAction === 'SYSTEM') return matchesSearch && !log.action.includes('MALPRACTICE') && !log.action.includes('START') && !log.action.includes('SUBMIT');
    
    return matchesSearch;
  });

  return (
    <div className="p-6 h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-[#FFFFFF] p-6 rounded-2xl border border-[#E5E7EB] shadow-card">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#6D28D9] text-white shadow-card shadow-[#7C3AED]/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Security Audit Logs
          </h1>
          <p className="text-[#9CA3AF] text-sm mt-1">Immutable, real-time record of system activities and security events.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-10 pr-4 py-2.5 bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:outline-none w-56 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
            <select 
              className="pl-10 pr-8 py-2.5 bg-[#F7F8FC] border border-[#E5E7EB] rounded-xl text-sm text-[#111827] focus:ring-2 focus:ring-[#7C3AED] focus:border-[#7C3AED] focus:outline-none appearance-none cursor-pointer transition-all"
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
            >
              <option value="ALL">All Events</option>
              <option value="MALPRACTICE">Malpractice Only</option>
              <option value="EXAM_ACTIVITY">Exam Activity</option>
              <option value="SYSTEM">System/Auth</option>
            </select>
          </div>
          <button 
            onClick={fetchLogs} 
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white rounded-xl text-sm font-semibold shadow-card shadow-[#7C3AED]/25 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="flex-1 bg-[#FFFFFF] rounded-2xl border border-[#E5E7EB] overflow-hidden flex flex-col shadow-card">
        {loading ? (
          <div className="p-12 text-center text-[#9CA3AF] flex-1 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 text-[#7C3AED] animate-spin" />
            <p className="text-sm font-medium">Loading secure audit trail...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400 flex-1 flex items-center justify-center">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F7F8FC] sticky top-0 z-10 border-b border-[#E5E7EB]">
                <tr className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                  <th className="p-4 pl-6 w-48">Timestamp</th>
                  <th className="p-4 w-48">Action Type</th>
                  <th className="p-4 w-40">User</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 pr-6 w-36">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]/50">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-12 text-center text-[#9CA3AF]">
                      No logs found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#F7F8FC]/70 transition-colors">
                      <td className="p-4 pl-6 whitespace-nowrap text-xs font-medium text-[#9CA3AF]">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getActionBadgeColor(log.action)}`}>
                            {log.action}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap text-sm font-semibold text-[#111827]">
                        {log.username || `User #${log.userId}`}
                      </td>
                      <td className="p-4 text-sm text-[#64748B]">
                        {log.description}
                      </td>
                      <td className="p-4 pr-6 whitespace-nowrap text-xs text-[#9CA3AF] font-mono">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;

