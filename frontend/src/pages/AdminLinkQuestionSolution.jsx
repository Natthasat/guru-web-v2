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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedSolution, setSelectedSolution] = useState(null);

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

  const handleSelectQuestion = (question) => {
    setSelectedQuestionId(question.id);
    setSelectedQuestion(question);
  };

  const handleSelectSolution = (solution) => {
    setSelectedSolutionId(solution.id);
    setSelectedSolution(solution);
  };

  const openConfirmModal = () => {
    if (!selectedQuestionId || !selectedSolutionId) {
      setMessage('⚠️ กรุณาเลือกโจทย์และเฉลย');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleLink = async () => {
    setLoading(true);
    setMessage('');
    setShowConfirmModal(false);

    try {
      await axios.post(
        `${API_BASE_URL}/questions/${selectedQuestionId}/solutions/${selectedSolutionId}`
      );

      setMessage('✅ เชื่อมโจทย์กับเฉลยสำเร็จ!');
      setSelectedQuestionId('');
      setSelectedSolutionId('');
      setSelectedQuestion(null);
      setSelectedSolution(null);
      
      // Refresh data to show updated linked count
      fetchQuestions();
      fetchSolutions();
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
                        onClick={() => handleSelectQuestion(q)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedQuestionId === q.id
                            ? 'bg-blue-500/30 border-blue-400'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {q.book_id} หน้า {q.page} ข้อ {q.question_no}
                            </p>
                            {q.question_text && (
                              <p className="text-white/60 text-sm mt-1 truncate">
                                {q.question_text.substring(0, 50)}...
                              </p>
                            )}
                            {q.solutions && q.solutions.length > 0 && (
                              <p className="text-green-400 text-xs mt-1">
                                ✅ มีเฉลยแล้ว ({q.solutions.length} เฉลย)
                              </p>
                            )}
                          </div>
                          {selectedQuestionId === q.id && (
                            <span className="text-blue-300 text-xl">✓</span>
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
                        onClick={() => handleSelectSolution(s)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                          selectedSolutionId === s.id
                            ? 'bg-green-500/30 border-green-400'
                            : 'bg-white/5 border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              เฉลย ID: {s.id} {s.title && `- ${s.title}`}
                            </p>
                            {s.answer_text && (
                              <p className="text-white/60 text-sm mt-1 truncate">
                                {s.answer_text.substring(0, 50)}...
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1">
                              {s.images && s.images.length > 0 && (
                                <p className="text-white/40 text-xs">
                                  📷 {s.images.length} รูป
                                </p>
                              )}
                              {s.linked_questions && s.linked_questions.length > 0 && (
                                <p className="text-blue-400 text-xs">
                                  🔗 เชื่อมกับ {s.linked_questions.length} โจทย์
                                </p>
                              )}
                            </div>
                          </div>
                          {selectedSolutionId === s.id && (
                            <span className="text-green-300 text-xl">✓</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Preview Selected Items */}
            {(selectedQuestion || selectedSolution) && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Selected Question Preview */}
                {selectedQuestion && (
                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-xl p-4">
                    <h4 className="text-blue-300 font-bold mb-2 flex items-center">
                      <span className="mr-2">📝</span>
                      โจทย์ที่เลือก
                    </h4>
                    <p className="text-white text-sm mb-2">
                      {selectedQuestion.book_id} หน้า {selectedQuestion.page} ข้อ {selectedQuestion.question_no}
                    </p>
                    {selectedQuestion.question_text && (
                      <p className="text-white/70 text-sm mb-2">{selectedQuestion.question_text}</p>
                    )}
                    {selectedQuestion.question_img && (
                      <img 
                        src={`http://localhost:8000/${selectedQuestion.question_img}`}
                        alt="โจทย์"
                        className="w-full max-h-48 object-contain bg-white rounded-lg mt-2"
                      />
                    )}
                  </div>
                )}

                {/* Selected Solution Preview */}
                {selectedSolution && (
                  <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                    <h4 className="text-green-300 font-bold mb-2 flex items-center">
                      <span className="mr-2">✅</span>
                      เฉลยที่เลือก
                    </h4>
                    <p className="text-white text-sm mb-2">
                      เฉลย ID: {selectedSolution.id}
                      {selectedSolution.title && ` - ${selectedSolution.title}`}
                    </p>
                    {selectedSolution.answer_text && (
                      <p className="text-white/70 text-sm mb-2">{selectedSolution.answer_text}</p>
                    )}
                    {selectedSolution.images && selectedSolution.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {selectedSolution.images.slice(0, 2).map((img, idx) => (
                          <img 
                            key={idx}
                            src={`http://localhost:8000/${img.image_path}`}
                            alt={`เฉลย ${idx + 1}`}
                            className="w-full h-32 object-contain bg-white rounded-lg"
                          />
                        ))}
                        {selectedSolution.images.length > 2 && (
                          <div className="text-white/60 text-xs text-center">
                            +{selectedSolution.images.length - 2} รูปอื่น ๆ
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Link Button */}
            <div className="mt-6 text-center">
              <button
                onClick={openConfirmModal}
                disabled={loading || !selectedQuestionId || !selectedSolutionId}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
              >
                🔗 เชื่อมโจทย์กับเฉลย
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                <span className="mr-2">🔗</span>
                ยืนยันการเชื่อมโยง
              </h3>
              
              <div className="bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4 mb-4">
                <p className="text-yellow-200 text-sm">
                  ⚠️ กรุณาตรวจสอบว่าโจทย์และเฉลยตรงกันก่อนยืนยัน
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Question Detail */}
                {selectedQuestion && (
                  <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4">
                    <h4 className="text-blue-300 font-bold mb-3 flex items-center text-lg">
                      <span className="mr-2">📝</span>
                      โจทย์
                    </h4>
                    <div className="space-y-2">
                      <p className="text-white font-medium">
                        {selectedQuestion.book_id} หน้า {selectedQuestion.page} ข้อ {selectedQuestion.question_no}
                      </p>
                      {selectedQuestion.question_text && (
                        <p className="text-white/80 text-sm">{selectedQuestion.question_text}</p>
                      )}
                      {selectedQuestion.question_img && (
                        <div className="mt-3">
                          <img 
                            src={`http://localhost:8000/${selectedQuestion.question_img}`}
                            alt="โจทย์"
                            className="w-full max-h-64 object-contain bg-white rounded-lg"
                          />
                        </div>
                      )}
                      {selectedQuestion.solutions && selectedQuestion.solutions.length > 0 && (
                        <div className="mt-2 p-2 bg-green-500/20 rounded border border-green-400/30">
                          <p className="text-green-300 text-xs">
                            ℹ️ โจทย์นี้มีเฉลยอยู่แล้ว {selectedQuestion.solutions.length} เฉลย
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Solution Detail */}
                {selectedSolution && (
                  <div className="bg-green-500/20 border border-green-400/30 rounded-xl p-4">
                    <h4 className="text-green-300 font-bold mb-3 flex items-center text-lg">
                      <span className="mr-2">✅</span>
                      เฉลย
                    </h4>
                    <div className="space-y-2">
                      <p className="text-white font-medium">
                        เฉลย ID: {selectedSolution.id}
                        {selectedSolution.title && ` - ${selectedSolution.title}`}
                      </p>
                      {selectedSolution.answer_text && (
                        <p className="text-white/80 text-sm">{selectedSolution.answer_text}</p>
                      )}
                      {selectedSolution.images && selectedSolution.images.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {selectedSolution.images.map((img, idx) => (
                            <div key={idx} className="relative">
                              <p className="text-white/60 text-xs mb-1">รูปที่ {img.order_num}</p>
                              <img 
                                src={`http://localhost:8000/${img.image_path}`}
                                alt={`เฉลย ${img.order_num}`}
                                className="w-full max-h-48 object-contain bg-white rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedSolution.linked_questions && selectedSolution.linked_questions.length > 0 && (
                        <div className="mt-2 p-2 bg-blue-500/20 rounded border border-blue-400/30">
                          <p className="text-blue-300 text-xs">
                            ℹ️ เฉลยนี้เชื่อมกับ {selectedSolution.linked_questions.length} โจทย์แล้ว
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20"
                >
                  ❌ ยกเลิก
                </button>
                <button
                  onClick={handleLink}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      กำลังเชื่อม...
                    </>
                  ) : (
                    <>✅ ยืนยันเชื่อมโยง</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminLinkQuestionSolution;
