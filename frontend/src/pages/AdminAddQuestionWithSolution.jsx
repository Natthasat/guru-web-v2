import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api';

function AdminAddQuestionWithSolution() {
  const navigate = useNavigate();
  
  // โหลด Book ID ล่าสุดจาก localStorage
  const getLastBookId = () => {
    return localStorage.getItem('lastBookId') || '';
  };
  
  // Question Data
  const [questionData, setQuestionData] = useState({
    book_id: getLastBookId(),
    old_book_id: '',
    page: '',
    question_no: '',
    question_text: ''
  });
  const [questionImage, setQuestionImage] = useState(null);
  const [questionImagePreview, setQuestionImagePreview] = useState(null);

  // Solutions Data (รองรับหลายเฉลย)
  const [solutions, setSolutions] = useState([
    {
      title: 'วิธีที่ 1',
      answer_text: '',
      images: [],
      imagePreviews: []
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Auto scroll to top when message or error changes
  useEffect(() => {
    if (message || error) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [message, error]);

  // Handle Question Input Change
  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // บันทึก Book ID ลง localStorage เมื่อมีการเปลี่ยนแปลง
    if (name === 'book_id' && value.trim()) {
      localStorage.setItem('lastBookId', value.trim());
    }
  };

  // Handle Question Image
  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ตรวจสอบขนาดและประเภทไฟล์
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
      setError('⚠️ ไฟล์รูปโจทย์มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)');
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      setError('⚠️ ประเภทไฟล์ไม่รองรับ (ใช้ JPG, PNG, GIF เท่านั้น)');
      return;
    }

    setQuestionImage(file);
    setQuestionImagePreview(URL.createObjectURL(file));
    setError('');
  };

  // Handle Solution Input Change
  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...solutions];
    newSolutions[index][field] = value;
    setSolutions(newSolutions);
  };

  // Handle Solution Images
  const handleSolutionImagesChange = (index, e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      setError('⚠️ สามารถอัปโหลดได้สูงสุด 5 รูปต่อเฉลย');
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    
    for (const file of files) {
      if (file.size > maxSize) {
        setError(`⚠️ ไฟล์ ${file.name} มีขนาดใหญ่เกินไป (จำกัดที่ 5MB)`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`⚠️ ไฟล์ ${file.name} ประเภทไม่รองรับ`);
        return;
      }
    }

    const previews = files.map(file => URL.createObjectURL(file));
    
    const newSolutions = [...solutions];
    newSolutions[index].images = files;
    newSolutions[index].imagePreviews = previews;
    setSolutions(newSolutions);
    setError('');
  };

  // Remove Solution Image
  const removeSolutionImage = (solutionIndex, imageIndex) => {
    const newSolutions = [...solutions];
    newSolutions[solutionIndex].images = newSolutions[solutionIndex].images.filter((_, i) => i !== imageIndex);
    newSolutions[solutionIndex].imagePreviews = newSolutions[solutionIndex].imagePreviews.filter((_, i) => i !== imageIndex);
    setSolutions(newSolutions);
  };

  // Add New Solution
  const addSolution = () => {
    setSolutions([...solutions, {
      title: `วิธีที่ ${solutions.length + 1}`,
      answer_text: '',
      images: [],
      imagePreviews: []
    }]);
  };

  // Remove Solution
  const removeSolution = (index) => {
    if (solutions.length === 1) {
      setError('⚠️ ต้องมีอย่างน้อย 1 เฉลย');
      return;
    }
    const newSolutions = solutions.filter((_, i) => i !== index);
    setSolutions(newSolutions);
  };

  // Validate Form
  const validateForm = () => {
    if (!questionData.book_id || !questionData.page || !questionData.question_no) {
      setError('⚠️ กรุณากรอกข้อมูลโจทย์: รหัสหนังสือ, หน้า, ข้อที่');
      return false;
    }

    // ตรวจสอบว่าต้องมีอย่างน้อย 1 เฉลย
    const hasValidSolution = solutions.some(sol => 
      sol.answer_text.trim() || sol.images.length > 0
    );

    if (!hasValidSolution) {
      setError('⚠️ กรุณากรอกเฉลยอย่างน้อย 1 วิธี (ข้อความหรือรูปภาพ)');
      return false;
    }

    return true;
  };

  // Check if question already exists
  const checkQuestionExists = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/qa/${questionData.book_id}/${questionData.page}/${questionData.question_no}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // ถ้าเจอข้อมูล แสดงว่ามีอยู่แล้ว
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      // ถ้า error 404 แสดงว่าไม่มีข้อมูล (ไม่ซ้ำ)
      if (error.response?.status === 404) {
        return false;
      }
      // error อื่นๆ ให้ผ่านไป
      return false;
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      // ตรวจสอบความซ้ำก่อนบันทึก
      const isDuplicate = await checkQuestionExists();
      
      if (isDuplicate) {
        setError(`⚠️ โจทย์นี้มีอยู่ในระบบแล้ว!\n📚 Book ID: ${questionData.book_id}\n📄 หน้า: ${questionData.page}\n🔢 ข้อที่: ${questionData.question_no}\n\nกรุณาตรวจสอบข้อมูลอีกครั้ง`);
        setLoading(false);
        return;
      }

      // Step 1: สร้างโจทย์
      const questionFormData = new FormData();
      questionFormData.append('book_id', questionData.book_id);
      questionFormData.append('old_book_id', questionData.old_book_id || '');
      questionFormData.append('page', questionData.page);
      questionFormData.append('question_no', questionData.question_no);
      questionFormData.append('question_text', questionData.question_text || '');
      
      if (questionImage) {
        questionFormData.append('question_img', questionImage);
      }

      const questionResponse = await axios.post(
        `${API_BASE_URL}/questions`,
        questionFormData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const questionId = questionResponse.data.id;
      console.log('✅ สร้างโจทย์สำเร็จ ID:', questionId);

      // Step 2: สร้างเฉลยทั้งหมด
      for (const solution of solutions) {
        // ข้ามเฉลยที่ไม่มีข้อมูล
        if (!solution.answer_text.trim() && solution.images.length === 0) {
          continue;
        }

        // สร้างเฉลย
        const solutionFormData = new FormData();
        solutionFormData.append('title', solution.title);
        solutionFormData.append('answer_text', solution.answer_text);

        const solutionResponse = await axios.post(
          `${API_BASE_URL}/questions/${questionId}/solutions`,
          solutionFormData,
          {
            headers: { 
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        const solutionId = solutionResponse.data.id;
        console.log('✅ สร้างเฉลยสำเร็จ ID:', solutionId);

        // Step 3: อัปโหลดรูปภาพเฉลย (ถ้ามี)
        if (solution.images.length > 0) {
          const imageFormData = new FormData();
          solution.images.forEach(image => {
            imageFormData.append('images', image);
          });

          await axios.post(
            `${API_BASE_URL}/solutions/${solutionId}/images`,
            imageFormData,
            {
              headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          console.log('✅ อัปโหลดรูปเฉลยสำเร็จ');
        }
      }

      setMessage('🎉 เพิ่มโจทย์และเฉลยสำเร็จ! พร้อมเพิ่มโจทย์ถัดไป');
      
      // บันทึก Book ID ก่อนรีเซ็ตฟอร์ม
      const lastBookId = questionData.book_id;
      
      // รีเซ็ตฟอร์มทั้งหมด (แต่คง Book ID เดิมไว้)
      setQuestionData({
        book_id: lastBookId,
        old_book_id: '',
        page: '',
        question_no: '',
        question_text: ''
      });
      setQuestionImage(null);
      setQuestionImagePreview(null);
      setSolutions([{
        title: 'วิธีที่ 1',
        answer_text: '',
        images: [],
        imagePreviews: []
      }]);

      // ซ่อนข้อความสำเร็จหลัง 3 วินาที
      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || '❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="group flex items-center gap-2 text-white hover:text-purple-200 font-semibold transition-all duration-200 mb-4"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับไปหน้าหลัก
          </button>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-2xl shadow-lg">
                  <span className="text-4xl">📚</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    เพิ่มโจทย์พร้อมเฉลย
                  </h1>
                  <p className="text-white/70 text-sm mt-1">แบบครบจบในหน้าเดียว - ง่าย เร็ว ได้ผลลัพธ์</p>
                </div>
              </div>
            </div>

            {message && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 animate-pulse">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-green-800 font-semibold">{message}</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-800 font-semibold">{error}</span>
                </div>
              </div>
            )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ส่วนที่ 1: ข้อมูลโจทย์ */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                    <span className="text-2xl">📝</span>
                  </div>
                  <span>ส่วนที่ 1: ข้อมูลโจทย์</span>
                </h2>
              </div>
              
              <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-purple-300">📖</span>
                    รหัสหนังสือ (Book ID) *
                    {questionData.book_id && (
                      <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full ml-2">
                        💾 จำค่าล่าสุด
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="book_id"
                    value={questionData.book_id}
                    onChange={handleQuestionChange}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm"
                    placeholder="รหัสหนังสือ"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-purple-300">📚</span>
                    รหัสหนังสือเก่า (Old Book ID)
                  </label>
                  <input
                    type="text"
                    name="old_book_id"
                    value={questionData.old_book_id}
                    onChange={handleQuestionChange}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm"
                    placeholder="รหัสหนังสือเก่า (ถ้ามี)"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-purple-300">📄</span>
                    หน้า (Page) *
                  </label>
                  <input
                    type="number"
                    name="page"
                    value={questionData.page}
                    onChange={handleQuestionChange}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm"
                    placeholder="เลขหน้า"
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-white font-semibold">
                    <span className="text-purple-300">🔢</span>
                    ข้อที่ (Question No.) *
                  </label>
                  <input
                    type="number"
                    name="question_no"
                    value={questionData.question_no}
                    onChange={handleQuestionChange}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm"
                    placeholder="เลขข้อ"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="mb-6 space-y-2">
                <label className="flex items-center gap-2 text-white font-semibold">
                  <span className="text-purple-300">✏️</span>
                  โจทย์ (Text)
                </label>
                <textarea
                  name="question_text"
                  value={questionData.question_text}
                  onChange={handleQuestionChange}
                  rows="4"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm resize-none"
                  placeholder="ข้อความโจทย์ (ถ้ามี)"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-white font-semibold">
                  <span className="text-purple-300">🖼️</span>
                  รูปภาพโจทย์
                </label>
                <div className="border-2 border-dashed border-white/30 rounded-xl p-4 hover:border-purple-400 transition-all duration-200 bg-white/5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 cursor-pointer"
                  />
                </div>
                
                {questionImagePreview && (
                  <div className="mt-4 relative inline-block group">
                    <img 
                      src={questionImagePreview} 
                      alt="Question Preview" 
                      className="w-full max-w-md h-auto object-cover rounded-xl shadow-lg border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionImage(null);
                        setQuestionImagePreview(null);
                      }}
                      className="absolute top-3 right-3 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              </div>
            </div>

            {/* ส่วนที่ 2: เฉลย (รองรับหลายวิธี) */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border-2 border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div>
                      <span>ส่วนที่ 2: เฉลย</span>
                      <p className="text-sm text-white/80 font-normal mt-1">เพิ่มได้หลายวิธี ({solutions.length} วิธี)</p>
                    </div>
                  </h2>
                  <button
                    type="button"
                    onClick={addSolution}
                    className="bg-white text-green-600 px-5 py-2.5 rounded-xl hover:bg-green-50 font-semibold flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>เพิ่มเฉลย</span>
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">

              {solutions.map((solution, solutionIndex) => (
                <div key={solutionIndex} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-md border-2 border-white/20 hover:border-white/30 transition-all duration-200 overflow-hidden">
                  <div className="bg-white/10 p-4 flex justify-between items-center border-b-2 border-white/20">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg">
                        {solutionIndex + 1}
                      </span>
                      {solution.title}
                    </h3>
                    {solutions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSolution(solutionIndex)}
                        className="flex items-center gap-2 text-red-400 hover:text-white hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200 border border-red-400 hover:border-red-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        ลบ
                      </button>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-4">

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-emerald-300">🏷️</span>
                      ชื่อเฉลย
                    </label>
                    <input
                      type="text"
                      value={solution.title}
                      onChange={(e) => handleSolutionChange(solutionIndex, 'title', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm"
                      placeholder="เช่น วิธีที่ 1, วิธีกราฟ, วิธีแทนค่า"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-emerald-300">📖</span>
                      คำอธิบายเฉลย (Text)
                    </label>
                    <textarea
                      value={solution.answer_text}
                      onChange={(e) => handleSolutionChange(solutionIndex, 'answer_text', e.target.value)}
                      rows="4"
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm resize-none"
                      placeholder="อธิบายวิธีทำ..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-white font-semibold">
                      <span className="text-emerald-300">🖼️</span>
                      รูปภาพเฉลย (สูงสุด 5 รูป)
                    </label>
                    <div className="border-2 border-dashed border-white/30 rounded-xl p-4 hover:border-green-400 transition-all duration-200 bg-white/5">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleSolutionImagesChange(solutionIndex, e)}
                        className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500 file:text-white hover:file:bg-green-600 cursor-pointer"
                      />
                    </div>
                    
                    {solution.imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {solution.imagePreviews.map((preview, imageIndex) => (
                          <div key={imageIndex} className="relative group">
                            <img 
                              src={preview} 
                              alt={`Solution ${solutionIndex + 1} - Image ${imageIndex + 1}`} 
                              className="w-full h-32 object-cover rounded-xl shadow-md border-2 border-white/30 group-hover:border-green-400 transition-all duration-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-xl transition-all duration-200"></div>
                            <button
                              type="button"
                              onClick={() => removeSolutionImage(solutionIndex, imageIndex)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2 border-white/20">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span className="text-lg">กำลังบันทึก...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="text-lg">บันทึกโจทย์และเฉลย</span>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/dashboard')}
                className="sm:w-auto bg-white/20 text-white font-bold py-4 px-8 rounded-xl hover:bg-white/30 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>ยกเลิก</span>
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminAddQuestionWithSolution;
