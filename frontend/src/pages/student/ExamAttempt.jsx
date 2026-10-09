import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import websocketService from '../../services/websocketService';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Send, HelpCircle } from 'lucide-react';

const ExamAttempt = () => {
  const { attemptId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = useRef(null);

  // Initialize Exam
  useEffect(() => {
    let timerInterval;
    let isMounted = true;
    
    const initExam = async () => {
      try {
        const attemptRes = await api.get(`/student/attempts/${attemptId}`);
        if (!isMounted) return;

        const attemptData = attemptRes.data;
        
        if (attemptData.status !== 'IN_PROGRESS') {
          navigate('/student/dashboard');
          return;
        }

        setAttempt(attemptData);
        setRemainingTime(attemptData.remainingTimeSeconds);
        setViolationCount(attemptData.violationCount || 0);

        const questionsRes = await api.get(`/student/attempts/${attemptId}/questions`);
        if (!isMounted) return;

        setQuestions(questionsRes.data);
        
        const initialAnswers = {};
        const initialReview = {};
        questionsRes.data.forEach((q) => {
          if (q.selectedAnswer) initialAnswers[q.id] = q.selectedAnswer;
          if (q.markedForReview) initialReview[q.id] = true;
        });
        setAnswers(initialAnswers);
        setMarkedForReview(initialReview);

        websocketService.connect(() => {
          websocketService.subscribe(`/topic/exam/${attemptData.id}`, (event) => {
            if (event.currentViolationCount !== undefined) {
              setViolationCount(event.currentViolationCount);
            }
            if (event.currentViolationCount >= attemptData.maxViolations) {
              stopCamera();
              alert('Exam Auto-Submitted: Maximum security violation limit reached');
              if (document.fullscreenElement) {
                document.exitFullscreen();
              }
              navigate('/student/results');
            }
          });
        });

        timerInterval = setInterval(() => {
          setRemainingTime((prev) => {
            if (prev <= 1) {
              clearInterval(timerInterval);
              handleAutoSubmit('Time Expired');
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        setLoading(false);
      } catch (err) {
        if (isMounted) {
          setError('Failed to load exam data. Please contact support.');
          setLoading(false);
        }
      }
    };

    initExam();

    return () => {
      isMounted = false;
      if (timerInterval) clearInterval(timerInterval);
      websocketService.disconnect();
      stopCamera();
    };
  }, [attemptId, navigate, user.token]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      reportMalpractice('CAMERA_DISABLED', 'HIGH', 'Student refused or failed to provide camera access');
      if (attempt) {
        websocketService.sendVideoFrame({
          examId: attempt.examId,
          attemptId: attempt.id,
          studentName: attempt.studentName,
          studentEmail: attempt.studentEmail,
          frameData: null,
          status: 'DENIED',
          timestamp: new Date().toISOString()
        });
      }
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (attempt && websocketService.connected) {
       websocketService.sendVideoFrame({
          examId: attempt.examId,
          attemptId: attempt.id,
          studentName: attempt.studentName,
          studentEmail: attempt.studentEmail,
          frameData: null,
          status: 'DISCONNECTED',
          timestamp: new Date().toISOString()
        });
    }
  };

  useEffect(() => {
    if (!loading && !error && attempt) {
      startCamera();
    }
  }, [loading, error, attempt]);

  useEffect(() => {
    if (cameraStream && videoRef.current) {
      if (videoRef.current.srcObject !== cameraStream) {
        videoRef.current.srcObject = cameraStream;
      }
    }
  }, [cameraStream, isFullscreen]);

  useEffect(() => {
    let frameInterval;
    if (cameraStream && videoRef.current && attempt) {
      const canvas = document.createElement('canvas');
      canvas.width = 320;
      canvas.height = 240;
      const ctx = canvas.getContext('2d');

      frameInterval = setInterval(() => {
        if (videoRef.current && videoRef.current.readyState >= 2) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const frameData = canvas.toDataURL('image/jpeg', 0.4);
          websocketService.sendVideoFrame({
            examId: attempt.examId,
            attemptId: attempt.id,
            studentName: attempt.studentName,
            studentEmail: attempt.studentEmail,
            frameData: frameData,
            status: 'STREAMING',
            timestamp: new Date().toISOString()
          });
        }
      }, 200);
    }

    return () => {
      if (frameInterval) clearInterval(frameInterval);
    };
  }, [cameraStream, attempt, attemptId]);

  const reportMalpractice = useCallback((type, severity, description) => {
    if (!attempt) return;
    
    api.post('/api/monitoring/events', {
      attemptId: attempt.id,
      eventType: type,
      severity: severity,
      description: description,
      timestamp: new Date().toISOString()
    }).catch(console.error);

    if (websocketService.connected) {
      websocketService.sendMalpracticeEvent({
        attemptId: attempt.id,
        examId: attempt.examId,
        eventType: type,
        severity: severity,
        description: description,
        timestamp: new Date().toISOString()
      });
    }
  }, [attempt]);

  useEffect(() => {
    if (loading || error) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        reportMalpractice('TAB_SWITCH', 'HIGH', 'Student switched tabs or minimized the browser');
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        reportMalpractice('FULLSCREEN_EXIT', 'MEDIUM', 'Student exited fullscreen mode');
      } else {
        setIsFullscreen(true);
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleCopy = (e) => {
      e.preventDefault();
      reportMalpractice('COPY_ATTEMPT', 'LOW', 'Student attempted to copy content');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
    };
  }, [loading, error, reportMalpractice]);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        if (violationCount > 0) {
          setShowViolationWarning(true);
          setTimeout(() => setShowViolationWarning(false), 2500);
        }
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  const handleAnswerSelect = async (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: answer,
        markedForReview: markedForReview[questionId] || false
      });
    } catch (err) {
      console.error('Failed to save answer', err);
    }
  };

  const toggleReview = async (questionId) => {
    const newVal = !markedForReview[questionId];
    setMarkedForReview(prev => ({ ...prev, [questionId]: newVal }));
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: answers[questionId] || null,
        markedForReview: newVal
      });
    } catch (err) {
      console.error('Failed to save review status', err);
    }
  };

  const handleClearResponse = async (questionId) => {
    const newAnswers = { ...answers };
    delete newAnswers[questionId];
    setAnswers(newAnswers);
    try {
      await api.post(`/student/attempts/${attemptId}/answer`, {
        questionId: questionId,
        selectedAnswer: null,
        markedForReview: markedForReview[questionId] || false
      });
    } catch (err) {
      console.error('Failed to clear answer', err);
    }
  };

  const handleSubmitExam = async () => {
    if (window.confirm('Are you sure you want to submit the exam? Once submitted, you cannot change your answers.')) {
      try {
        await api.post(`/student/attempts/${attemptId}/submit`);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        stopCamera();
        navigate('/student/results');
      } catch (err) {
        alert('Failed to submit exam. Please try again.');
      }
    }
  };

  const handleAutoSubmit = async (reason) => {
    try {
      await api.post(`/student/attempts/${attemptId}/submit`, { reason });
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      stopCamera();
      alert(`Exam auto-submitted: ${reason}`);
      navigate('/student/results');
    } catch (err) {
      console.error('Auto submit failed', err);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#050816] text-[#CBD5E1]">Loading Exam Environment...</div>;
  if (error) return <div className="flex h-screen items-center justify-center bg-[#050816] text-red-400 font-medium">{error}</div>;

  if (!isFullscreen) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#050816] p-6 text-center">
        <AlertTriangle className="w-16 h-16 text-[#A855F7] mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-[#F8FAFC] mb-2">Fullscreen Mode Required</h2>
        <p className="text-[#94A3B8] mb-6 max-w-md">
          This exam requires full-screen mode to enforce AI proctoring and security integrity. Click below to enter full-screen.
        </p>
        <button
          onClick={requestFullscreen}
          className="px-6 py-3.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] rounded-xl font-bold shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all"
        >
          Enter Fullscreen & Resume Exam
        </button>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ display: 'none' }}
        />
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col h-screen bg-[#050816] text-[#F8FAFC] select-none">
      {/* Top Bar */}
      <header className="bg-[#0B1026] border-b border-[#27325A] px-6 py-3 flex justify-between items-center z-10">
        <div>
          <h1 className="text-lg font-bold text-[#F8FAFC]">{attempt?.examTitle}</h1>
          <p className="text-xs text-[#94A3B8]">{attempt?.studentName} ({attempt?.studentEmail})</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-lg font-mono font-extrabold text-[#E879F9] bg-[#151B3D] px-3.5 py-1.5 rounded-xl border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <Clock className="w-5 h-5 text-[#8B5CF6]" />
            <span>{formatTime(remainingTime)}</span>
          </div>
          <button
            onClick={handleSubmitExam}
            className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            Submit Exam
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Camera & Navigation Grid */}
        <aside className="w-64 bg-[#0B1026] border-r border-[#27325A] flex flex-col">
          <div className="p-4 border-b border-[#27325A]">
            <div className="bg-[#050816] w-full aspect-video rounded-xl overflow-hidden flex items-center justify-center relative border border-[#27325A]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover transform -scale-x-100" 
              />
              {!cameraStream && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-[#050816]">
                  <AlertTriangle className="w-6 h-6 mb-1 text-red-400" />
                  <span className="text-xs text-[#94A3B8]">Camera Required</span>
                </div>
              )}
            </div>
            <div className="mt-2 text-[11px] text-center text-[#A855F7] font-semibold flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-ping"></span>
              AI Proctoring Active
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-3">Questions Overview</h3>
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, idx) => {
                let btnClass = "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold border transition-all cursor-pointer ";
                
                if (idx === currentQuestionIndex) {
                  btnClass += "ring-2 ring-[#8B5CF6] border-transparent ";
                } else {
                  btnClass += "border-[#27325A] hover:bg-[#151B3D] ";
                }

                if (markedForReview[q.id]) {
                  btnClass += "bg-[#E879F9]/20 text-[#E879F9] border-[#E879F9]/40";
                } else if (answers[q.id]) {
                  btnClass += "bg-[#7C3AED]/25 text-[#A855F7] border-[#8B5CF6]/50";
                } else {
                  btnClass += "bg-[#0B1026] text-[#CBD5E1]";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={btnClass}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-6 space-y-2 text-xs text-[#94A3B8]">
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#7C3AED]/30 border border-[#8B5CF6] mr-2"></div> Answered</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#E879F9]/30 border border-[#E879F9] mr-2"></div> Marked for Review</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#0B1026] border border-[#27325A] mr-2"></div> Not Answered</div>
            </div>
          </div>
        </aside>

        {/* Main Content: Question */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          {currentQ && (
            <div className="max-w-4xl mx-auto bg-[#111936] rounded-2xl border border-[#27325A] shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8">
              <div className="flex justify-between items-center mb-6 border-b border-[#27325A] pb-4">
                <h2 className="text-xl font-extrabold text-[#F8FAFC]">Question {currentQuestionIndex + 1}</h2>
                <div className="text-xs font-bold text-[#A855F7] bg-[#151B3D] border border-[#27325A] px-3 py-1 rounded-lg">Marks: {currentQ.marks}</div>
              </div>
              
              <div className="text-base md:text-lg text-[#F8FAFC] mb-8 whitespace-pre-wrap leading-relaxed font-medium">
                {currentQ.questionText}
              </div>

              <div className="space-y-3.5">
                {Object.entries(currentQ.options)
                  .filter(([key, value]) => value !== null && value.trim() !== '')
                  .map(([key, value]) => (
                  <div 
                    key={key}
                    onClick={() => handleAnswerSelect(currentQ.id, key)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center
                      ${answers[currentQ.id] === key 
                        ? 'border-[#8B5CF6] bg-[#7C3AED]/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]' 
                        : 'border-[#27325A] bg-[#151B3D] hover:bg-[#182046]'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-4 transition-all
                      ${answers[currentQ.id] === key ? 'border-[#8B5CF6] bg-[#8B5CF6] text-black font-bold' : 'border-[#27325A]'}`}>
                      {answers[currentQ.id] === key && <CheckCircle className="w-4 h-4 text-[#050816]" />}
                    </div>
                    <span className="font-bold text-[#A855F7] mr-3">{key}.</span>
                    <span className="text-[#F8FAFC] font-medium">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#27325A] flex justify-between items-center flex-wrap gap-4">
                <div className="space-x-3">
                  <button
                    onClick={() => toggleReview(currentQ.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border ${
                      markedForReview[currentQ.id] 
                        ? 'bg-[#E879F9]/20 text-[#E879F9] border-[#E879F9]/40' 
                        : 'bg-[#151B3D] text-[#CBD5E1] border-[#27325A] hover:bg-[#182046]'
                    } flex items-center inline-flex transition-all`}
                  >
                    <HelpCircle className="w-4 h-4 mr-1.5" />
                    {markedForReview[currentQ.id] ? 'Unmark Review' : 'Mark for Review'}
                  </button>
                  <button
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[#151B3D] text-[#CBD5E1] border border-[#27325A] hover:bg-[#182046] transition-all"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="space-x-3 flex">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-4 py-2 bg-[#151B3D] border border-[#27325A] rounded-xl text-[#CBD5E1] hover:bg-[#182046] disabled:opacity-40 text-xs font-bold flex items-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-transparent rounded-xl text-[#F8FAFC] hover:from-[#8B5CF6] hover:to-[#C084FC] disabled:opacity-40 text-xs font-bold flex items-center shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {showViolationWarning && (
        <div className="fixed bottom-6 right-6 bg-[#0B1026] border border-red-500/50 rounded-xl shadow-2xl p-4 flex items-center z-50 animate-bounce max-w-sm">
          <AlertTriangle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" />
          <div className="text-xs text-[#CBD5E1] leading-snug">
            <span className="text-red-400 font-bold">Warning:</span> Violation recorded. Remaining attempts: {violationCount}/{attempt?.maxViolations}.
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamAttempt;
