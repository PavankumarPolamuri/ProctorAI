import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, CheckCircle, XCircle, ChevronDown, ChevronUp,
  RotateCcw, ArrowLeft, Shield, Check, BookOpen, Trophy,
  Target, HelpCircle
} from 'lucide-react';

const PracticeExamResult = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('practiceExamResult');
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#050816] text-[#CBD5E1] font-sans">
        <HelpCircle className="w-12 h-12 text-[#A855F7] mb-4" />
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-2">No Results Found</h2>
        <p className="text-sm text-[#94A3B8] mb-6">Please take a practice exam first.</p>
        <button
          onClick={() => navigate('/practice')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-[#F8FAFC] rounded-xl font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
        >
          Go to Practice Exams
        </button>
      </div>
    );
  }

  const isPassed = result.percentage >= 50;

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] font-sans relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#A855F7]/6 rounded-full blur-[130px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-md border-b border-[#27325A]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9">
              <Shield className="w-7 h-7 text-[#8B5CF6] absolute" fill="currentColor" />
              <Check className="w-3.5 h-3.5 text-[#050816] absolute mt-0.5" strokeWidth={4} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight text-[#F8FAFC]">Proctor</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-[#7C3AED]/15 text-[#A855F7] border border-[#8B5CF6]/30 ml-1">AI</span>
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#A855F7] text-[9px] font-bold tracking-wider uppercase">
            <BookOpen className="w-3 h-3" />
            Practice Result
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Result Hero */}
        <div className="bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.35)] rounded-2xl p-6 sm:p-8 mb-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#A855F7] text-[10px] font-bold tracking-wider uppercase mb-6">
            <BookOpen className="w-3 h-3" />
            Practice Demo — Not a Real Exam
          </div>

          <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            isPassed
              ? 'bg-emerald-500/15 border-2 border-emerald-500/40'
              : 'bg-red-500/15 border-2 border-red-500/40'
          }`}>
            {isPassed
              ? <Trophy className="w-10 h-10 text-emerald-400" />
              : <Target className="w-10 h-10 text-red-400" />
            }
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mb-1">
            {isPassed ? 'Well Done!' : 'Keep Practicing!'}
          </h1>
          <p className="text-sm text-[#94A3B8] mb-8">{result.examTitle}</p>

          {/* Score Circle */}
          <div className="relative w-36 h-36 mx-auto mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="#27325A" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={isPassed ? '#10B981' : '#EF4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(result.percentage / 100) * 314} 314`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${isPassed ? 'text-emerald-400' : 'text-red-400'}`}>
                {result.percentage}%
              </span>
              <span className="text-[10px] text-[#94A3B8] font-semibold uppercase tracking-wider">Score</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
            <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Score</p>
              <p className="text-xl font-extrabold text-[#F8FAFC]">{result.score}<span className="text-sm text-[#94A3B8] font-bold">/{result.totalMarks}</span></p>
            </div>
            <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Correct</p>
              <p className="text-xl font-extrabold text-emerald-400 flex items-center justify-center gap-1">
                <CheckCircle className="w-4 h-4" />{result.correctCount}
              </p>
            </div>
            <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Incorrect</p>
              <p className="text-xl font-extrabold text-red-400 flex items-center justify-center gap-1">
                <XCircle className="w-4 h-4" />{result.wrongCount}
              </p>
            </div>
            <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
              <p className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Unanswered</p>
              <p className="text-xl font-extrabold text-[#CBD5E1]">{result.unansweredCount}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <button
            onClick={() => {
              sessionStorage.removeItem('practiceExamResult');
              navigate(`/practice/${result.examId}`, { replace: true });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Retake Exam
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('practiceExamResult');
              navigate('/practice', { replace: true });
            }}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-sm font-bold text-[#C084FC] bg-transparent border border-[rgba(139,92,246,0.45)] hover:border-[#8B5CF6] hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Practice Exams
          </button>
        </div>

        {/* Question Review */}
        <div className="bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.25)] rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-[#27325A] bg-[#151B3D]/70 flex items-center justify-between">
            <h2 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#A855F7]" />
              Answers & Explanations
            </h2>
            <button
              onClick={() => setShowAllQuestions(!showAllQuestions)}
              className="text-xs font-semibold text-[#C084FC] hover:text-[#E879F9] transition-colors"
            >
              {showAllQuestions ? 'Collapse All' : 'Expand All'}
            </button>
          </div>

          <div className="divide-y divide-[#27325A]">
            {result.questionDetails.map((q, idx) => {
              const isOpen = showAllQuestions || expandedQuestion === q.questionId;
              return (
                <div key={q.questionId}>
                  <button
                    onClick={() => setExpandedQuestion(isOpen && !showAllQuestions ? null : q.questionId)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#151B3D]/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${
                        q.isCorrect
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                          : q.selectedAnswer
                            ? 'bg-red-500/15 border-red-500/30 text-red-400'
                            : 'bg-[#151B3D] border-[#27325A] text-[#94A3B8]'
                      }`}>
                        {q.isCorrect
                          ? <CheckCircle className="w-4 h-4" />
                          : q.selectedAnswer
                            ? <XCircle className="w-4 h-4" />
                            : <span className="text-xs font-bold">—</span>
                        }
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-[#F8FAFC] truncate block">
                          <span className="text-[#A855F7] font-bold mr-1">Q{idx + 1}.</span>
                          {q.questionText.length > 80 ? q.questionText.substring(0, 80) + '...' : q.questionText}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${
                        q.isCorrect ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                      }`}>
                        {q.marksObtained}/{q.marks}
                      </span>
                      {isOpen
                        ? <ChevronUp className="w-4 h-4 text-[#A855F7]" />
                        : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                      }
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5">
                      <div className="bg-[#151B3D] p-5 rounded-xl border border-[#27325A]">
                        <p className="text-sm text-[#F8FAFC] font-medium mb-4 whitespace-pre-wrap leading-relaxed">
                          {q.questionText}
                        </p>

                        {/* Options */}
                        <div className="space-y-2 mb-5">
                          {Object.entries(q.options).map(([key, value]) => {
                            const isSelected = q.selectedAnswer === key;
                            const isCorrect = q.correctAnswer === key;
                            let optCls = "p-3 rounded-xl border text-sm flex items-center gap-3 ";

                            if (isCorrect) {
                              optCls += "border-emerald-500/40 bg-emerald-500/10";
                            } else if (isSelected && !isCorrect) {
                              optCls += "border-red-500/40 bg-red-500/10";
                            } else {
                              optCls += "border-[#27325A] bg-[#0B1026]";
                            }

                            return (
                              <div key={key} className={optCls}>
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                                  isCorrect ? 'border-emerald-500 bg-emerald-500' : isSelected ? 'border-red-500 bg-red-500' : 'border-[#27325A]'
                                }`}>
                                  {isCorrect && <CheckCircle className="w-3 h-3 text-white" />}
                                  {isSelected && !isCorrect && <XCircle className="w-3 h-3 text-white" />}
                                </div>
                                <span className="font-bold text-[#A855F7] text-xs">{key}.</span>
                                <span className={`font-medium ${isCorrect ? 'text-emerald-400' : isSelected && !isCorrect ? 'text-red-400' : 'text-[#CBD5E1]'}`}>
                                  {value}
                                </span>
                                {isCorrect && <span className="text-[10px] font-bold text-emerald-400 ml-auto">✓ Correct</span>}
                                {isSelected && !isCorrect && <span className="text-[10px] font-bold text-red-400 ml-auto">✗ Your answer</span>}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="bg-[#0B1026] border border-[#8B5CF6]/20 rounded-xl p-4">
                          <p className="text-[10px] text-[#A855F7] uppercase font-bold tracking-widest mb-2">Explanation</p>
                          <p className="text-sm text-[#CBD5E1] leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PracticeExamResult;
