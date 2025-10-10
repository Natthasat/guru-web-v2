import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // ใช้ axios instance ที่มี interceptor
import QuestionImageCard from '../components/QuestionImageCard';
import SolutionCard from '../components/SolutionCard';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminDashboard() {
  const navigate = useNavigate();
  const [searchForm, setSearchForm] = useState({
    book_id: '',
    page: '',
    question_no: ''
  });
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Course Decoder State
  const [courseCode, setCourseCode] = useState('');
  const [decodedResult, setDecodedResult] = useState(null);
  const [decodeLoading, setDecodeLoading] = useState(false);
  const [decodeMessage, setDecodeMessage] = useState('');

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

  const handleDecodeCourse = async (e) => {
    e.preventDefault();
    setDecodeLoading(true);
    setDecodeMessage('');
    setDecodedResult(null);

    try {
      if (!courseCode.trim()) {
        setDecodeMessage('กรุณากรอกรหัสวิชา');
        setDecodeLoading(false);
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/course/decode`, {
        code: courseCode.trim()
      });

      if (response.data.success) {
        setDecodedResult(response.data);
        setDecodeMessage('ถอดรหัสสำเร็จ!');
      } else {
        setDecodeMessage(response.data.error || 'ไม่สามารถถอดรหัสได้');
      }
    } catch (error) {
      console.error('Decode error:', error);
      setDecodeMessage('เกิดข้อผิดพลาด: ' + (error.response?.data?.detail || error.message));
    } finally {
      setDecodeLoading(false);
    }
  };

  const clearDecoder = () => {
    setCourseCode('');
    setDecodedResult(null);
    setDecodeMessage('');
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  // Get current username from localStorage
  const currentUsername = localStorage.getItem('username') || '';
  const isAdmin = currentUsername.toLowerCase() === 'admin';

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
            <span className="text-white/80">{currentUsername}</span>
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
            <h2 className="text-4xl font-bold text-white mb-4">จัดการโจทย์และเฉลย</h2>
            <p className="text-white/80 text-lg">เลือกเมนูที่ต้องการจัดการ</p>
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
                    placeholder="รหัสหนังสือ"
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
                    placeholder="เลขหน้า"
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
                    placeholder="เลขข้อ"
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
                
                {/* Question - ใช้ Component ใหม่ */}
                <div className="bg-blue-500/10 rounded-xl p-6 border border-blue-400/30">
                  <h5 className="text-lg font-semibold text-blue-200 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    โจทย์: {searchResult.question.book_id} หน้า {searchResult.question.page} ข้อ {searchResult.question.question_no}
                  </h5>
                  
                  <QuestionImageCard
                    imageSrc={searchResult.question.question_img ? getImageUrl(searchResult.question.question_img) : null}
                    imageAlt="Question"
                    questionText={searchResult.question.question_text}
                    size="large"
                  />
                </div>

                {/* Solutions - ใช้ Component ใหม่ */}
                {searchResult.solutions && searchResult.solutions.length > 0 ? (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-green-200 flex items-center">
                      <span className="mr-2">✅</span>
                      เฉลย ({searchResult.solutions.length} ชุด)
                    </h5>
                    
                    {searchResult.solutions.map((solution, idx) => (
                      <SolutionCard
                        key={solution.id}
                        solution={solution}
                        solutionIndex={idx}
                        getImageUrl={getImageUrl}
                        showDelete={false}
                        imageSize="medium"
                        gridCols={2}
                      />
                    ))}
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

          {/* Course Code Decoder Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">🔐 ถอดรหัสวิชา (Course Decoder)</h3>
            
            <form onSubmit={handleDecodeCourse} className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <label className="block text-sm font-medium text-white mb-2">
                  📋 รหัสวิชา (ตัวอย่าง: AABCCDEE-FFGG)
                </label>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="กรอกรหัสวิชา"
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm transition-all duration-200 uppercase"
                  />
                  <button
                    type="submit"
                    disabled={decodeLoading}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 whitespace-nowrap"
                  >
                    {decodeLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>กำลังถอด...</span>
                      </>
                    ) : (
                      <>
                        <span>🔓</span>
                        <span>ถอดรหัส</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearDecoder}
                    className="bg-gray-500/80 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 whitespace-nowrap"
                  >
                    ล้าง
                  </button>
                </div>
              </div>
            </form>

            {/* Decode Results */}
            {decodedResult && (
              <div className="mt-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
                  <h4 className="text-xl font-bold text-purple-200 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    ผลการถอดรหัส: {decodedResult.code}
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Teacher */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">👨‍🏫 อาจารย์</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.teacher_name || decodedResult.teacher_code}
                      </div>
                      <div className="text-purple-200 text-sm mt-1">
                        รหัส: {decodedResult.teacher_code}
                      </div>
                    </div>

                    {/* Course Type */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">📚 ประเภทคอร์ส</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.course_type_name || decodedResult.course_type}
                      </div>
                      <div className="text-purple-200 text-sm mt-1">
                        รหัส: {decodedResult.course_type}
                      </div>
                    </div>

                    {/* Year */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">📅 ปี</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.year}
                      </div>
                    </div>

                    {/* Level */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">📊 ระดับ</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.level_name || `Level ${decodedResult.level}`}
                      </div>
                      <div className="text-purple-200 text-sm mt-1">
                        รหัส: {decodedResult.level}
                      </div>
                    </div>

                    {/* Category */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">🏷️ หมวดหมู่</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.category}
                      </div>
                    </div>

                    {/* Chapter */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="text-purple-300 text-sm mb-1">📖 บท</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.chapter}
                      </div>
                    </div>

                    {/* File Type */}
                    <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm col-span-1 md:col-span-2">
                      <div className="text-purple-300 text-sm mb-1">📄 ประเภทไฟล์</div>
                      <div className="text-white font-semibold text-lg">
                        {decodedResult.file_type_name || decodedResult.file_type}
                      </div>
                      <div className="text-purple-200 text-sm mt-1">
                        รหัส: {decodedResult.file_type}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  {decodedResult.explanation && (
                    <div className="mt-4 bg-purple-500/10 rounded-lg p-4 border border-purple-400/20">
                      <div className="text-purple-300 text-sm mb-2">💡 คำอธิบาย</div>
                      <div className="text-white whitespace-pre-wrap">
                        {decodedResult.explanation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Decode Message */}
            {decodeMessage && (
              <div className={`mt-4 p-4 rounded-xl backdrop-blur-sm max-w-2xl mx-auto ${
                decodeMessage.includes('สำเร็จ') 
                  ? 'bg-green-500/20 border border-green-400/30' 
                  : 'bg-red-500/20 border border-red-400/30'
              }`}>
                <div className="flex items-center">
                  <span className={`mr-2 ${decodeMessage.includes('สำเร็จ') ? 'text-green-300' : 'text-red-300'}`}>
                    {decodeMessage.includes('สำเร็จ') ? '✅' : '⚠️'}
                  </span>
                  <p className={`text-sm ${decodeMessage.includes('สำเร็จ') ? 'text-green-200' : 'text-red-200'}`}>
                    {decodeMessage}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Management Cards - 2x2 Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto">
            {/* Add Question with Solution - Combined */}
            <div 
              onClick={() => window.location.href = '/admin/add-question-with-solution'}
              className="bg-gradient-to-br from-violet-600/30 to-purple-600/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-violet-400/50 hover:border-violet-300/70 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] shadow-lg hover:shadow-violet-500/30"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-white text-3xl">✏️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">เพิ่มโจทย์+เฉลย</h3>
                <p className="text-violet-200 font-medium"></p>
              </div>
            </div>

            {/* Manage Questions Advanced */}
            <div 
              onClick={() => window.location.href = '/admin/manage-questions-advanced'}
              className="bg-gradient-to-br from-emerald-600/30 to-teal-600/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-emerald-400/50 hover:border-emerald-300/70 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] shadow-lg hover:shadow-emerald-500/30"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                  <span className="text-white text-3xl">📊</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">จัดการโจทย์</h3>
                <p className="text-emerald-200 font-medium text-sm"></p>
              </div>
            </div>

            {/* Manage Users - Only show for admin */}
            {isAdmin ? (
              <div 
                onClick={() => window.location.href = '/admin/manage-users'}
                className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/50 hover:border-purple-300/70 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/30"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-white text-3xl">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">จัดการผู้ใช้</h3>
                  <p className="text-purple-200 font-medium"></p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-500/30 opacity-50 cursor-not-allowed">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <span className="text-white text-3xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">จัดการผู้ใช้</h3>
                  <p className="text-gray-300 font-medium text-sm">เฉพาะ Admin</p>
                </div>
              </div>
            )}
            
            {/* Manage Teachers - Only show for admin */}
            {isAdmin ? (
              <div 
                onClick={() => window.location.href = '/admin/manage-teachers'}
                className="bg-gradient-to-br from-orange-600/30 to-red-600/30 backdrop-blur-sm rounded-2xl p-8 border-2 border-orange-400/50 hover:border-orange-300/70 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02] shadow-lg hover:shadow-orange-500/30"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <span className="text-white text-3xl">👨‍🏫</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">จัดการข้อมูลครู</h3>
                  <p className="text-orange-200 font-medium">Course Decoder</p>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-600/20 to-gray-700/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-gray-500/30 opacity-50 cursor-not-allowed">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                    <span className="text-white text-3xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">จัดการข้อมูลครู</h3>
                  <p className="text-gray-300 font-medium text-sm">เฉพาะ Admin</p>
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

export default AdminDashboard;