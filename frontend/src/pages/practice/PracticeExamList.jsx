import React from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceExams } from '../../data/practiceExams';
import { 
  Shield, Clock, FileText, ArrowRight, ChevronLeft, 
  AlertTriangle, BookOpen, Check, Star 
} from 'lucide-react';

const PracticeExamList = () => {
  const navigate = useNavigate();

  const difficultyColor = {
    Beginner: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
    Intermediate: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
    Advanced: 'text-red-400 bg-red-500/15 border-red-500/30',
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] font-sans relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#7C3AED]/8 rounded-full blur-[140px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/6 rounded-full blur-[130px]"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-md border-b border-[#27325A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[#CBD5E1] hover:text-[#F8FAFC] transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
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
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#7C3AED]/15 border border-[#8B5CF6]/30 text-[#A855F7] text-xs font-bold tracking-wider uppercase mb-5">
            <BookOpen className="w-3.5 h-3.5" />
            Practice Demo — Not a Real Exam
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
            Free Practice{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#E879F9] bg-clip-text text-transparent">Exams</span>
          </h1>
          <p className="text-base text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
            Experience the ProctorAI examination platform. Choose a subject below and take a timed practice test — no account required.
          </p>
        </div>

        {/* Notice Banner */}
        <div className="bg-[#241715]/60 border border-[#D97706]/30 rounded-xl p-4 mb-10 flex items-start gap-3 max-w-3xl mx-auto">
          <AlertTriangle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
          <div className="text-xs text-[#CBD5E1] leading-relaxed">
            <span className="font-bold text-[#F59E0B]">Practice Mode:</span> These are sample exams for demonstration purposes only. 
            Results are not recorded and do not appear on any student profile. No login or registration is required.
          </div>
        </div>

        {/* Exam Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {practiceExams.map((exam) => (
            <div
              key={exam.id}
              className="group bg-[#0B1026]/90 backdrop-blur-md border border-[rgba(139,92,246,0.25)] hover:border-[#8B5CF6]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_40px_-10px_rgba(139,92,246,0.3)] flex flex-col"
            >
              {/* Card Header */}
              <div className="p-6 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{exam.icon}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg border ${difficultyColor[exam.difficulty]}`}>
                    {exam.difficulty}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 tracking-tight group-hover:text-[#E879F9] transition-colors">
                  {exam.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-5 line-clamp-2">
                  {exam.description}
                </p>

                <div className="space-y-2.5 text-sm font-medium bg-[#151B3D] p-4 rounded-xl border border-[#27325A]">
                  <div className="flex items-center justify-between text-[#CBD5E1]">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#A855F7]" />
                      Questions
                    </div>
                    <span className="text-[#F8FAFC] font-bold">{exam.questions.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#CBD5E1]">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-[#A855F7]" />
                      Duration
                    </div>
                    <span className="text-[#F8FAFC] font-bold">{exam.durationMinutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-[#CBD5E1]">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-2 text-[#A855F7]" />
                      Total Marks
                    </div>
                    <span className="text-[#F8FAFC] font-bold">{exam.totalMarks}</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => navigate(`/practice/${exam.id}`)}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl text-sm font-bold text-[#F8FAFC] bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5"
                >
                  Start Practice Exam
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <p className="text-[10px] text-center text-[#64748B] mt-2.5 font-medium">
                  No account or login needed
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA: Login for real exams */}
        <div className="text-center mt-16">
          <p className="text-sm text-[#94A3B8] mb-3">Want to take official proctored exams?</p>
          <button
            onClick={() => navigate('/login')}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-[#C084FC] border border-[rgba(139,92,246,0.45)] hover:border-[#8B5CF6] rounded-xl hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all"
          >
            Sign in to your account
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default PracticeExamList;
