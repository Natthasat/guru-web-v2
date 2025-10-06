import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

function AdminAddQuestion() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    book_id: '',
    old_book_id: '',
    page: '',
    question_no: '',
    question_text: '',
    question_img: null
  });

  // โหลดรหัสหนังสือจาก localStorage เมื่อ component mount
  useEffect(() => {
    const savedBookId = localStorage.getItem('lastBookId');
    if (savedBookId) {
      setFormData(prev => ({
        ...prev,
        book_id: savedBookId
      }));
    }
  }, []);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // บันทึกรหัสหนังสือลง localStorage เมื่อมีการเปลี่ยนแปลง
    if (name === 'book_id' && value.trim()) {
      localStorage.setItem('lastBookId', value.trim());
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // สร้าง FormData สำหรับอัปโหลดไฟล์
      const submitData = new FormData();
      submitData.append('book_id', formData.book_id);
      if (formData.old_book_id && formData.old_book_id.trim() !== '') {
        submitData.append('old_book_id', formData.old_book_id.trim());
        console.log('📘 Sending old_book_id:', formData.old_book_id.trim());
      } else {
        console.log('⚠️ old_book_id is empty, not sending to backend');
      }
      submitData.append('page', parseInt(formData.page));
      submitData.append('question_no', parseInt(formData.question_no));
      submitData.append('question_text', formData.question_text || '');
      
      if (formData.question_img) {
        submitData.append('question_img', formData.question_img);
      }

      const response = await axios.post(`${API_BASE_URL}/questions`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ เพิ่มโจทย์สำเร็จ:', response.data);
      setMessage('✅ เพิ่มโจทย์สำเร็จแล้ว!');
      
      // รีเซ็ตฟอร์ม (เว้น book_id และ old_book_id ไว้ให้ใช้ต่อ)
      setFormData(prev => ({
        book_id: prev.book_id,
        old_book_id: prev.old_book_id,
        page: '',
        question_no: '',
        question_text: '',
        question_img: null
      }));
      setImagePreview(null);
    } catch (error) {
      console.error('Error submitting question:', error);
      if (error.response) {
        setMessage('เกิดข้อผิดพลาด: ' + (error.response.data.detail || error.response.data.message || 'ไม่สามารถเพิ่มโจทย์ได้'));
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
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">➕</span>
            </div>
            <h1 className="text-2xl font-bold text-white">เพิ่มโจทย์ใหม่</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
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
                <span className="text-3xl">📝</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">เพิ่มโจทย์ใหม่</h2>
              <p className="text-white/70">กรอกข้อมูลโจทย์ที่ต้องการเพิ่ม</p>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  📚 รหัสหนังสือแบบใหม่ (Book ID) *
                  {localStorage.getItem('lastBookId') && (
                    <span className="text-xs text-white/60 ml-2">
                      (ล่าสุด: {localStorage.getItem('lastBookId')})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  name="book_id"
                  value={formData.book_id}
                  onChange={handleInputChange}
                  required
                  className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="เช่น IPL5203-1051"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/90 mb-2">
                  📖 รหัสหนังสือแบบเก่า (Old Book ID) 
                  <span className="text-xs text-white/60 ml-2">(ถ้ามี)</span>
                </label>
                <input
                  type="text"
                  name="old_book_id"
                  value={formData.old_book_id}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="เช่น 1710-0141"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    กำลังเพิ่มโจทย์...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    เพิ่มโจทย์
                  </>
                )}
              </button>

              {message && (
                <div className={`p-4 rounded-xl backdrop-blur-sm ${
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
            </form>
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

export default AdminAddQuestion;