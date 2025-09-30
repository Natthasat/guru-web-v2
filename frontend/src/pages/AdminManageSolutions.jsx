import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminManageSolutions() {
  const [solutions, setSolutions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSolution, setEditingSolution] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [formData, setFormData] = useState({
    answer_text: '',
    answer_img: null
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/solutions`);
      setSolutions(response.data);
    } catch (error) {
      setMessage('ไม่สามารถโหลดรายการเฉลยได้');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  const handleDelete = async (solutionId) => {
    if (!window.confirm('คุณต้องการลบเฉลยนี้หรือไม่?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/solutions/${solutionId}`);
      setMessage('ลบเฉลยสำเร็จแล้ว');
      fetchSolutions();
    } catch (error) {
      setMessage('เกิดข้อผิดพลาดในการลบเฉลย');
    }
  };

  const handleEdit = (solution) => {
    setEditingSolution(solution);
    setFormData({
      answer_text: solution.answer_text || '',
      answer_img: null
    });
    setImagePreview(null);
  };

  const handleCancelEdit = () => {
    setEditingSolution(null);
    setFormData({
      answer_text: '',
      answer_img: null
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
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setMessage('ไฟล์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)');
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage('ประเภทไฟล์ไม่รองรับ กรุณาใช้ JPG, PNG หรือ GIF');
        return;
      }
      setFormData(prev => ({
        ...prev,
        answer_img: file
      }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      answer_img: null
    }));
    setImagePreview(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const submitData = new FormData();
      // ต้องส่ง question_id ด้วย ตาม backend FastAPI
      if (editingSolution.question && editingSolution.question.id) {
        submitData.append('question_id', editingSolution.question.id);
      } else {
        setMessage('ไม่พบข้อมูล question_id ของโจทย์นี้ กรุณาตรวจสอบข้อมูลโจทย์ก่อนแก้ไขเฉลย');
        setLoading(false);
        return;
      }
      submitData.append('answer_text', formData.answer_text || '');
      if (formData.answer_img) {
        submitData.append('answer_img', formData.answer_img);
      }
      const response = await axios.put(`${API_BASE_URL}/solutions/${editingSolution.id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('แก้ไขเฉลยสำเร็จแล้ว!');
      handleCancelEdit();
      fetchSolutions();
    } catch (error) {
      console.error('Error updating solution:', error);
      let errMsg = 'เกิดข้อผิดพลาด: ';
      if (error.response) {
        if (error.response.status === 422 && error.response.data && error.response.data.detail) {
          // FastAPI validation error
          if (Array.isArray(error.response.data.detail)) {
            errMsg += error.response.data.detail.map(e => e.msg).join(', ');
          } else {
            errMsg += error.response.data.detail;
          }
        } else if (typeof error.response.data === 'string') {
          errMsg += error.response.data;
        } else if (error.response.data.message) {
          errMsg += error.response.data.message;
        } else {
          errMsg += JSON.stringify(error.response.data);
        }
      } else {
        errMsg += error.message || 'Network Error';
      }
      setMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const filteredSolutions = searchTerm.trim() === ''
    ? solutions
    : solutions.filter(solution => {
        const search = searchTerm.toLowerCase();
        return (
          (solution.question && (
            solution.question.book_id?.toLowerCase().includes(search) ||
            solution.question.page?.toString().includes(search) ||
            solution.question.question_no?.toString().includes(search)
          )) ||
          solution.answer_text?.toLowerCase().includes(search)
        );
      });

  const totalPages = Math.ceil(filteredSolutions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSolutions = filteredSolutions.slice(startIndex, endIndex);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🧮</span>
            </div>
            <h1 className="text-2xl font-bold text-white">จัดการเฉลยทั้งหมด</h1>
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
          <div className="p-8">
            {/* Search Bar */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="ค้นหาเฉลย (รหัสหนังสือ, หน้า, ข้อที่, หรือข้อความเฉลย)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
              />
            </div>

            {/* Edit Form Modal */}
            {editingSolution && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="max-w-2xl w-full max-h-screen overflow-y-auto mt-0">
                  <div className="bg-black rounded-2xl p-8">
                    <h3 className="text-xl font-bold text-white mb-4">แก้ไขเฉลย</h3>
                    <form onSubmit={handleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        คำตอบ (Answer Text)
                      </label>
                      <textarea
                        name="answer_text"
                        value={formData.answer_text}
                        onChange={handleInputChange}
                        rows="4"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                        placeholder="พิมพ์คำตอบที่นี่ (ถ้ามี)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/90 mb-2">
                        รูปภาพเฉลย (Answer Image)
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
              </div>
            )}

            {/* Solutions List */}
            <div className="mb-4 flex justify-between items-center">
              <p className="text-white/80">
                พบเฉลย {filteredSolutions.length} รายการ จากทั้งหมด {solutions.length} รายการ
                {filteredSolutions.length > 0 && (
                  <span className="ml-2 text-sm">
                    (แสดง {startIndex + 1}-{Math.min(endIndex, filteredSolutions.length)} จาก {filteredSolutions.length})
                  </span>
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-white/60 text-sm">
                  หน้า {currentPage} จาก {totalPages}
                </p>
              )}
            </div>

            {filteredSolutions.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                ไม่พบเฉลยในระบบ
              </div>
            ) : (
              currentSolutions.map((solution) => (
                <div key={solution.id} className="border border-white/20 bg-white/5 rounded-xl p-4 mb-4 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          {solution.question ? (
                            <>
                              <span className="font-bold">รหัสหนังสือ:</span> {solution.question.book_id || '-'}
                              {' '}<span className="font-bold">หน้า:</span> {solution.question.page || '-'}
                              {' '}<span className="font-bold">ข้อ:</span> {solution.question.question_no || '-'}
                            </>
                          ) : (
                            <span className="text-red-400">ไม่มีข้อมูลโจทย์</span>
                          )}
                        </h3>
                        <span className="text-sm text-white/60">
                          ID: {solution.id}
                        </span>
                        {solution.created_at && (
                          <span className="text-xs text-white/40">
                            📅 {new Date(solution.created_at).toLocaleString('th-TH')}
                          </span>
                        )}
                      </div>
                      {solution.answer_text && (
                        <p className="text-white/80 mb-3">
                          {solution.answer_text}
                        </p>
                      )}
                      {solution.answer_img && (
                        <div className="mb-3">
                          <img
                            src={getImageUrl(solution.answer_img)}
                            alt="Answer"
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
                        onClick={() => handleEdit(solution)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-xl text-sm hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(solution.id)}
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

export default AdminManageSolutions;