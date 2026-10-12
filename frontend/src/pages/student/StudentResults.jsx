import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, CheckCircle, XCircle, Clock, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAttempt, setExpandedAttempt] = useState(null);
  const [attemptDetails, setAttemptDetails] = useState({});
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const response = await api.get('/student/my-attempts');
      const completed = response.data.filter(a => a.status === 'SUBMITTED' || a.status === 'AUTO_SUBMITTED' || a.status === 'FLAGGED');
      setAttempts(completed);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch results.');
      setLoading(false);
    }
  };

  const toggleDetails = async (attemptId) => {
    if (expandedAttempt === attemptId) {
      setExpandedAttempt(null);
      return;
    }

    setExpandedAttempt(attemptId);
    if (!attemptDetails[attemptId]) {
      setLoadingDetails(true);
      try {
        const response = await api.get(`/student/attempts/${attemptId}/result`);
        setAttemptDetails(prev => ({ ...prev, [attemptId]: response.data }));
      } catch (err) {
        console.error('Failed to fetch detailed result', err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <div className="p-8 text-center text-[#94A3B8]">Loading your results...</div>;
  if (error) return <div className="p-8 text-center text-red-400 font-medium">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight mb-6">My Exam Results</h1>

      {attempts.length === 0 ? (
        <div className="bg-[#111936] border border-[#27325A] p-12 text-center text-[#94A3B8] rounded-2xl">
          You haven't completed any exams yet.
        </div>
      ) : (
        <div className="space-y-4">
          {attempts.map((attempt) => (
            <div key={attempt.id} className="bg-[#111936] border border-[#27325A] hover:border-[#8B5CF6]/40 rounded-2xl overflow-hidden group transition-all duration-300">
              <div 
                className="p-6 cursor-pointer hover:bg-[#151B3D] flex justify-between items-center transition-colors relative overflow-hidden"
                onClick={() => toggleDetails(attempt.id)}
              >
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-[#7C3AED]/20 text-[#A855F7] rounded-lg border border-[#8B5CF6]/30">
                      {attempt.subject}
                    </span>
                    {attempt.status === 'FLAGGED' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 bg-red-500/15 text-red-400 rounded-lg border border-red-500/30 flex items-center">
                        <AlertTriangle className="w-3 h-3 mr-1 text-red-400" />
                        Flagged for Review
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-1 group-hover:text-[#C084FC] transition-colors">{attempt.examTitle}</h3>
                  <div className="text-xs text-[#94A3B8] flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-[#8B5CF6]" />
                    Submitted: {formatDate(attempt.submittedTime)}
                  </div>
                </div>

                <div className="flex items-center space-x-8 relative z-10">
                  <div className="text-right">
                    <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">Score</div>
                    <div className="text-2xl font-black text-[#F8FAFC]">
                      {attempt.score} <span className="text-base text-[#94A3B8] font-bold">/ {attempt.totalMarks}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#94A3B8] font-semibold uppercase tracking-wide">Percentage</div>
                    <div className={`text-2xl font-black ${attempt.percentage >= 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {attempt.percentage}%
                    </div>
                  </div>
                  <div className="bg-[#0B1026] p-2.5 rounded-xl border border-[#27325A] group-hover:border-[#8B5CF6]/50 transition-colors">
                  {expandedAttempt === attempt.id ? (
                    <ChevronUp className="w-5 h-5 text-[#A855F7]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#94A3B8] group-hover:text-[#A855F7]" />
                  )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedAttempt === attempt.id && (
                <div className="bg-[#0B1026] border-t border-[#27325A] p-6 relative z-10">
                  {loadingDetails && !attemptDetails[attempt.id] ? (
                    <div className="text-center py-4 text-[#94A3B8] font-medium">Loading detailed analysis...</div>
                  ) : attemptDetails[attempt.id] ? (
                    <div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                          <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">Result</div>
                          <div className={`text-lg font-black mt-1 ${attemptDetails[attempt.id].resultStatus === 'PASS' ? 'text-emerald-400' : attemptDetails[attempt.id].resultStatus === 'FLAGGED FOR REVIEW' ? 'text-amber-400' : 'text-red-400'}`}>
                            {attemptDetails[attempt.id].resultStatus}
                          </div>
                        </div>
                        <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                          <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">Correct</div>
                          <div className="text-lg font-black text-emerald-400 mt-1 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1.5 opacity-80" /> {attemptDetails[attempt.id].correctCount}
                          </div>
                        </div>
                        <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                          <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">Incorrect</div>
                          <div className="text-lg font-black text-red-400 mt-1 flex items-center">
                            <XCircle className="w-4 h-4 mr-1.5 opacity-80" /> {attemptDetails[attempt.id].wrongCount}
                          </div>
                        </div>
                        <div className="bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                          <div className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-widest">Unanswered</div>
                          <div className="text-lg font-black text-[#CBD5E1] mt-1">
                            {attemptDetails[attempt.id].unansweredCount}
                          </div>
                        </div>
                      </div>

                      <h4 className="font-bold text-[#F8FAFC] mb-4 border-b border-[#27325A] pb-3 flex items-center">
                        <Award className="w-5 h-5 mr-2 text-[#A855F7]" />
                        Question Analysis
                      </h4>
                      <div className="space-y-4">
                        {attemptDetails[attempt.id].questionDetails.map((q, idx) => (
                          <div key={q.questionId} className="bg-[#151B3D] p-5 rounded-xl border border-[#27325A]">
                            <div className="flex justify-between items-start mb-4">
                              <span className="font-medium text-[#CBD5E1] pr-6 leading-relaxed text-sm"><span className="text-[#A855F7] font-bold mr-1">Q{idx + 1}.</span> {q.questionText}</span>
                              <span className={`font-bold whitespace-nowrap text-sm px-2.5 py-1 rounded-lg bg-[#0B1026] border border-[#27325A] ${q.isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                                {q.marksObtained} / {q.maxMarks}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="p-3.5 rounded-xl bg-[#0B1026] border border-[#27325A]">
                                <span className="text-[#94A3B8] block mb-1 text-[10px] font-bold uppercase tracking-wider">Your Answer</span>
                                <span className={q.isCorrect ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                                  {q.selectedAnswer ? `Option ${q.selectedAnswer} - ${q.selectedAnswerText || ''}` : 'Not Answered'}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                                <span className="text-emerald-400/80 block mb-1 text-[10px] font-bold uppercase tracking-wider">Correct Answer</span>
                                <span className="text-emerald-400 font-medium">Option {q.correctAnswer} - {q.correctAnswerText || ''}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-red-400">Failed to load details.</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentResults;
