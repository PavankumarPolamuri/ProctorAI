import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, ArrowRight, BarChart, Calendar, TrendingUp } from 'lucide-react';

const StudentOverview = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [availableExams, setAvailableExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attemptsRes, examsRes] = await Promise.all([
          api.get('/student/my-attempts'),
          api.get('/student/exams')
        ]);
        
        const completedAttempts = attemptsRes.data.filter(
          attempt => attempt.status === 'SUBMITTED' || attempt.status === 'AUTO_SUBMITTED' || attempt.status === 'FLAGGED'
        );
        
        setResults(completedAttempts);
        setAvailableExams(examsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div className="text-center p-8 text-[#64748B]">Loading dashboard...</div>;

  const completedExams = results.length;
  const averageScore = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) 
    : 0;
  
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl font-extrabold tracking-tight mb-1">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-white/80">Here is your examination activity and performance overview.</p>
          {availableExams.length > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-xl text-sm font-medium">
              <Calendar className="w-4 h-4" />
              {availableExams.length} exam{availableExams.length > 1 ? 's' : ''} available
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow">
          <div className="p-3.5 rounded-xl bg-[#EDE9FE] text-[#7C3AED] mr-5">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Available Exams</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{availableExams.length}</p>
          </div>
        </div>
        
        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 mr-5">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{completedExams}</p>
          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] p-6 rounded-2xl flex items-center shadow-card hover:shadow-card-hover transition-shadow">
          <div className="p-3.5 rounded-xl bg-[#F5F3FF] text-[#8B5CF6] mr-5">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#64748B] tracking-wider uppercase mb-1">Avg Score</p>
            <p className="text-3xl font-extrabold text-[#111827] tracking-tight">{averageScore}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
            <h2 className="text-base font-bold text-[#111827]">Recent Results</h2>
            <Link to="/student/results" className="text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors flex items-center font-semibold">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center text-[#9CA3AF] py-6 font-medium">No exams completed yet.</div>
            ) : (
              <div className="space-y-3">
                {results.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex justify-between items-center p-4 bg-[#F7F8FC] rounded-xl border border-[#E5E7EB] hover:border-[#C4B5FD] transition-colors">
                    <div>
                      <p className="font-bold text-[#111827] mb-1">{result.examTitle}</p>
                      <p className="text-xs text-[#64748B] flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#7C3AED]" />
                        {new Date(result.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-lg text-[#7C3AED] tracking-tight">{result.score} <span className="text-[#9CA3AF] text-sm font-medium">/ {result.examTotalMarks}</span></p>
                      <p className="text-xs font-bold text-[#64748B] bg-white border border-[#E5E7EB] inline-block px-2.5 py-0.5 rounded-full mt-1">
                        {((result.score / result.examTotalMarks) * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Up Next */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-card">
          <div className="px-6 py-4 border-b border-[#E5E7EB] flex justify-between items-center">
            <h2 className="text-base font-bold text-[#111827]">Upcoming Exams</h2>
            <Link to="/student/exams" className="text-sm text-[#7C3AED] hover:text-[#6D28D9] transition-colors flex items-center font-semibold">
              Browse exams <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {availableExams.length === 0 ? (
              <div className="text-center text-[#9CA3AF] py-6 font-medium">You're all caught up! No pending exams.</div>
            ) : (
              <div className="space-y-3">
                {availableExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center p-4 border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl hover:border-[#C4B5FD] transition-all group">
                    <div>
                      <p className="font-bold text-[#111827] mb-1 group-hover:text-[#7C3AED] transition-colors">{exam.title}</p>
                      <div className="flex items-center text-xs text-[#64748B]">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#7C3AED]" />
                        {exam.durationMinutes} mins
                      </div>
                    </div>
                    <Link to="/student/exams" className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-white text-sm font-bold rounded-xl shadow-purple-glow transition-all hover:-translate-y-0.5">
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentOverview;
