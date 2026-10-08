import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Shield, Clock, Activity, Video } from 'lucide-react';

const GlobalMonitoring = () => {
  const [activeExams, setActiveExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchActiveExams();
  }, []);

  const fetchActiveExams = async () => {
    try {
      const attemptsRes = await api.get('/admin/monitoring/active');
      const examsRes = await api.get('/admin/exams');
      
      const attempts = attemptsRes.data;
      const exams = examsRes.data;

      const examMap = new Map();
      const now = new Date();
      
      exams.forEach(ex => {
        if (ex.published) {
          const start = ex.startTime ? new Date(ex.startTime) : null;
          const end = ex.endTime ? new Date(ex.endTime) : null;
          
          if ((!start || now >= start) && (!end || now <= end)) {
             examMap.set(ex.id, {
               ...ex,
               activeStudentsCount: 0,
               highRiskCount: 0,
               mediumRiskCount: 0
             });
          }
        }
      });

      attempts.forEach(attempt => {
        if (examMap.has(attempt.examId)) {
          const examData = examMap.get(attempt.examId);
          examData.activeStudentsCount += 1;
          
          if (attempt.riskLevel === 'HIGH') examData.highRiskCount += 1;
          if (attempt.riskLevel === 'MEDIUM') examData.mediumRiskCount += 1;
        }
      });

      setActiveExams(Array.from(examMap.values()));
      setLoading(false);
    } catch (err) {
      console.error("Failed to load active exams", err);
      setError('Failed to load active exams');
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Loading Global Monitoring...</div>;
  if (error) return <div className="p-8 text-center text-red-400 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] flex items-center tracking-tight">
            <Activity className="w-6 h-6 mr-2.5 text-[#8B5CF6]" />
            Global Live Monitoring
          </h1>
          <p className="text-sm text-[#94A3B8]">Select an active exam to launch the real-time proctoring feed.</p>
        </div>
        <div className="flex space-x-4">
          <div className="bg-[#7C3AED]/20 px-4 py-2 rounded-xl border border-[#8B5CF6]/30 flex items-center">
             <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping mr-2"></div>
             <span className="text-xs font-bold text-[#A855F7]">{activeExams.length} Active Exams</span>
          </div>
          <button onClick={fetchActiveExams} className="px-4 py-2 bg-[#151B3D] border border-[#27325A] rounded-xl text-xs font-bold text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1f2858] transition-all">
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeExams.map(exam => (
          <div key={exam.id} className="bg-[#111936] border border-[#27325A] hover:border-[#8B5CF6]/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
            <div className={`p-4 border-b ${exam.highRiskCount > 0 ? 'bg-red-500/15 border-red-500/30' : 'bg-[#151B3D] border-[#27325A]'}`}>
               <div className="flex justify-between items-start">
                 <h2 className="text-lg font-bold text-[#F8FAFC] leading-tight">{exam.title}</h2>
                 <span className="bg-[#0B1026] px-2.5 py-1 text-xs font-bold rounded-lg border border-[#27325A] text-[#CBD5E1]">ID: {exam.id}</span>
               </div>
               <div className="text-xs text-[#A855F7] font-semibold mt-1">
                 {exam.subject}
               </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-center text-xs text-[#94A3B8] mb-4">
                <Clock className="w-4 h-4 mr-2 text-[#8B5CF6]" />
                Duration: {exam.durationMinutes} mins
              </div>

              <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                 <div className="bg-[#151B3D] rounded-xl p-2.5 border border-[#27325A]">
                   <div className="text-xl font-bold text-[#F8FAFC]">{exam.activeStudentsCount}</div>
                   <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wide mt-1">Active</div>
                 </div>
                 <div className={`rounded-xl p-2.5 border ${exam.mediumRiskCount > 0 ? 'bg-amber-500/15 border-amber-500/30' : 'bg-[#151B3D] border-[#27325A]'}`}>
                   <div className={`text-xl font-bold ${exam.mediumRiskCount > 0 ? 'text-amber-400' : 'text-[#F8FAFC]'}`}>{exam.mediumRiskCount}</div>
                   <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wide mt-1">Medium Risk</div>
                 </div>
                 <div className={`rounded-xl p-2.5 border ${exam.highRiskCount > 0 ? 'bg-red-500/15 border-red-500/30' : 'bg-[#151B3D] border-[#27325A]'}`}>
                   <div className={`text-xl font-bold ${exam.highRiskCount > 0 ? 'text-red-400' : 'text-[#F8FAFC]'}`}>{exam.highRiskCount}</div>
                   <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wide mt-1">High Risk</div>
                 </div>
              </div>

              <button 
                onClick={() => navigate(`/admin/proctoring/${exam.id}`)}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
              >
                <Video className="w-4 h-4 mr-2" />
                Launch Live Proctoring
              </button>
            </div>
          </div>
        ))}

        {activeExams.length === 0 && (
          <div className="col-span-full py-16 bg-[#111936] border border-[#27325A] rounded-2xl text-center flex flex-col items-center">
            <Shield className="w-12 h-12 text-[#8B5CF6] mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[#F8FAFC]">No Active Exams</h3>
            <p className="text-[#94A3B8] mt-1 text-sm max-w-sm">There are currently no published exams within their active time window.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalMonitoring;
