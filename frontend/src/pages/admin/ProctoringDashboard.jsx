import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import websocketService from '../../services/websocketService';
import api from '../../services/api';
import { ShieldAlert, Users, Video, Activity, AlertTriangle, ArrowLeft } from 'lucide-react';

const ProctoringDashboard = () => {
  const { examId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeStudents, setActiveStudents] = useState([]);
  const [malpracticeEvents, setMalpracticeEvents] = useState([]);
  const [videoFeeds, setVideoFeeds] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const response = await api.get(`/admin/monitoring/active`);
        const examAttempts = response.data.filter(attempt => attempt.examId === parseInt(examId));
        setActiveStudents(examAttempts);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load attempts", err);
        setLoading(false);
      }
    };

    fetchAttempts();

    const connectWS = () => {
      websocketService.connect(
        () => {
          websocketService.subscribe('/topic/exam-monitoring', (event) => {
            if (event.examId && event.examId !== parseInt(examId)) return;
            
            if (event.eventType === 'EXAM_SUBMITTED') {
              setActiveStudents(prev => prev.filter(student => student.id !== event.attemptId));
              setVideoFeeds(prev => {
                const newFeeds = { ...prev };
                delete newFeeds[event.attemptId];
                return newFeeds;
              });
              return;
            }
            
            setMalpracticeEvents(prev => [event, ...prev].slice(0, 50));
            
            setActiveStudents(prev => prev.map(student => {
              if (student.id === event.attemptId) {
                return {
                  ...student,
                  violationCount: event.currentViolationCount,
                  riskScore: event.currentRiskScore,
                  riskLevel: event.currentRiskLevel
                };
              }
              return student;
            }));
          });

          websocketService.subscribe('/topic/exam-video', (frameDto) => {
             setVideoFeeds(prev => ({
                ...prev,
                [frameDto.attemptId]: frameDto
             }));
          });
        },
        (err) => {
          console.error("WebSocket connection failed", err);
        }
      );
    };

    connectWS();

    return () => {
      websocketService.unsubscribe('/topic/exam-monitoring');
      websocketService.unsubscribe('/topic/exam-video');
      websocketService.disconnect();
    };
  }, [examId, user.token]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'bg-red-500/15 text-red-400 border-red-500/30';
      case 'MEDIUM': return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      default: return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getEventIcon = (type) => {
    switch (type) {
      case 'TAB_SWITCH': return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'EXIT_FULLSCREEN': return <Activity className="w-4 h-4 text-[#A855F7]" />;
      case 'CAMERA_DISABLED': return <Video className="w-4 h-4 text-red-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-[#8B5CF6]" />;
    }
  };

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Connecting to Live Proctoring Server...</div>;

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={() => navigate('/admin/dashboard')} className="mr-4 text-[#94A3B8] hover:text-[#F8FAFC] p-2 bg-[#111936] rounded-xl border border-[#27325A] transition-colors">
            <ArrowLeft className="w-5 h-5 text-[#8B5CF6]" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Live Proctoring Center</h1>
            <p className="text-xs text-[#94A3B8] flex items-center mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
              WebSocket Feed Active — Exam ID: {examId}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden min-h-[500px]">
        {/* Active Students Grid */}
        <div className="flex-1 bg-[#111936] border border-[#27325A] rounded-2xl flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="px-6 py-4 border-b border-[#27325A] flex justify-between items-center bg-[#151B3D]">
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center">
              <Users className="w-5 h-5 mr-2 text-[#8B5CF6]" />
              Active Candidates ({activeStudents.length})
            </h2>
          </div>
          <div className="p-6 overflow-y-auto flex-1 bg-[#0B1026]">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeStudents.map(student => {
                const feed = videoFeeds[student.id];
                return (
                <div key={student.id} className={`bg-[#111936] border p-4 rounded-2xl ${student.riskLevel === 'HIGH' ? 'border-red-500/50 ring-1 ring-red-500/50' : 'border-[#27325A]'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#F8FAFC]">{student.studentName}</h3>
                      <p className="text-xs text-[#94A3B8]">{student.studentEmail}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full border ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel} RISK
                    </span>
                  </div>
                  
                  <div className="aspect-video bg-[#050816] rounded-xl mb-4 relative overflow-hidden flex items-center justify-center border border-[#27325A]">
                    {!feed && (
                      <div className="text-[#94A3B8] text-xs flex flex-col items-center">
                        <Video className="w-8 h-8 mb-2 opacity-30 animate-pulse text-[#8B5CF6]" />
                        Waiting for Student...
                      </div>
                    )}
                    {feed && feed.status === 'DISCONNECTED' && (
                      <div className="text-[#94A3B8] text-xs flex flex-col items-center">
                        <Video className="w-8 h-8 mb-2 opacity-50" />
                        Webcam Disconnected
                      </div>
                    )}
                    {feed && feed.status === 'DENIED' && (
                      <div className="text-red-400 text-xs flex flex-col items-center">
                        <AlertTriangle className="w-8 h-8 mb-2 opacity-80" />
                        Camera Access Denied
                      </div>
                    )}
                    {feed && feed.status === 'STREAMING' && feed.frameData && (
                      <img src={feed.frameData} alt="Live feed" className="w-full h-full object-cover transform -scale-x-100" />
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#94A3B8] font-medium">Violations:</span>
                    <span className={`font-bold ${student.violationCount > 0 ? 'text-red-400' : 'text-[#F8FAFC]'}`}>
                      {student.violationCount} / {student.maxViolations}
                    </span>
                  </div>
                </div>
                );
              })}
              
              {activeStudents.length === 0 && (
                <div className="col-span-full py-12 text-center text-[#94A3B8] font-medium">
                  No students are currently taking this exam.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Alerts Panel */}
        <div className="w-96 bg-[#111936] border border-[#27325A] rounded-2xl flex flex-col overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
          <div className="px-6 py-4 border-b border-[#27325A] bg-[#151B3D]">
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center">
              <ShieldAlert className="w-5 h-5 mr-2 text-[#A855F7]" />
              Live Security Alerts
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B1026]">
            {malpracticeEvents.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#94A3B8]">
                Listening for proctoring events...<br/>No malpractice detected yet.
              </div>
            ) : (
              malpracticeEvents.map((event, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border text-xs ${event.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/25' : event.severity === 'MEDIUM' ? 'bg-amber-500/10 border-amber-500/25' : 'bg-[#151B3D] border-[#27325A]'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-[#F8FAFC] flex items-center">
                      {getEventIcon(event.eventType)}
                      <span className="ml-1.5">{event.studentName}</span>
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-[#CBD5E1] mt-1 text-xs leading-relaxed">{event.description}</p>
                  <div className="mt-2 flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#A855F7] bg-[#050816] px-2 py-0.5 rounded-lg border border-[#27325A]">
                      {event.eventType}
                    </span>
                    <span className={`font-bold ${event.severity === 'HIGH' ? 'text-red-400' : event.severity === 'MEDIUM' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      Severity: {event.severity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProctoringDashboard;
