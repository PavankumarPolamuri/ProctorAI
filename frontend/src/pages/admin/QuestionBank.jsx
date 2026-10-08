import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';

const initialFormState = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: 'A',
  marks: 1.0,
  difficulty: 'EASY',
  subject: ''
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);
  
  // Search and filter
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/admin/questions');
      setQuestions(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch questions');
      setLoading(false);
    }
  };

  const handleOpenModal = (question = null) => {
    if (question) {
      setEditingId(question.id);
      setFormData(question);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData(initialFormState);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'marks' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/questions/${editingId}`, formData);
      } else {
        await api.post('/admin/questions', formData);
      }
      fetchQuestions();
      handleCloseModal();
    } catch (err) {
      alert('Failed to save question. Please check the inputs.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this question? It may affect exams that use it.')) {
      try {
        await api.delete(`/admin/questions/${id}`);
        fetchQuestions();
      } catch (err) {
        alert('Failed to delete question. It might be assigned to an active exam.');
      }
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Question Bank</h1>
          <p className="text-sm text-[#94A3B8]">Manage assessment questions across all subjects</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#8B5CF6] hover:to-[#C084FC] text-[#F8FAFC] font-bold px-4 py-2.5 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.4)] flex items-center transition-all hover:-translate-y-0.5 text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Question
        </button>
      </div>

      <div className="bg-[#111936] border border-[#27325A] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="p-4 border-b border-[#27325A] bg-[#0B1026]">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-[#8B5CF6] w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions or subjects..."
              className="w-full pl-10 pr-4 py-2 bg-[#151B3D] border border-[#27325A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#64748B] focus:border-[#8B5CF6] focus:outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#94A3B8]">Loading questions...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400 font-medium">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B1026] border-b border-[#27325A] text-[#94A3B8] text-xs font-bold uppercase tracking-wider">
                  <th className="p-4 w-16">ID</th>
                  <th className="p-4">Question & Subject</th>
                  <th className="p-4 w-24 text-center">Marks</th>
                  <th className="p-4 w-32">Difficulty</th>
                  <th className="p-4 w-32 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27325A]">
                {filteredQuestions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-[#94A3B8]">
                      No questions found.
                    </td>
                  </tr>
                ) : (
                  filteredQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-[#151B3D] transition-colors">
                      <td className="p-4 text-[#94A3B8] font-mono text-xs">#{q.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-[#F8FAFC] line-clamp-2 text-sm">{q.questionText}</div>
                        <div className="text-xs text-[#A855F7] font-semibold mt-1 bg-[#7C3AED]/15 inline-block px-2.5 py-0.5 rounded-lg border border-[#8B5CF6]/30">
                          {q.subject}
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-[#CBD5E1] text-sm">{q.marks}</td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full 
                          ${q.difficulty === 'EASY' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 
                            q.difficulty === 'MEDIUM' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 
                            'bg-red-500/15 text-red-400 border border-red-500/30'}`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleOpenModal(q)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-xl transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#050816]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#0B1026] border border-[#27325A] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_30px_rgba(124,58,237,0.15)] w-full max-w-3xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 bg-[#111936] border-b border-[#27325A] shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED]/20 flex items-center justify-center border border-[#8B5CF6]/30">
                  {editingId ? <Edit2 className="w-5 h-5 text-[#A855F7]" /> : <Plus className="w-5 h-5 text-[#A855F7]" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#F8FAFC]">
                    {editingId ? 'Edit Question' : 'Add New Question'}
                  </h2>
                  <p className="text-xs text-[#94A3B8] mt-0.5">Define question text, options, and grading</p>
                </div>
              </div>
              <button onClick={handleCloseModal} className="w-8 h-8 rounded-xl bg-[#151B3D] flex items-center justify-center text-[#94A3B8] hover:text-[#F8FAFC] border border-[#27325A] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 text-[#CBD5E1]">
              <form id="questionForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Question Details Card */}
                <div className="bg-[#111936] border border-[#27325A] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-4 border-b border-[#27325A] pb-2">Question Details</h3>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Question Text</label>
                    <textarea
                      name="questionText"
                      required
                      rows="3"
                      className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] placeholder-[#64748B] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                      value={formData.questionText}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Options Card */}
                <div className="bg-[#111936] border border-[#27325A] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-4 border-b border-[#27325A] pb-2">Answer Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Option A</label>
                      <input
                        type="text"
                        name="optionA"
                        required
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.optionA}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Option B</label>
                      <input
                        type="text"
                        name="optionB"
                        required
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.optionB}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Option C</label>
                      <input
                        type="text"
                        name="optionC"
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.optionC}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Option D</label>
                      <input
                        type="text"
                        name="optionD"
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.optionD}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Settings Card */}
                <div className="bg-[#111936] border border-[#27325A] rounded-xl p-5 shadow-sm">
                  <h3 className="text-xs font-bold text-[#A855F7] uppercase tracking-wider mb-4 border-b border-[#27325A] pb-2">Grading & Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Correct Answer</label>
                      <select
                        name="correctAnswer"
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.correctAnswer}
                        onChange={handleInputChange}
                      >
                        <option value="A">Option A</option>
                        <option value="B">Option B</option>
                        <option value="C">Option C</option>
                        <option value="D">Option D</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Marks</label>
                      <input
                        type="number"
                        name="marks"
                        min="0.5"
                        step="0.5"
                        required
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.marks}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Difficulty</label>
                      <select
                        name="difficulty"
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.difficulty}
                        onChange={handleInputChange}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#CBD5E1] mb-1.5">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        required
                        placeholder="e.g. History"
                        className="w-full border border-[#27325A] bg-[#0B1026] rounded-xl px-4 py-2.5 text-[#F8FAFC] focus:border-[#8B5CF6] focus:outline-none transition-colors text-sm"
                        value={formData.subject}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="flex justify-end space-x-3 p-6 bg-[#111936] border-t border-[#27325A] shrink-0">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-[#CBD5E1] font-bold hover:bg-[#151B3D] hover:text-[#F8FAFC] transition-colors border border-[#27325A] text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="questionForm"
                className="px-8 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-[#F8FAFC] rounded-xl font-bold hover:from-[#8B5CF6] hover:to-[#C084FC] transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] text-sm"
              >
                {editingId ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
