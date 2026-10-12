import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Award, Clock, ArrowRight, BarChart } from 'lucide-react';

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
        
        // Filter only completed attempts for results
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

  if (loading) return <div className="text-center p-8 text-[#94A3B8]">Loading dashboard...</div>;

  const completedExams = results.length;
  const averageScore = results.length > 0 
    ? (results.reduce((acc, curr) => acc + curr.score, 0) / results.length).toFixed(1) 
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-sm text-[#94A3B8]">Here is your examination activity and performance overview.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="p-4 rounded-2xl bg-[#7C3AED]/15 text-[#A855F7] mr-5 border border-[#8B5CF6]/30">
            <BookOpen className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Available Exams</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{availableExams.length}</p>
          </div>
        </div>
        
        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="p-4 rounded-2xl bg-emerald-500/15 text-emerald-400 mr-5 border border-emerald-500/30">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Completed</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{completedExams}</p>
          </div>
        </div>

        <div className="bg-[#111936] border border-[#27325A] p-6 rounded-2xl flex items-center shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="p-4 rounded-2xl bg-[#A855F7]/15 text-[#E879F9] mr-5 border border-[#A855F7]/30">
            <BarChart className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#94A3B8] tracking-wider uppercase mb-1">Avg Score</p>
            <p className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight">{averageScore}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="bg-[#111936] border border-[#27325A] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27325A] flex justify-between items-center bg-[#151B3D]/70">
            <h2 className="text-base font-bold text-[#F8FAFC] tracking-wide">Recent Results</h2>
            <Link to="/student/results" className="text-sm text-[#8B5CF6] hover:text-[#C084FC] transition-colors flex items-center font-semibold">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {results.length === 0 ? (
              <div className="text-center text-[#94A3B8] py-6 font-medium">No exams completed yet.</div>
            ) : (
              <div className="space-y-4">
                {results.slice(0, 3).map((result) => (
                  <div key={result.id} className="flex justify-between items-center p-4 bg-[#151B3D] rounded-xl border border-[#27325A] hover:border-[#8B5CF6]/40 transition-colors">
                    <div>
                      <p className="font-bold text-[#F8FAFC] mb-1">{result.examTitle}</p>
                      <p className="text-xs text-[#94A3B8] flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#8B5CF6]" />
                        {new Date(result.startTime).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-lg text-[#A855F7] tracking-tight">{result.score} <span className="text-[#94A3B8] text-sm font-medium">/ {result.examTotalMarks}</span></p>
                      <p className="text-xs font-bold text-[#CBD5E1] bg-[#0B1026] border border-[#27325A] inline-block px-2.5 py-0.5 rounded-full mt-1">
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
        <div className="bg-[#111936] border border-[#27325A] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27325A] flex justify-between items-center bg-[#151B3D]/70">
            <h2 className="text-base font-bold text-[#F8FAFC] tracking-wide">Up Next</h2>
            <Link to="/student/exams" className="text-sm text-[#8B5CF6] hover:text-[#C084FC] transition-colors flex items-center font-semibold">
              Browse exams <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            {availableExams.length === 0 ? (
              <div className="text-center text-[#94A3B8] py-6 font-medium">You're all caught up! No pending exams.</div>
            ) : (
              <div className="space-y-4">
                {availableExams.slice(0, 3).map((exam) => (
                  <div key={exam.id} className="flex justify-between items-center p-4 border border-[#27325A] bg-[#151B3D] rounded-xl hover:border-[#8B5CF6]/50 transition-all hover:-translate-y-0.5 group">
                    <div>
                      <p className="font-bold text-[#F8FAFC] mb-1 group-hover:text-[#C084FC] transition-colors">{exam.title}</p>
                      <div className="flex items-center text-xs text-[#94A3B8]">
                        <Clock className="w-3.5 h-3.5 mr-1 text-[#8B5CF6]" />
                        {exam.durationMinutes} mins
                      </div>
                    </div>
                    <Link to="/student/exams" className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] transition-all">
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
