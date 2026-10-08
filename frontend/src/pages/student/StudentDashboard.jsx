import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { FileText, Clock, PlayCircle, CheckCircle, XCircle, BookOpen } from 'lucide-react';

const StudentDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/student/exams');
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch available exams');
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      const response = await api.post(`/student/exams/${examId}/start`);
      navigate(`/exam/${response.data.id}/attempt`);
    } catch (err) {
      alert(err.response?.data?.message || err.response?.data?.error || 'Failed to start exam. You may have already attempted it.');
    }
  };

  if (loading) return <div className="text-center p-8 text-[#94A3B8]">Loading exams...</div>;
  if (error) return <div className="text-red-400 text-center p-8 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Available Exams</h1>
      </div>
      
      {exams.length === 0 ? (
        <div className="bg-[#111936] border border-[#27325A] rounded-2xl p-12 text-center text-[#94A3B8]">
          <div className="bg-[#151B3D] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#27325A]">
            <BookOpen className="w-8 h-8 text-[#A855F7]" />
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC] mb-2">No Exams Available</h3>
          <p>Check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-[#111936] border border-[#27325A] hover:border-[#8B5CF6]/50 rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-[0_10px_30px_rgba(124,58,237,0.2)]">
              <div className="p-6 flex-1 relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#7C3AED]/20 text-[#A855F7] rounded-lg border border-[#8B5CF6]/30 shadow-sm">
                      {exam.subject}
                    </span>
                    <span className="flex items-center text-xs font-medium text-[#CBD5E1] bg-[#151B3D] border border-[#27325A] px-2.5 py-1 rounded-md">
                      <Clock className="w-3.5 h-3.5 mr-1.5 text-[#8B5CF6]" />
                      {exam.durationMinutes} mins
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2 tracking-tight group-hover:text-[#C084FC] transition-colors">{exam.title}</h3>
                  <p className="text-sm text-[#94A3B8] mb-6 line-clamp-2 leading-relaxed">{exam.description}</p>
                  
                  <div className="space-y-3 text-sm text-[#CBD5E1] font-medium bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#CBD5E1]">
                        <FileText className="w-4 h-4 mr-2 text-[#A855F7]" />
                        Total Marks
                      </div>
                      <span className="text-[#F8FAFC] font-bold">{exam.totalMarks}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-[#CBD5E1]">
                        <XCircle className="w-4 h-4 mr-2 text-red-400" />
                        Negative Marks
                      </div>
                      <span className="text-[#F8FAFC] font-bold">{exam.negativeMarks}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#151B3D]/80 p-5 border-t border-[#27325A] relative z-10">
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] text-sm font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] focus:outline-none transition-all hover:-translate-y-0.5"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  START EXAM
                </button>
                <p className="text-[11px] text-center text-[#94A3B8] mt-3 font-medium flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#A855F7]" />
                  Secure proctoring will activate
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
