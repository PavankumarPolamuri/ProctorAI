import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { practiceExams } from '../../data/practiceExams';
import {
  Clock, ChevronLeft, ChevronRight, Send, HelpCircle,
  CheckCircle, AlertTriangle, Shield, Check, BookOpen, X
} from 'lucide-react';

const PracticeExamAttempt = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const exam = practiceExams.find(e => e.id === examId);

  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState({});
  const [remainingTime, setRemainingTime] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const submittedRef = useRef(false);

  // Timer
  useEffect(() => {
    if (!started || submitted) return;

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!submittedRef.current) {
            submittedRef.current = true;
            setSubmitted(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setRemainingTime(exam.durationMinutes * 60);
    setStarted(true);
  };

  const handleAnswerSelect = (questionId, answer) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const toggleReview = (questionId) => {
    if (submitted) return;
    setMarkedForReview(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleClearResponse = (questionId) => {
    if (submitted) return;
    setAnswers(prev => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    setShowConfirm(false);
  }, []);

  // Navigate to results on submission
  useEffect(() => {
    if (submitted && exam) {
      // Calculate results and navigate
      const results = exam.questions.map(q => ({
        questionId: q.id,
        questionText: q.questionText,
        options: q.options,
        selectedAnswer: answers[q.id] || null,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        isCorrect: answers[q.id] === q.correctAnswer,
        marks: q.marks,
        marksObtained: answers[q.id] === q.correctAnswer ? q.marks : 0
      }));

      const score = results.reduce((sum, r) => sum + r.marksObtained, 0);
      const correctCount = results.filter(r => r.isCorrect).length;
      const wrongCount = results.filter(r => r.selectedAnswer && !r.isCorrect).length;
      const unansweredCount = results.filter(r => !r.selectedAnswer).length;

      // Store results in sessionStorage for the results page
      const resultData = {
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        totalMarks: exam.totalMarks,
        score,
        percentage: Math.round((score / exam.totalMarks) * 100),
        correctCount,
        wrongCount,
        unansweredCount,
        totalQuestions: exam.questions.length,
        questionDetails: results,
        submittedAt: new Date().toISOString()
      };

      sessionStorage.setItem('practiceExamResult', JSON.stringify(resultData));
      navigate('/practice/result', { replace: true });
    }
  }, [submitted, exam, answers, navigate]);

  // Escape key to close confirm dialog
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && showConfirm) setShowConfirm(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showConfirm]);

  if (!exam) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#050816] text-[#CBD5E1]">
        <AlertTriangle className="w-12 h-12 text-[#A855F7] mb-4" />
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">Exam Not Found</h2>
        <p className="text-sm text-[#94A3B8] mb-6">This practice exam does not exist.</p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-[#F8FAFC] rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          Back to Practice Exams
        </button>
      </div>
    );
  }

  // Instructions screen (before start)
  if (!started) {
    return (
      <div className="min-h-screen bg-[#050816] text-[#F8FAFC] font-sans relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-[#7C3AED]/8 rounded-full blur-[140px]"></div>
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-24">
          {/* Back button */}
          <button
            onClick={() => navigate('/practice')}
            className="flex items-center gap-2 text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors mb-8"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Practice Exams</span>
          </button>

          <div className="bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.35)] rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {/* Demo badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#A855F7] text-[10px] font-bold tracking-wider uppercase mb-6">
              <BookOpen className="w-3 h-3" />
              Practice Demo — Not a Real Exam
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{exam.icon}</span>
              <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">{exam.title}</h1>
            </div>
            <p className="text-sm text-[#94A3B8] mb-8 leading-relaxed">{exam.description}</p>

            {/* Exam details */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Duration</p>
                <p className="text-lg font-extrabold text-[#F8FAFC]">{exam.durationMinutes} minutes</p>
              </div>
              <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Questions</p>
                <p className="text-lg font-extrabold text-[#F8FAFC]">{exam.questions.length}</p>
              </div>
              <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Total Marks</p>
                <p className="text-lg font-extrabold text-[#F8FAFC]">{exam.totalMarks}</p>
              </div>
              <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Negative Marks</p>
                <p className="text-lg font-extrabold text-[#F8FAFC]">{exam.negativeMarks}</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-[#F8FAFC] mb-3">Instructions</h3>
              <ul className="space-y-2 text-sm text-[#CBD5E1]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                  Each question has four options with one correct answer.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                  You can navigate between questions freely.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                  Mark questions for review to revisit them later.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                  The exam will auto-submit when the timer reaches zero.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#A855F7] flex-shrink-0 mt-0.5" />
                  This is a practice demo — results are not saved to any account.
                </li>
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full flex items-center justify-center py-3.5 px-6 rounded-xl text-base font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] shadow-[0_0_25px_rgba(124,58,237,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.55)] transition-all hover:-translate-y-0.5"
            >
              Start Practice Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const reviewCount = Object.values(markedForReview).filter(Boolean).length;

  return (
    <div className="flex flex-col h-screen bg-[#050816] text-[#F8FAFC] select-none font-sans">
      {/* Top Bar */}
      <header className="bg-[#0B1026] border-b border-[#27325A] px-4 sm:px-6 py-3 flex justify-between items-center z-10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#A855F7] text-[9px] font-bold tracking-wider uppercase flex-shrink-0">
            <BookOpen className="w-3 h-3" />
            DEMO
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-[#F8FAFC] truncate">{exam.title}</h1>
            <p className="text-[10px] text-[#94A3B8] hidden sm:block">Practice Demo — Not a Real Exam</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <div className={`flex items-center gap-2 text-base sm:text-lg font-mono font-extrabold px-3 py-1.5 rounded-xl border shadow-[0_0_15px_rgba(139,92,246,0.2)] ${
            remainingTime <= 60 ? 'text-red-400 bg-red-500/10 border-red-500/30 animate-pulse' : 'text-[#E879F9] bg-[#151B3D] border-[#8B5CF6]/30'
          }`}>
            <Clock className="w-4 sm:w-5 h-4 sm:h-5" />
            <span>{formatTime(remainingTime)}</span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="px-3 sm:px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] text-xs sm:text-sm font-bold rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.4)] flex items-center transition-all"
          >
            <Send className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Question Navigation */}
        <aside className="w-48 sm:w-56 bg-[#0B1026] border-r border-[#27325A] flex-col hidden md:flex flex-shrink-0">
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-xs font-bold text-[#CBD5E1] uppercase tracking-wider mb-3">Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {exam.questions.map((q, idx) => {
                let btnClass = "w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold border transition-all cursor-pointer ";
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
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#7C3AED]/30 border border-[#8B5CF6] mr-2"></div> Answered ({answeredCount})</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#E879F9]/30 border border-[#E879F9] mr-2"></div> Marked ({reviewCount})</div>
              <div className="flex items-center"><div className="w-3 h-3 rounded-md bg-[#0B1026] border border-[#27325A] mr-2"></div> Unanswered ({exam.questions.length - answeredCount})</div>
            </div>
          </div>
        </aside>

        {/* Main: Question Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {/* Mobile question nav */}
          <div className="flex md:hidden gap-1.5 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {exam.questions.map((q, idx) => {
              let cls = "w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0 border ";
              if (idx === currentQuestionIndex) cls += "ring-2 ring-[#8B5CF6] border-transparent ";
              else cls += "border-[#27325A] ";
              if (markedForReview[q.id]) cls += "bg-[#E879F9]/20 text-[#E879F9]";
              else if (answers[q.id]) cls += "bg-[#7C3AED]/25 text-[#A855F7]";
              else cls += "bg-[#0B1026] text-[#CBD5E1]";
              return (
                <button key={q.id} onClick={() => setCurrentQuestionIndex(idx)} className={cls}>{idx + 1}</button>
              );
            })}
          </div>

          {currentQ && (
            <div className="max-w-3xl mx-auto bg-[#111936] rounded-2xl border border-[#27325A] shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6 border-b border-[#27325A] pb-4">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#F8FAFC]">Question {currentQuestionIndex + 1}</h2>
                <div className="text-xs font-bold text-[#A855F7] bg-[#151B3D] border border-[#27325A] px-3 py-1 rounded-lg">
                  Marks: {currentQ.marks}
                </div>
              </div>

              <div className="text-sm sm:text-base text-[#F8FAFC] mb-8 whitespace-pre-wrap leading-relaxed font-medium">
                {currentQ.questionText}
              </div>

              <div className="space-y-3">
                {Object.entries(currentQ.options).map(([key, value]) => (
                  <div
                    key={key}
                    onClick={() => handleAnswerSelect(currentQ.id, key)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center
                      ${answers[currentQ.id] === key
                        ? 'border-[#8B5CF6] bg-[#7C3AED]/20 shadow-[0_0_15px_rgba(139,92,246,0.2)]'
                        : 'border-[#27325A] bg-[#151B3D] hover:bg-[#182046]'}`}
                  >
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center mr-4 transition-all flex-shrink-0
                      ${answers[currentQ.id] === key ? 'border-[#8B5CF6] bg-[#8B5CF6] text-black font-bold' : 'border-[#27325A]'}`}>
                      {answers[currentQ.id] === key && <CheckCircle className="w-4 h-4 text-[#050816]" />}
                    </div>
                    <span className="font-bold text-[#A855F7] mr-3">{key}.</span>
                    <span className="text-[#F8FAFC] font-medium text-sm">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#27325A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => toggleReview(currentQ.id)}
                    className={`px-3 py-2 text-xs font-bold rounded-xl border flex items-center transition-all ${
                      markedForReview[currentQ.id]
                        ? 'bg-[#E879F9]/20 text-[#E879F9] border-[#E879F9]/40'
                        : 'bg-[#151B3D] text-[#CBD5E1] border-[#27325A] hover:bg-[#182046]'
                    }`}
                  >
                    <HelpCircle className="w-4 h-4 mr-1.5" />
                    {markedForReview[currentQ.id] ? 'Unmark' : 'Mark for Review'}
                  </button>
                  <button
                    onClick={() => handleClearResponse(currentQ.id)}
                    className="px-3 py-2 text-xs font-bold rounded-xl bg-[#151B3D] text-[#CBD5E1] border border-[#27325A] hover:bg-[#182046] transition-all"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-3 py-2 bg-[#151B3D] border border-[#27325A] rounded-xl text-[#CBD5E1] hover:bg-[#182046] disabled:opacity-40 text-xs font-bold flex items-center transition-all"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </button>
                  {currentQuestionIndex < exam.questions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-transparent rounded-xl text-[#F8FAFC] hover:from-[#8B5CF6] hover:to-[#C084FC] text-xs font-bold flex items-center shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    >
                      Save & Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConfirm(true)}
                      className="px-3 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] border border-transparent rounded-xl text-[#F8FAFC] hover:from-[#8B5CF6] hover:to-[#C084FC] text-xs font-bold flex items-center shadow-[0_0_15px_rgba(124,58,237,0.3)] transition-all"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg"
          onClick={(e) => { if (e.target === e.currentTarget) setShowConfirm(false); }}
        >
          <div className="bg-[#0B1026] border border-[rgba(139,92,246,0.45)] rounded-2xl max-w-md w-full p-6 shadow-[0_0_60px_rgba(124,58,237,0.35)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-[#F8FAFC]">Submit Practice Exam?</h3>
              <button onClick={() => setShowConfirm(false)} className="text-[#94A3B8] hover:text-white p-1 rounded-lg hover:bg-[#151B3D] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-[#151B3D] p-3 rounded-xl border border-[#27325A] text-center">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Answered</p>
                <p className="text-xl font-extrabold text-emerald-400">{answeredCount}</p>
              </div>
              <div className="bg-[#151B3D] p-3 rounded-xl border border-[#27325A] text-center">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Review</p>
                <p className="text-xl font-extrabold text-[#E879F9]">{reviewCount}</p>
              </div>
              <div className="bg-[#151B3D] p-3 rounded-xl border border-[#27325A] text-center">
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Skipped</p>
                <p className="text-xl font-extrabold text-[#CBD5E1]">{exam.questions.length - answeredCount}</p>
              </div>
            </div>

            {exam.questions.length - answeredCount > 0 && (
              <div className="bg-[#241715]/60 border border-[#D97706]/30 rounded-xl p-3 mb-5 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                <p className="text-xs text-[#CBD5E1]">
                  You have <span className="font-bold text-[#F59E0B]">{exam.questions.length - answeredCount}</span> unanswered question{exam.questions.length - answeredCount > 1 ? 's' : ''}. Are you sure you want to submit?
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 text-sm font-bold text-[#CBD5E1] bg-[#151B3D] border border-[#27325A] rounded-xl hover:bg-[#182046] transition-all"
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 py-2.5 text-sm font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:from-[#8B5CF6] hover:to-[#C084FC] transition-all"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeExamAttempt;
