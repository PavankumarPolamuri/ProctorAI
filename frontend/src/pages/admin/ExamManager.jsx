import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, X, CheckSquare, Settings, PlayCircle, PauseCircle } from 'lucide-react';

const initialExamFormState = {
  title: '',
  description: '',
  subject: '',
  durationMinutes: 30,
  totalMarks: 100,
  negativeMarks: 0,
  maxViolations: 15,
  randomizeQuestions: false,
  randomizeOptions: false,
  published: false,
  startTime: '',
  endTime: ''
};

const ExamManager = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialExamFormState);
  
  // Question Manager Modal State
  const [isQuestionManagerOpen, setIsQuestionManagerOpen] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [examQuestions, setExamQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/admin/exams');
      setExams(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch exams');
      setLoading(false);
    }
  };

  const handleOpenModal = (exam = null) => {
    if (exam) {
      setEditingId(exam.id);
      setFormData({
        ...exam,
        startTime: exam.startTime ? exam.startTime.substring(0, 16) : '',
        endTime: exam.endTime ? exam.endTime.substring(0, 16) : ''
      });
    } else {
      setEditingId(null);
      setFormData(initialExamFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialExamFormState);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/exams/${editingId}`, formData);
      } else {
        await api.post('/admin/exams', formData);
      }
      fetchExams();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save exam. Please check the inputs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exam? This action cannot be undone.')) {
      try {
        await api.delete(`/admin/exams/${id}`);
        fetchExams();
      } catch (err) {
        alert('Failed to delete exam.');
      }
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.put(`/admin/exams/${id}/publish`, { published: !currentStatus });
      fetchExams();
    } catch (err) {
      alert('Failed to update publish status.');
    }
  };

  const openQuestionManager = async (examId) => {
    setSelectedExamId(examId);
    setIsQuestionManagerOpen(true);
    setLoadingQuestions(true);
    try {
      const allQRes = await api.get('/admin/questions');
      setAllQuestions(allQRes.data);
      
      const examQRes = await api.get(`/admin/exams/${examId}/questions`);
      setExamQuestions(examQRes.data.map(q => q.id));
    } catch (err) {
      alert('Failed to load questions.');
    } finally {
      setLoadingQuestions(false);
    }
  };

  const toggleQuestionAssignment = (questionId) => {
    setExamQuestions(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const saveQuestionAssignments = async () => {
    try {
      await api.post(`/admin/exams/${selectedExamId}/questions`, {
        questionIds: examQuestions
      });
      setIsQuestionManagerOpen(false);
      alert('Questions successfully assigned to the exam!');
    } catch (err) {
      alert('Failed to save question assignments.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111827] tracking-tight">Exams Manager</h1>
          <p className="text-sm text-[#9CA3AF]">Create, configure, and publish online examinations</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#7C3AED] text-[#111827] font-bold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center transition-all hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Exam
        </button>
      </div>

      <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        {loading ? (
          <div className="p-8 text-center text-[#9CA3AF]">Loading exams...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 font-medium">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F7F8FC] border-b border-[#E5E7EB] text-[#9CA3AF] text-xs font-bold uppercase tracking-wider">
                  <th className="p-4">Exam Title & Subject</th>
                  <th className="p-4 w-28 text-center">Duration</th>
                  <th className="p-4 w-28 text-center">Marks</th>
                  <th className="p-4 w-32 text-center">Status</th>
                  <th className="p-4 w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#9CA3AF]">
                      No exams found.
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-[#F7F8FC] transition-colors group">
                      <td className="p-4">
                        <div className="font-bold text-[#111827] group-hover:text-[#7C3AED] transition-colors">{exam.title}</div>
                        <div className="text-xs text-[#6D28D9] font-semibold mt-1 bg-[#7C3AED]/15 inline-block px-2.5 py-0.5 rounded-lg border border-[#7C3AED]/30">
                          {exam.subject}
                        </div>
                      </td>
                      <td className="p-4 text-center text-[#64748B] text-sm font-medium">{exam.durationMinutes}m</td>
                      <td className="p-4 text-center text-[#64748B] text-sm font-bold">{exam.totalMarks}</td>
                      <td className="p-4 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full 
                          ${exam.published ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-[#F7F8FC] text-[#9CA3AF] border border-[#E5E7EB]'}`}>
                          {exam.published ? 'PUBLISHED' : 'DRAFT'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => togglePublish(exam.id, exam.published)}
                          className={`p-2 rounded-xl transition-colors ${exam.published ? 'text-amber-400 hover:bg-amber-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                          title={exam.published ? "Unpublish" : "Publish"}
                        >
                          {exam.published ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => openQuestionManager(exam.id)}
                          className="p-2 text-[#6D28D9] hover:bg-[#7C3AED]/20 rounded-xl transition-colors"
                          title="Manage Questions"
                        >
                          <CheckSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenModal(exam)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                          title="Settings"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exam.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#F7F8FC]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.15)] w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 bg-[#FFFFFF] border-b border-[#E5E7EB] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center border border-[#7C3AED]/30">
                  {editingId ? <Settings className="w-5 h-5 text-[#6D28D9]" /> : <Plus className="w-5 h-5 text-[#6D28D9]" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#111827]">
                    {editingId ? 'Exam Settings' : 'Create New Exam'}
                  </h2>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">Configure exam parameters and security rules</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-[#F7F8FC] flex items-center justify-center text-[#9CA3AF] hover:text-[#111827] border border-[#E5E7EB] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-[#64748B]">
              <form id="examForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Basic Info Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Basic Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Exam Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        placeholder="e.g. Midterm Java Programming"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Description / Instructions</label>
                      <textarea
                        name="description"
                        rows="3"
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        placeholder="Provide rules or details for the students..."
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Subject / Category</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        placeholder="e.g. Computer Science"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Configuration Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Grading & Timing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Duration (Minutes)</label>
                      <input
                        type="number"
                        name="durationMinutes"
                        required
                        min="1"
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        value={formData.durationMinutes}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Total Marks</label>
                      <input
                        type="number"
                        name="totalMarks"
                        required
                        min="1"
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        value={formData.totalMarks}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Negative Marks (per wrong answer)</label>
                      <input
                        type="number"
                        name="negativeMarks"
                        required
                        min="0"
                        step="0.1"
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        value={formData.negativeMarks}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Scheduling</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">Start Time</label>
                      <input
                        type="datetime-local"
                        name="startTime"
                        required
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        value={formData.startTime}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748B] mb-1.5">End Time</label>
                      <input
                        type="datetime-local"
                        name="endTime"
                        required
                        className="w-full border border-[#E5E7EB] bg-[#F7F8FC] rounded-xl px-4 py-2.5 text-[#111827] placeholder-[#64748B] focus:border-[#7C3AED] focus:outline-none transition-colors text-sm"
                        value={formData.endTime}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Options & Visibility Card */}
                <div className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#6D28D9] uppercase tracking-wider mb-4 border-b border-[#E5E7EB] pb-2">Options & Visibility</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#F7F8FC] cursor-pointer hover:border-[#7C3AED]/50 transition-colors">
                      <input type="checkbox" name="randomizeQuestions" checked={formData.randomizeQuestions} onChange={handleInputChange} className="w-4 h-4 rounded border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] bg-[#F7F8FC]" />
                      <span className="text-xs font-bold text-[#64748B]">Randomize Questions</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-xl border border-[#E5E7EB] bg-[#F7F8FC] cursor-pointer hover:border-[#7C3AED]/50 transition-colors">
                      <input type="checkbox" name="randomizeOptions" checked={formData.randomizeOptions} onChange={handleInputChange} className="w-4 h-4 rounded border-[#E5E7EB] text-[#7C3AED] focus:ring-[#7C3AED] bg-[#F7F8FC]" />
                      <span className="text-xs font-bold text-[#64748B]">Randomize Options</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 rounded-xl border border-[#7C3AED]/30 bg-[#7C3AED]/15 cursor-pointer hover:border-[#7C3AED]/60 transition-colors">
                      <input type="checkbox" name="published" checked={formData.published} onChange={handleInputChange} className="w-4 h-4 rounded border-[#7C3AED] text-[#7C3AED] focus:ring-[#7C3AED] bg-[#F7F8FC]" />
                      <span className="text-xs font-bold text-[#6D28D9]">Publish Immediately</span>
                    </label>
                  </div>
                </div>

              </form>
            </div>

            <div className="flex justify-end space-x-3 p-6 bg-[#FFFFFF] border-t border-[#E5E7EB] shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-[#64748B] font-bold hover:bg-[#F7F8FC] hover:text-[#111827] transition-colors border border-[#E5E7EB] text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="examForm"
                className="px-8 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-[#111827] rounded-xl font-bold hover:from-[#7C3AED] hover:to-[#7C3AED] transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] text-sm"
              >
                {editingId ? 'Save Changes' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Assignment Modal */}
      {isQuestionManagerOpen && (
        <div className="fixed inset-0 bg-[#F7F8FC]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#F7F8FC] border border-[#E5E7EB] rounded-2xl shadow-2xl w-full max-w-4xl my-8 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-[#E5E7EB] bg-[#FFFFFF] shrink-0">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">Manage Exam Questions</h2>
                <p className="text-xs text-[#9CA3AF]">Select questions from the bank to assign to this exam.</p>
              </div>
              <button onClick={() => setIsQuestionManagerOpen(false)} className="text-[#9CA3AF] hover:text-[#111827]">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              {loadingQuestions ? (
                <div className="text-center text-[#9CA3AF]">Loading questions...</div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-[#6D28D9] bg-[#7C3AED]/20 px-3 py-1 rounded-xl text-xs border border-[#7C3AED]/30">
                      {examQuestions.length} Questions Selected
                    </span>
                  </div>
                  {allQuestions.map(q => (
                    <label key={q.id} className="flex items-start p-4 border border-[#E5E7EB] bg-[#FFFFFF] rounded-xl hover:border-[#7C3AED]/40 cursor-pointer transition-all">
                      <div className="pt-1 mr-4">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-[#7C3AED] rounded border-[#E5E7EB] focus:ring-[#7C3AED] bg-[#F7F8FC]"
                          checked={examQuestions.includes(q.id)}
                          onChange={() => toggleQuestionAssignment(q.id)}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-[#111827]">{q.questionText}</div>
                        <div className="text-xs text-[#9CA3AF] mt-1.5 flex gap-3">
                          <span className="bg-[#F7F8FC] border border-[#E5E7EB] text-[#64748B] px-2 py-0.5 rounded-lg">{q.subject}</span>
                          <span className={`${q.difficulty === 'EASY' ? 'text-emerald-400' : q.difficulty === 'MEDIUM' ? 'text-amber-400' : 'text-red-400'} font-bold`}>
                            {q.difficulty}
                          </span>
                          <span>{q.marks} Marks</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-[#E5E7EB] bg-[#FFFFFF] shrink-0">
              <button
                onClick={() => setIsQuestionManagerOpen(false)}
                className="px-4 py-2 border border-[#E5E7EB] rounded-xl text-[#64748B] font-bold hover:bg-[#F7F8FC] text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveQuestionAssignments}
                className="px-6 py-2 bg-gradient-to-r from-[#7C3AED] to-[#6D28D9] text-[#111827] rounded-xl font-bold hover:from-[#7C3AED] hover:to-[#7C3AED] text-sm shadow-[0_0_15px_rgba(124,58,237,0.4)]"
              >
                Save Assignments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamManager;
