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

  if (loading) return <div className="p-8 text-center text-[#64748B]">Loading Admin Dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">Welcome, Admin</h1>
          <p className="text-sm text-[#64748B]">Real-time system overview and examination controls.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/exams')}
          className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] text-white font-bold px-5 py-2.5 rounded-xl shadow-purple-glow flex items-center transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Exam
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow group">
          <div className="p-4 rounded-2xl bg-[#EDE9FE] text-[#7C3AED] mr-5">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Total Exams</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{analytics?.totalExams || 0}</p>
          </div>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow group">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600 mr-5">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Active Exams</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{analytics?.activeAttempts || 0}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow group">
          <div className="p-4 rounded-2xl bg-red-50 text-red-500 mr-5">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Malpractices</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{analytics?.totalMalpracticeEvents || 0}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-card">
        <div className="px-6 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-base font-bold text-[#111827] tracking-wide">Manage Exams</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E5E7EB]">
            <thead className="bg-[#F7F8FC]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Title
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-[#64748B] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {exams.map((exam) => (
                <tr key={exam.id} className="hover:bg-[#F7F8FC] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-[#111827] group-hover:text-[#7C3AED] transition-colors">{exam.title}</div>
                    <div className="text-xs text-[#9CA3AF] mt-0.5">{exam.questionCount} Questions</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-[#EDE9FE] text-[#7C3AED]">
                      {exam.subject}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#64748B] font-medium">
                    {exam.durationMinutes} mins
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exam.published ? (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                        Published
                      </span>
                    ) : (
                      <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button 
                      onClick={() => navigate(`/admin/proctoring/${exam.id}`)}
                      className="text-[#7C3AED] bg-[#EDE9FE] hover:bg-gradient-to-r hover:from-[#7C3AED] hover:to-[#6D28D9] hover:text-white flex items-center inline-flex px-3 py-1.5 rounded-xl transition-all text-xs font-bold shadow-sm"
                      title="Live Proctoring"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      Proctor
                    </button>
                    <button 
                      onClick={() => navigate('/admin/exams')}
                      className="text-[#64748B] hover:text-[#111827] bg-[#F7F8FC] hover:bg-white flex items-center inline-flex px-3 py-1.5 rounded-xl border border-[#E5E7EB] transition-all text-xs font-semibold"
                    >
                      <Settings className="w-3.5 h-3.5 mr-1.5" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {exams.length === 0 && (
            <div className="p-8 text-center text-[#64748B]">
              No exams found. Click "Create New Exam" to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
