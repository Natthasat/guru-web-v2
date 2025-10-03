import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function AdminLinkQuestionSolution() {
  const [questions, setQuestions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('');
  const [selectedSolutionId, setSelectedSolutionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [questionSearch, setQuestionSearch] = useState('');
  const [solutionSearch, setSolutionSearch] = useState('');

  useEffect(() => {
    fetchQuestions();
    fetchSolutions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchSolutions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/solutions`);
      setSolutions(response.data);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const handleLink = async () => {
    if (!selectedQuestionId || !selectedSolutionId) {
      setMessage('⚠️ กรุณาเลือกโจทย์และเฉลย');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await axios.post(
        `${API_BASE_URL}/questions/${selectedQuestionId}/solutions/${selectedSolutionId}`
      );

      setMessage('✅ เชื่อมโจทย์กับเฉลยสำเร็จ!');
      setSelectedQuestionId('');
      setSelectedSolutionId('');
    } catch (error) {
      console.error('Error linking:', error);
      if (error.response?.status === 400) {
        setMessage('⚠️ โจทย์และเฉลยนี้เชื่อมกันอยู่แล้ว');
      } else {
        setMessage(`❌ เกิดข้อผิดพลาด: ${error.response?.data?.detail || 'ไม่สามารถเชื่อมได้'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(q =>
    q.book_id?.toLowerCase().includes(questionSearch.toLowerCase()) ||
    q.page?.toString().includes(questionSearch) ||
    q.question_no?.toString().includes(questionSearch) ||
    q.question_text?.toLowerCase().includes(questionSearch.toLowerCase())
  );

  const filteredSolutions = solutions.filter(s =>
    s.title?.toLowerCase().includes(solutionSearch.toLowerCase()) ||
    s.answer_text?.toLowerCase().includes(solutionSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🔗</span>
            </div>
            <h1 className="text-2xl font-bold text-white">เชื่อมโจทย์กับเฉลย</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-6xl w-full">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200"
              >
                ← กลับ
              </button>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-blue-800 text-sm">
                💡 <strong>วิธีใช้:</strong> เลือกโจทย์จากด้านซ้าย และเลือกเฉลยจากด้านขวา 
                แล้วกดปุ่ม "เชื่อมโจทย์กับเฉลย" เฉลย 1 ตัวสามารถเชื่อมกับหลายโจทย์ได้
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Questions Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  เลือกโจทย์
                </h3>

                {/* Search */}
                <input
                  type="text"
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="ค้นหาโจทย์..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
                />

                {/* Question List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredQuestions.length === 0 ? (
                    <p className="text-white/60 text-center py-4">ไม่พบโจทย์</p>
                  ) : (
                    filteredQuestions.map(q => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedQuestionId === q.id
                            ? 'bg-blue-500/30 border-blue-400'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {q.book_id} หน้า {q.page} ข้อ {q.question_no}
                            </p>
                            {q.question_text && (
                              <p className="text-white/60 text-sm mt-1 truncate">
                                {q.question_text.substring(0, 50)}...
                              </p>
                            )}
                          </div>
                          {selectedQuestionId === q.id && (
                            <span className="text-blue-300">✓</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Solutions Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <span className="mr-2">✅</span>
                  เลือกเฉลย
                </h3>

                {/* Search */}
                <input
                  type="text"
                  value={solutionSearch}
                  onChange={(e) => setSolutionSearch(e.target.value)}
                  placeholder="ค้นหาเฉลย..."
                  className="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 mb-4"
                />

                {/* Solution List */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredSolutions.length === 0 ? (
                    <p className="text-white/60 text-center py-4">ไม่พบเฉลย</p>
                  ) : (
                    filteredSolutions.map(s => (
                      <div
                        key={s.id}
                        onClick={() => setSelectedSolutionId(s.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedSolutionId === s.id
                            ? 'bg-green-500/30 border-green-400'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              เฉลย ID: {s.id} {s.title && `- ${s.title}`}
                            </p>
                            {s.answer_text && (
                              <p className="text-white/60 text-sm mt-1 truncate">
                                {s.answer_text.substring(0, 50)}...
                              </p>
                            )}
                            {s.images && s.images.length > 0 && (
                              <p className="text-white/40 text-xs mt-1">
                                📷 {s.images.length} รูป
                              </p>
                            )}
                          </div>
                          {selectedSolutionId === s.id && (
                            <span className="text-green-300">✓</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Link Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleLink}
                disabled={loading || !selectedQuestionId || !selectedSolutionId}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังเชื่อม...
                  </>
                ) : (
                  <>🔗 เชื่อมโจทย์กับเฉลย</>
                )}
              </button>

              {/* Selected Info */}
              {(selectedQuestionId || selectedSolutionId) && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/20">
                  <p className="text-white/80 text-sm">
                    {selectedQuestionId && (
                      <span className="mr-4">
                        📝 โจทย์ ID: <strong>{selectedQuestionId}</strong>
                      </span>
                    )}
                    {selectedSolutionId && (
                      <span>
                        ✅ เฉลย ID: <strong>{selectedSolutionId}</strong>
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Message */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl backdrop-blur-sm ${
                message.includes('สำเร็จ') 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-red-500/20 border border-red-400/30'
              }`}>
                <p className={`text-sm ${message.includes('สำเร็จ') ? 'text-green-200' : 'text-red-200'}`}>
                  {message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl"></div>
    </div>
  );
}

export default AdminLinkQuestionSolution;
