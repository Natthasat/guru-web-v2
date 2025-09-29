import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminManageQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    book_id: '',
    page: '',
    question_no: '',
    question_text: '',
    question_img: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/questions`);
      setQuestions(response.data);
    } catch (error) {
      setMessage('ไม่สามารถโหลดรายการโจทย์ได้');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('คุณต้องการลบโจทย์นี้หรือไม่?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/questions/${questionId}`);
      setMessage('ลบโจทย์สำเร็จแล้ว');
      fetchQuestions();
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการลบโจทย์');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      book_id: question.book_id,
      page: question.page.toString(),
      question_no: question.question_no.toString(),
      question_text: question.question_text || '',
      question_img: null
    });
    if (question.question_img) {
      setImagePreview(getImageUrl(question.question_img));
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setFormData({
      book_id: '',
      page: '',
      question_no: '',
      question_text: '',
      question_img: null
    });
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // ตรวจสอบขนาดไฟล์ (จำกัดที่ 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setMessage('ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)');
        return;
      }

      // ตรวจสอบประเภทไฟล์
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('ประเภทไฟล์ไม่รองรับ กรุณาใช้ JPG, PNG หรือ GIF');
        return;
      }

      setFormData(prev => ({
        ...prev,
        question_img: file
      }));
      
      // แสดงตัวอย่างรูปภาพ
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setMessage(''); // ล้างข้อความ error
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      question_img: null
    }));
    setImagePreview(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // สร้าง FormData สำหรับอัปโหลดไฟล์
      const submitData = new FormData();
      submitData.append('book_id', formData.book_id);
      submitData.append('page', parseInt(formData.page));
      submitData.append('question_no', parseInt(formData.question_no));
      submitData.append('question_text', formData.question_text || '');
      
      if (formData.question_img) {
        submitData.append('question_img', formData.question_img);
      }

      await axios.put(`${API_BASE_URL}/questions/${editingQuestion.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('แก้ไขโจทย์สำเร็จแล้ว!');
      handleCancelEdit();
      fetchQuestions();
    } catch (error) {
      console.error('Error updating question:', error);
      if (error.response) {
        setMessage('เกิดข้อผิดพลาด: ' + (error.response.data.detail || error.response.data.message || 'ไม่สามารถแก้ไขโจทย์ได้'));
      } else {
        setMessage('เกิดข้อผิดพลาด: Network Error');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(question =>
    question.book_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.question_text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.page.toString().includes(searchTerm) ||
    question.question_no.toString().includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex);

  // ฟังก์ชันไปหน้าถัดไป/ก่อนหน้า
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  // รีเซ็ตหน้าเมื่อค้นหา
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white">จัดการโจทย์ทั้งหมด</h1>
          </div>
          <button
            onClick={() => window.history.back()}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm"
          >
            ← กลับ
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-4xl w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="ค้นหาโจทย์ (รหัสหนังสือ, หน้า, ข้อที่, หรือข้อความโจทย์)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Edit Form Modal */}
            {editingQuestion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto m-4">
                  <h3 className="text-xl font-bold text-white mb-4">แก้ไขโจทย์</h3>
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        📚 รหัสหนังสือ (Book ID) *
                      </label>
                      <input
                        type="text"
                        name="book_id"
                        value={formData.book_id}
                        onChange={handleInputChange}
                        required
                        className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        placeholder="เช่น MATH-101"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          📄 หน้า (Page) *
                        </label>
                        <input
                          type="number"
                          name="page"
                          value={formData.page}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="เช่น 25"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-2">
                          🔢 ข้อที่ (Question No.) *
                        </label>
                        <input
                          type="number"
                          name="question_no"
                          value={formData.question_no}
                          onChange={handleInputChange}
                          required
                          min="1"
                          className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                          placeholder="เช่น 1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        ✏️ ข้อความโจทย์ (Question Text)
                      </label>
                      <textarea
                        name="question_text"
                        value={formData.question_text}
                        onChange={handleInputChange}
                        rows="4"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                        placeholder="พิมพ์ข้อความโจทย์ที่นี่ (ถ้ามี)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        🖼️ รูปภาพโจทย์ (Question Image)
                      </label>
                      <div className="space-y-3">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-500 file:text-white hover:file:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                        />
                        {imagePreview && (
                          <div className="relative bg-white/5 rounded-xl p-4 border border-white/20">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-w-full h-auto max-h-64 mx-auto rounded-lg border border-white/30"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-6 right-6 bg-red-500/80 hover:bg-red-500 text-white rounded-full p-2 transition-all duration-200 backdrop-blur-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        <p className="text-sm text-white/60">
                          รองรับไฟล์ JPG, PNG, GIF ขนาดไม่เกิน 5MB
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        {loading ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gray-500/80 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-white/80">
                พบโจทย์ {filteredQuestions.length} รายการ จากทั้งหมด {questions.length} รายการ
                {filteredQuestions.length > 0 && (
                  <span className="ml-2 text-sm">
                    (แสดง {startIndex + 1}-{Math.min(endIndex, filteredQuestions.length)} จาก {filteredQuestions.length})
                  </span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-white/60 text-sm">
                  หน้า {currentPage} จาก {totalPages}
                </p>
              )}
            </div>

            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                ไม่พบโจทย์ในระบบ
              </div>
            ) : (
              currentQuestions.map((question) => (
                <div key={question.id} className="border border-white/20 bg-white/5 rounded-xl p-4 mb-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {question.book_id} หน้า {question.page} ข้อ {question.question_no}
                        </h3>
                        <span className="text-sm text-white/60">
                          ID: {question.id}
                        </span>
                        {question.created_at && (
                          <span className="text-xs text-white/40">
                            📅 {new Date(question.created_at).toLocaleString('th-TH')}
                          </span>
                        )}
                      </div>
                      {question.question_text && (
                        <p className="text-white/80 mb-3">
                          {question.question_text}
                        </p>
                      )}
                      {question.question_img && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(question.question_img)}
                            alt="Question"
                            className="max-w-xs h-auto rounded-lg border border-white/30"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(question)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-xl text-sm hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(question.id)}
                        className="bg-red-500/80 text-white px-3 py-1 rounded-xl text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-md"
                      >
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className={`px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow ${
                    currentPage === 1
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  ← ก่อนหน้า
                </button>
                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow ${
                          page === currentPage
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (
                    page === currentPage - 3 ||
                    page === currentPage + 3
                  ) {
                    return <span key={page} className="px-2 text-white/60">...</span>;
                  }
                  return null;
                })}
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-2 rounded-xl font-medium text-sm transition-all duration-200 shadow ${
                    currentPage === totalPages
                      ? 'bg-white/10 text-white/40 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  ถัดไป →
                </button>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm ${
                message.includes('สำเร็จ') 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-red-500/20 border border-red-400/30'
              }`}>
                <div className="flex items-center">
                  <span className={`mr-2 ${message.includes('สำเร็จ') ? 'text-green-300' : 'text-red-300'}`}>
                    {message.includes('สำเร็จ') ? '✅' : '⚠️'}
                  </span>
                  <p className={`text-sm ${message.includes('สำเร็จ') ? 'text-green-200' : 'text-red-200'}`}>
                    {message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
    </div>
  );
}

export default AdminManageQuestions;