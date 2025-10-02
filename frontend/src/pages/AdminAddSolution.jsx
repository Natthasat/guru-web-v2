  // Helper for correct image URL
import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

// Helper for correct image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  return `${IMAGE_BASE_URL}/${imagePath.replace(/^\/+/, '')}`;
};

function AdminAddSolution() {
  const [searchData, setSearchData] = useState({
    book_id: '',
    page: '',
    question_no: ''
  });
  const [recentBookIds, setRecentBookIds] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [answerImg, setAnswerImg] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const IMAGE_BASE_URL = 'http://localhost:8000';

  React.useEffect(() => {
    const savedBookIds = localStorage.getItem('recent_book_ids');
    const lastBookId = localStorage.getItem('last_book_id');
    
    if (savedBookIds) {
      setRecentBookIds(JSON.parse(savedBookIds));
    }
    
    if (lastBookId) {
      setSearchData(prev => ({
        ...prev,
        book_id: lastBookId
      }));
    }
  }, []);

  const handleSearchInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveBookIdToHistory = (bookId) => {
    if (!bookId.trim()) return;
    
    localStorage.setItem('last_book_id', bookId.trim());
    
    let recentIds = JSON.parse(localStorage.getItem('recent_book_ids') || '[]');
    recentIds = recentIds.filter(id => id !== bookId.trim());
    recentIds.unshift(bookId.trim());
    
    if (recentIds.length > 10) {
      recentIds = recentIds.slice(0, 10);
    }
    
    localStorage.setItem('recent_book_ids', JSON.stringify(recentIds));
    setRecentBookIds(recentIds);
  };

  const handleBookIdClick = (bookId) => {
    setSearchData(prev => ({
      ...prev,
      book_id: bookId
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

      setAnswerImg(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const removeImage = () => {
    setAnswerImg(null);
    setImagePreview(null);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSelectedQuestion(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/qa/${searchData.book_id}/${searchData.page}/${searchData.question_no}`);
      setSelectedQuestion(response.data);
      saveBookIdToHistory(searchData.book_id);
      setMessage('พบโจทย์แล้ว!');
    } catch (error) {
      console.error('Search error:', error);
      if (error.response && error.response.status === 404) {
        setMessage('ไม่พบโจทย์ที่ค้นหา กรุณาตรวจสอบข้อมูลอีกครั้ง');
      } else {
        setMessage('เกิดข้อผิดพลาดในการค้นหา');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!selectedQuestion) {
      setMessage('กรุณาค้นหาโจทย์ก่อนเพิ่มเฉลย');
      return;
    }

    if (!answerText.trim() && !answerImg) {
      setMessage('กรุณากรอกคำตอบหรืออัปโหลดรูปภาพคำตอบ');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('question_id', selectedQuestion.question.id);
      formData.append('answer_text', answerText || '');
      
      if (answerImg) {
        formData.append('answer_img', answerImg);
      }

      const response = await axios.post(`${API_BASE_URL}/solutions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('เพิ่มเฉลยสำเร็จแล้ว!');
      setAnswerText('');
      setAnswerImg(null);
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting solution:', error);
      if (error.response) {
        setMessage('เกิดข้อผิดพลาด: ' + (error.response.data.detail || error.response.data.message || 'ไม่สามารถเพิ่มเฉลยได้'));
      } else {
        setMessage('เกิดข้อผิดพลาด: Network Error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">✅</span>
            </div>
            <h1 className="text-2xl font-bold text-white">เพิ่มเฉลย</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-4xl w-full space-y-8">
          {/* Search Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
            {/* Back Button - Top Left */}
            <div className="mb-6">
              <button
                onClick={() => window.history.back()}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
              >
                <span>←</span>
                <span>กลับ</span>
              </button>
            </div>
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">🔍</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">ค้นหาโจทย์</h2>
              <p className="text-white/70">ค้นหาโจทย์ที่ต้องการเพิ่มเฉลย</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
            </div>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    📚 รหัสหนังสือ (Book ID) *
                  </label>
                  <input
                    type="text"
                    name="book_id"
                    value={searchData.book_id}
                    onChange={handleSearchInputChange}
                    className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="เช่น MATH-101"
                    required
                  />
                  
                  {/* Recent Book IDs */}
                  {recentBookIds.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-white/60 mb-2">รหัสหนังสือล่าสุด:</p>
                      <div className="flex flex-wrap gap-2">
                        {recentBookIds.slice(0, 5).map((bookId, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleBookIdClick(bookId)}
                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 hover:text-white px-3 py-1 rounded-lg text-xs border border-blue-400/30 transition-all duration-200"
                          >
                            {bookId}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    📄 หน้า (Page) *
                  </label>
                  <input
                    type="number"
                    name="page"
                    value={searchData.page}
                    onChange={handleSearchInputChange}
                    className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="เช่น 25"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    🔢 ข้อที่ (Question No.) *
                  </label>
                  <input
                    type="number"
                    name="question_no"
                    value={searchData.question_no}
                    onChange={handleSearchInputChange}
                    className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="เช่น 1"
                    min="1"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังค้นหา...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🔍</span>
                    ค้นหาโจทย์
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Selected Question Display */}
          {selectedQuestion && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">โจทย์ที่พบ</h3>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-400/30">
                    <span className="text-blue-200">📚 รหัสหนังสือ:</span>
                    <span className="text-white font-medium ml-2">{selectedQuestion.question.book_id}</span>
                  </div>
                  <div className="bg-green-500/20 rounded-lg p-3 border border-green-400/30">
                    <span className="text-green-200">📄 หน้า:</span>
                    <span className="text-white font-medium ml-2">{selectedQuestion.question.page}</span>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-400/30">
                    <span className="text-purple-200">🔢 ข้อที่:</span>
                    <span className="text-white font-medium ml-2">{selectedQuestion.question.question_no}</span>
                  </div>
                </div>

                {selectedQuestion.question.question_text && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">📝 ข้อความโจทย์:</h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <p className="text-white/90">{selectedQuestion.question.question_text}</p>
                    </div>
                  </div>
                )}

                {selectedQuestion.question.question_img && (
                  <div className="mb-4">
                    <h4 className="text-white font-medium mb-2">🖼️ รูปภาพโจทย์:</h4>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <img
                        src={getImageUrl(selectedQuestion.question.question_img)}
                        alt="Question"
                        className="max-w-full h-auto rounded-lg border border-white/20"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  </div>
                )}

                {selectedQuestion.solution && (
                  <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-400/30">
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-300 mr-2">⚠️</span>
                      <h4 className="text-yellow-200 font-medium">โจทย์นี้มีเฉลยอยู่แล้ว</h4>
                    </div>
                    <p className="text-yellow-100 text-sm">การเพิ่มเฉลยใหม่จะแทนที่เฉลยเก่า</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add Solution Form */}
          {selectedQuestion && (
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">✅</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">เพิ่มเฉลย</h2>
                <p className="text-white/70">กรอกเฉลยสำหรับโจทย์ที่เลือก</p>
                <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mt-4"></div>
              </div>

              <form onSubmit={handleSubmitSolution} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    ✏️ คำตอบ (ข้อความ)
                  </label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows="6"
                    className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 resize-none"
                    placeholder="พิมพ์คำตอบที่นี่..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    🖼️ รูปภาพคำตอบ
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      onChange={handleImageChange}
                      accept="image/jpeg,image/jpg,image/png,image/gif"
                      className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-500 file:text-white hover:file:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    />

                    {imagePreview && (
                      <div className="relative bg-white/5 rounded-xl p-4 border border-white/20">
                        <img
                          src={imagePreview}
                          alt="Answer Preview"
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

                <button
                  type="submit"
                  disabled={loading || (!answerText.trim() && !answerImg)}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">💾</span>
                      บันทึกเฉลย
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Message Display */}
          {message && (
            <div className={`p-4 rounded-xl backdrop-blur-sm ${
              message.includes('สำเร็จ') || message.includes('พบโจทย์')
                ? 'bg-green-500/20 border border-green-400/30' 
                : 'bg-red-500/20 border border-red-400/30'
            }`}>
              <div className="flex items-center">
                <span className={`mr-2 ${
                  message.includes('สำเร็จ') || message.includes('พบโจทย์') 
                    ? 'text-green-300' 
                    : 'text-red-300'
                }`}>
                  {message.includes('สำเร็จ') || message.includes('พบโจทย์') ? '✅' : '⚠️'}
                </span>
                <p className={`text-sm ${
                  message.includes('สำเร็จ') || message.includes('พบโจทย์')
                    ? 'text-green-200' 
                    : 'text-red-200'
                }`}>
                  {message}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-green-400/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 right-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
    </div>
  );
}

export default AdminAddSolution;