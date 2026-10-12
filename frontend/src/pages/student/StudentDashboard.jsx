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

  if (loading) return <div className="text-center p-8 text-[#64748B]">Loading exams...</div>;
  if (error) return <div className="text-red-500 text-center p-8 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">Available Exams</h1>
      </div>
      
      {exams.length === 0 ? (
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-12 text-center text-[#64748B] shadow-card">
          <div className="bg-[#EDE9FE] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <h3 className="text-xl font-bold text-[#111827] mb-2">No Exams Available</h3>
          <p>Check back later or contact your administrator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div key={exam.id} className="bg-white border border-[#E5E7EB] hover:border-[#C4B5FD] rounded-2xl overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-card-hover shadow-card">
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#EDE9FE] text-[#7C3AED] rounded-lg">
                    {exam.subject}
                  </span>
                  <span className="flex items-center text-xs font-medium text-[#64748B] bg-[#F7F8FC] border border-[#E5E7EB] px-2.5 py-1 rounded-md">
                    <Clock className="w-3.5 h-3.5 mr-1.5 text-[#7C3AED]" />
                    {exam.durationMinutes} mins
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#111827] mb-2 tracking-tight group-hover:text-[#7C3AED] transition-colors">{exam.title}</h3>
                <p className="text-sm text-[#64748B] mb-6 line-clamp-2 leading-relaxed">{exam.description}</p>
                
                <div className="space-y-3 text-sm text-[#64748B] font-medium bg-[#F7F8FC] p-4 rounded-xl border border-[#E5E7EB]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#7C3AED]" />
                      Total Marks
                    </div>
                    <span className="text-[#111827] font-bold">{exam.totalMarks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="w-4 h-4 mr-2 text-red-400" />
                      Negative Marks
                    </div>
                    <span className="text-[#111827] font-bold">{exam.negativeMarks}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#F7F8FC] p-5 border-t border-[#E5E7EB]">
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-purple-glow text-sm font-bold text-white bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#6D28D9] hover:to-[#5B21B6] focus:outline-none transition-all hover:-translate-y-0.5"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  START EXAM
                </button>
                <p className="text-[11px] text-center text-[#9CA3AF] mt-3 font-medium flex items-center justify-center">
                  <CheckCircle className="w-3 h-3 mr-1 text-[#7C3AED]" />
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
