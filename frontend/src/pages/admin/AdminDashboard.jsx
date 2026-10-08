import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { BookOpen, Users, AlertTriangle, Plus, Eye, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExamsAndAnalytics();
  }, []);

  const fetchExamsAndAnalytics = async () => {
    try {
      const [examsRes, analyticsRes] = await Promise.all([
        api.get('/admin/exams'),
        api.get('/admin/analytics')
      ]);
      setExams(examsRes.data);
      setAnalytics(analyticsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-400 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Welcome, Admin</h1>
          <p className="text-sm text-[#94A3B8]">Real-time system overview and examination controls.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/exams')}
          className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Exam
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/15 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-[#7C3AED]/15 text-[#A855F7] mr-5 border border-[#8B5CF6]/30 z-10">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Total Exams</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{analytics?.totalExams || 0}</p>
          </div>
        </div>
        
        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 mr-5 border border-emerald-500/30 z-10">
            <Users className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Active Exams</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{analytics?.activeAttempts || 0}</p>
          </div>
        </div>

        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center relative overflow-hidden group shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/15 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
          <div className="p-4 rounded-2xl bg-red-500/15 text-red-400 mr-5 border border-red-500/30 z-10">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="z-10">
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Malpractices</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{analytics?.totalMalpracticeEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111936] border border-[#27325A] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="px-6 py-4 border-b border-[#27325A] bg-[#151B3D]/70">
          <h2 className="text-base font-bold text-[#F8FAFC] tracking-wide">Manage Exams</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#27325A]">
            <thead className="bg-[#0B1026]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#94A3B8] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27325A]">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-[#151B3D] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#C084FC] transition-colors">{exam.title}</div>
                    <div className="text-xs text-[#94A3B8] mt-0.5">{exam.questionCount} Questions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-[#7C3AED]/20 text-[#A855F7] border border-[#8B5CF6]/30">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#CBD5E1] font-medium">
                    {exam.durationMinutes} mins
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exam.published ? (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      onClick={() => navigate(`/admin/proctoring/${exam.id}`)}
                      className="text-[#F8FAFC] bg-[#7C3AED]/20 hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#A855F7] flex items-center inline-flex px-3 py-1.5 rounded-xl border border-[#8B5CF6]/30 transition-all text-xs font-bold shadow-sm"
                      title="Live Proctoring"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5 text-[#A855F7]" />
                      Proctor
                    </button>
                    <button 
                      onClick={() => navigate('/admin/exams')}
                      className="text-[#CBD5E1] hover:text-[#F8FAFC] bg-[#151B3D] hover:bg-[#1f2858] flex items-center inline-flex px-3 py-1.5 rounded-xl border border-[#27325A] transition-all text-xs font-semibold">
                      <Settings className="w-3.5 h-3.5 mr-1.5 text-[#94A3B8]" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && (
            <div className="p-8 text-center text-[#94A3B8]">
              No exams found. Click "Create New Exam" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
