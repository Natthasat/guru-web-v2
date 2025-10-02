import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminDashboard() {
  const [searchForm, setSearchForm] = useState({
    book_id: '',
    page: '',
    question_no: ''
  });
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSearchResult(null);

    try {
      const { book_id, page, question_no } = searchForm;
      
      if (!book_id || !page || !question_no) {
        setMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/qa/${book_id}/${page}/${question_no}`);
      setSearchResult(response.data);
      setMessage('ค้นหาสำเร็จ!');
    } catch (error) {
      console.error('Search error:', error);
      if (error.response?.status === 404) {
        setMessage('ไม่พบโจทย์ที่ค้นหา');
      } else {
        setMessage('เกิดข้อผิดพลาดในการค้นหา: ' + (error.response?.data?.detail || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchForm({
      book_id: '',
      page: '',
      question_no: ''
    });
    setSearchResult(null);
    setMessage('');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">👨‍💼</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Guru Web Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">สวัสดี admin</span>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
            >
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-4">ระบบจัดการโจทย์และเฉลย</h2>
            <p className="text-white/80 text-lg">เลือกเมนูที่ต้องการจัดการ</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Questions Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">📄</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">1</h3>
                  <p className="text-white/70">โจทย์ทั้งหมด</p>
                </div>
              </div>
            </div>

            {/* Solutions Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-2xl">✅</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">1</h3>
                  <p className="text-white/70">เฉลยทั้งหมด</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Form Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🔍 ค้นหาโจทย์สำหรับทดสอบ</h3>
            
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    📚 รหัสหนังสือ (Book ID)
                  </label>
                  <input
                    type="text"
                    name="book_id"
                    value={searchForm.book_id}
                    onChange={handleInputChange}
                    placeholder="เช่น IPL25122-0652"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    📄 หน้า (Page)
                  </label>
                  <input
                    type="number"
                    name="page"
                    value={searchForm.page}
                    onChange={handleInputChange}
                    placeholder="เช่น 5"
                    min="1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    🔢 ข้อที่ (Question No.)
                  </label>
                  <input
                    type="number"
                    name="question_no"
                    value={searchForm.question_no}
                    onChange={handleInputChange}
                    placeholder="เช่น 2"
                    min="1"
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex space-x-4 justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>กำลังค้นหา...</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>ค้นหาโจทย์</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-gray-500/80 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  ล้างข้อมูล
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResult && (
              <div className="mt-8 space-y-6">
                <h4 className="text-xl font-bold text-white border-b border-white/30 pb-2">ผลการค้นหา</h4>
                
                {/* Question */}
                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
                  <h5 className="text-lg font-semibold text-blue-200 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    โจทย์: {searchResult.question.book_id} หน้า {searchResult.question.page} ข้อ {searchResult.question.question_no}
                  </h5>
                  
                  {searchResult.question.question_text && (
                    <div className="mb-4">
                      <p className="text-white/90 text-base leading-relaxed">
                        {searchResult.question.question_text}
                      </p>
                    </div>
                  )}
                  
                  {searchResult.question.question_img && (
                    <div className="mb-4">
                      <img
                        src={getImageUrl(searchResult.question.question_img)}
                        alt="Question"
                        className="max-w-full h-auto rounded-lg border border-white/30 shadow-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Solution */}
                {searchResult.solution ? (
                  <div className="bg-green-500/10 rounded-xl p-6 border border-green-400/30">
                    <h5 className="text-lg font-semibold text-green-200 mb-4 flex items-center">
                      <span className="mr-2">✅</span>
                      เฉลย
                    </h5>
                    
                    {searchResult.solution.answer_text && (
                      <div className="mb-4">
                        <p className="text-white/90 text-base leading-relaxed">
                          {searchResult.solution.answer_text}
                        </p>
                      </div>
                    )}
                    
                    {searchResult.solution.answer_img && (
                      <div className="mb-4">
                        <img
                          src={getImageUrl(searchResult.solution.answer_img)}
                          alt="Answer"
                          className="max-w-full h-auto rounded-lg border border-white/30 shadow-lg"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-400/30 text-center">
                    <p className="text-yellow-200 flex items-center justify-center">
                      <span className="mr-2">⚠️</span>
                      ยังไม่มีเฉลยสำหรับโจทย์นี้
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm ${
                message.includes('สำเร็จ') || message.includes('ค้นหาสำเร็จ') 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-red-500/20 border border-red-400/30'
              }`}>
                <div className="flex items-center">
                  <span className={`mr-2 ${message.includes('สำเร็จ') || message.includes('ค้นหาสำเร็จ') ? 'text-green-300' : 'text-red-300'}`}>
                    {message.includes('สำเร็จ') || message.includes('ค้นหาสำเร็จ') ? '✅' : '⚠️'}
                  </span>
                  <p className={`text-sm ${message.includes('สำเร็จ') || message.includes('ค้นหาสำเร็จ') ? 'text-green-200' : 'text-red-200'}`}>
                    {message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Management Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Add Question */}
            <div 
              onClick={() => window.location.href = '/admin/add-question'}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">➕</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">เพิ่มโจทย์</h3>
                <p className="text-white/70">เพิ่มโจทย์ใหม่ลงในระบบ</p>
              </div>
            </div>

            {/* Add Solution */}
            <div 
              onClick={() => window.location.href = '/admin/add-solution'}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">✅</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">เพิ่มเฉลย</h3>
                <p className="text-white/70">เพิ่มเฉลยให้กับโจทย์ที่มีอยู่</p>
              </div>
            </div>
          </div>

          {/* Management Cards Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manage Questions */}
            <div 
              onClick={() => window.location.href = '/admin/manage-questions'}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">📄</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">จัดการโจทย์</h3>
                <p className="text-white/70">แก้ไข ลบ และจัดการโจทย์</p>
              </div>
            </div>

            {/* Manage Solutions */}
            <div 
              onClick={() => window.location.href = '/admin/manage-solutions'}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-3xl">🔧</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">จัดการเฉลย</h3>
                <p className="text-white/70">แก้ไข ลบ และจัดการเฉลย</p>
              </div>
            </div>
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

export default AdminDashboard;