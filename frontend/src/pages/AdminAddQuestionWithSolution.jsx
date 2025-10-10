import React, { useState, useEffect } from 'react';
import axios from '../utils/axios'; // ใช้ axios instance ที่มี interceptor
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
      teacher_name: '',
      images: [],
      imagePreviews: []
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Solution Search Modal (รวม search + list เป็นอันเดียว)
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allSolutions, setAllSolutions] = useState([]); // เก็บเฉลยทั้งหมดที่แสดง
  const [filteredSolutions, setFilteredSolutions] = useState([]); // เฉลยหลังกรอง
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(null);
  const [allSolutionsPage, setAllSolutionsPage] = useState(1);
  const [allSolutionsTotal, setAllSolutionsTotal] = useState(0);
  const [allSolutionsTotalPages, setAllSolutionsTotalPages] = useState(0);
  const [allSolutionsLoading, setAllSolutionsLoading] = useState(false);

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
      teacher_name: '',
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

  // Realtime search/filter solutions
  const handleSearchKeywordChange = (keyword) => {
    setSearchKeyword(keyword);
    
    // ถ้าไม่มีคำค้นหา แสดงทั้งหมด
    if (!keyword || keyword.trim() === '') {
      setFilteredSolutions(allSolutions);
      return;
    }
    
    // กรองเฉลยตามคำค้นหา (search ใน answer_text, teacher_name, title)
    const searchLower = keyword.toLowerCase();
    const filtered = allSolutions.filter(solution => {
      const answerMatch = solution.answer_text?.toLowerCase().includes(searchLower);
      const teacherMatch = solution.teacher_name?.toLowerCase().includes(searchLower);
      const titleMatch = solution.title?.toLowerCase().includes(searchLower);
      return answerMatch || teacherMatch || titleMatch;
    });
    
    setFilteredSolutions(filtered);
  };

  // Copy solution from search results
  const handleCopySolution = async (searchedSolution) => {
    try {
      const token = localStorage.getItem('token');
      
      // ดึงรูปภาพของเฉลยที่เลือก
      const imageUrls = searchedSolution.images.map(img => 
        `http://localhost:8000/${img.image_path}`
      );

      // คัดลอกข้อมูลเฉลยไปยัง solution ปัจจุบัน
      const newSolutions = [...solutions];
      const imageCount = imageUrls.length;
      newSolutions[currentSolutionIndex] = {
        ...newSolutions[currentSolutionIndex],
        answer_text: searchedSolution.answer_text || '',
        teacher_name: searchedSolution.teacher_name || '',
        copiedImageUrls: imageUrls, // เก็บ URL รูปภาพที่จะดาวน์โหลดภายหลัง
        copiedFromSolutionId: searchedSolution.id,
        copiedMessage: `✅ คัดลอกเฉลยสำเร็จ!\n📝 คำอธิบาย: ${searchedSolution.answer_text?.substring(0, 50)}...\n📸 รูปภาพ: ${imageCount} รูป\n💡 รูปภาพจะถูกดาวน์โหลดและบันทึกอัตโนมัติเมื่อคุณกดปุ่ม "บันทึกโจทย์และเฉลย"`
      };

      setSolutions(newSolutions);
      setShowSearchModal(false);
      setSearchKeyword('');
      setFilteredSolutions([]);
      setAllSolutions([]);
    } catch (error) {
      console.error('Error copying solution:', error);
      setError('❌ เกิดข้อผิดพลาดในการคัดลอกเฉลย');
    }
  };

  // Load all solutions with pagination
  const loadAllSolutions = async (page = 1) => {
    setAllSolutionsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/solutions/list`,
        {
          params: { page, limit: 10 }, // เพิ่มเป็น 10 รายการต่อหน้า
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const solutions = response.data.solutions;
      setAllSolutions(solutions);
      setFilteredSolutions(solutions); // เริ่มต้นแสดงทั้งหมด
      setAllSolutionsTotal(response.data.total);
      setAllSolutionsTotalPages(response.data.total_pages);
      setAllSolutionsPage(page);
    } catch (error) {
      console.error('Error loading all solutions:', error);
      setError('❌ เกิดข้อผิดพลาดในการโหลดรายการเฉลย');
    } finally {
      setAllSolutionsLoading(false);
    }
  };

  // Open search modal for specific solution
  const openSearchModal = (solutionIndex) => {
    setCurrentSolutionIndex(solutionIndex);
    setShowSearchModal(true);
    setSearchKeyword('');
    loadAllSolutions(1); // โหลดหน้าแรก
  };

  // Validate Form
  const validateForm = () => {
    if (!questionData.book_id || !questionData.page || !questionData.question_no) {
      setError('⚠️ กรุณากรอกข้อมูลโจทย์: รหัสหนังสือ, หน้า, ข้อที่');
      return false;
    }

    // ตรวจสอบว่าถ้ามีรูปภาพเฉลย ต้องกรอกชื่อครู
    for (let i = 0; i < solutions.length; i++) {
      const solution = solutions[i];
      if (solution.images.length > 0 && !solution.teacher_name?.trim()) {
        setError(`⚠️ เฉลย "${solution.title}" มีรูปภาพแนบ กรุณากรอกชื่อครูผู้ให้เฉลย`);
        return false;
      }
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
          headers: { Authorization: `Bearer ${token}` },
          validateStatus: function (status) {
            // ถือว่า 404 เป็น response ที่ถูกต้อง (ไม่ throw error)
            return status < 500;
          }
        }
      );
      
      // ถ้า status 404 แสดงว่าไม่มีข้อมูล (ไม่ซ้ำ)
      if (response.status === 404) {
        return false;
      }
      
      // ถ้าเจอข้อมูล (status 200) แสดงว่ามีอยู่แล้ว
      if (response.data) {
        return true;
      }
      return false;
    } catch (error) {
      // error อื่นๆ (เช่น network error) ให้ผ่านไป
      console.error('Error checking question:', error);
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
      for (let solutionIndex = 0; solutionIndex < solutions.length; solutionIndex++) {
        const solution = solutions[solutionIndex];
        
        // ข้ามเฉลยที่ไม่มีข้อมูล
        if (!solution.answer_text.trim() && solution.images.length === 0) {
          continue;
        }

        // สร้างเฉลย
        const solutionFormData = new FormData();
        solutionFormData.append('title', solution.title);
        solutionFormData.append('answer_text', solution.answer_text);
        
        // ส่งชื่อครูผู้ให้เฉลย (ถ้ามี)
        if (solution.teacher_name && solution.teacher_name.trim()) {
          solutionFormData.append('teacher_name', solution.teacher_name.trim());
        }

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
        const imagesToUpload = [];
        
        // 3.1: ดาวน์โหลดรูปจาก copiedImageUrls (ถ้ามีการคัดลอกเฉลย)
        if (solution.copiedImageUrls && solution.copiedImageUrls.length > 0) {
          console.log(`📥 กำลังดาวน์โหลดรูป ${solution.copiedImageUrls.length} รูปจากเฉลยที่คัดลอก...`);
          
          for (let i = 0; i < solution.copiedImageUrls.length; i++) {
            const imageUrl = solution.copiedImageUrls[i];
            try {
              // ดาวน์โหลดรูปภาพเป็น Blob
              const response = await fetch(imageUrl);
              const blob = await response.blob();
              
              // สร้าง File object จาก Blob
              const filename = imageUrl.split('/').pop();
              const file = new File([blob], filename, { type: blob.type });
              
              imagesToUpload.push(file);
              console.log(`  ✅ ดาวน์โหลด ${filename} สำเร็จ`);
            } catch (downloadError) {
              console.error(`  ❌ ไม่สามารถดาวน์โหลดรูปภาพจาก ${imageUrl}:`, downloadError);
            }
          }
        }
        
        // 3.2: เพิ่มรูปที่ user เลือกเอง
        if (solution.images.length > 0) {
          imagesToUpload.push(...solution.images);
        }
        
        // 3.3: อัปโหลดรูปทั้งหมด
        if (imagesToUpload.length > 0) {
          const imageFormData = new FormData();
          imagesToUpload.forEach(image => {
            imageFormData.append('images', image);
          });
          
          // ส่ง page, question_no และ solution_index ไปด้วยเพื่อใช้ในการตั้งชื่อไฟล์
          imageFormData.append('page', questionData.page);
          imageFormData.append('question_no', questionData.question_no);
          imageFormData.append('solution_index', solutionIndex + 1);

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
          console.log(`✅ อัปโหลดรูปเฉลยวิธีที่ ${solutionIndex + 1} สำเร็จ (${imagesToUpload.length} รูป)`);
        }
      }

      setMessage('🎉 เพิ่มโจทย์และเฉลยสำเร็จ! กำลังรีโหลดหน้าใหม่...');
      
      // บันทึก Book ID ลง localStorage เพื่อใช้หลังรีโหลด
      localStorage.setItem('lastBookId', questionData.book_id);

      // รีโหลดหน้าหลัง 1.5 วินาที
      setTimeout(() => {
        window.location.reload();
      }, 1500);

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
                  <div className="mt-4 relative bg-gray-900/50 rounded-xl p-2" style={{ height: '192px', maxWidth: '400px' }}>
                    <img 
                      src={questionImagePreview} 
                      alt="Question Preview" 
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setQuestionImage(null);
                        setQuestionImagePreview(null);
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200 opacity-90 hover:opacity-100"
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
                      <span>ส่วนที่ 2: เฉลย (ไม่บังคับ)</span>
                      <p className="text-sm text-white/80 font-normal mt-1">เพิ่มได้หลายวิธี ({solutions.length} วิธี) - สามารถข้ามและเพิ่มทีหลังได้</p>
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
              
              {/* คำแนะนำ */}
              <div className="bg-blue-500/20 border-2 border-blue-400/40 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-white font-semibold mb-1">💡 คำแนะนำ:</p>
                    <p className="text-white/80 text-sm">
                      ไม่จำเป็นต้องกรอกเฉลยตอนนี้ สามารถบันทึกเฉพาะโจทย์ แล้วค่อยมาเพิ่มเฉลยในหน้า "จัดการโจทย์ (ขั้นสูง)" ภายหลังได้
                    </p>
                  </div>
                </div>
              </div>

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

                  {/* แสดงข้อความแจ้งเตือนเมื่อคัดลอกเฉลยสำเร็จ */}
                  {solution.copiedMessage && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 animate-pulse">
                      <div className="flex items-start gap-3">
                        <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-green-800 font-semibold whitespace-pre-line">{solution.copiedMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newSolutions = [...solutions];
                            delete newSolutions[solutionIndex].copiedMessage;
                            setSolutions(newSolutions);
                          }}
                          className="text-green-600 hover:text-green-800 flex-shrink-0"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 text-white font-semibold">
                        <span className="text-emerald-300">📖</span>
                        คำอธิบายเฉลย (Text)
                      </label>
                      <button
                        type="button"
                        onClick={() => openSearchModal(solutionIndex)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>ค้นหาเฉลยที่มีอยู่</span>
                      </button>
                    </div>
                    <textarea
                      value={solution.answer_text}
                      onChange={(e) => handleSolutionChange(solutionIndex, 'answer_text', e.target.value)}
                      rows="4"
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 hover:border-white/50 backdrop-blur-sm resize-none"
                      placeholder="อธิบายวิธีทำ... หรือคลิก 'ค้นหาเฉลยที่มีอยู่' เพื่อใช้เฉลยซ้ำ"
                    />
                    {solution.copiedFromSolutionId && (
                      <p className="text-yellow-300 text-sm flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        คัดลอกจากเฉลย ID: {solution.copiedFromSolutionId}
                      </p>
                    )}
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
                      <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {solution.imagePreviews.map((preview, imageIndex) => (
                            <div key={imageIndex} className="relative group bg-gray-900/50 rounded-xl p-2">
                              <img 
                                src={preview} 
                                alt={`Solution ${solutionIndex + 1} - Image ${imageIndex + 1}`} 
                                className="w-full h-48 object-contain rounded-xl shadow-md group-hover:shadow-xl transition-all duration-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeSolutionImage(solutionIndex, imageIndex)}
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 shadow-lg transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* ชื่อครูผู้ให้เฉลย - แสดงเฉพาะเมื่อมีรูปภาพ (บังคับกรอก) */}
                        <div className="space-y-2 mt-4 bg-green-500/10 border-2 border-green-400/30 rounded-xl p-4">
                          <label className="flex items-center gap-2 text-white font-semibold">
                            <span className="text-emerald-300">👨‍🏫</span>
                            ชื่อครูผู้ให้เฉลย
                            <span className="text-red-400 ml-1">*</span>
                            <span className="text-xs text-green-300 bg-green-500/20 px-2 py-1 rounded-full ml-2">
                              📸 มีรูปภาพแนบ
                            </span>
                          </label>
                          <input
                            type="text"
                            value={solution.teacher_name}
                            onChange={(e) => handleSolutionChange(solutionIndex, 'teacher_name', e.target.value)}
                            className="w-full bg-white/10 border-2 border-green-400/50 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200 hover:border-green-400/70 backdrop-blur-sm"
                            placeholder="ชื่อครูผู้ให้เฉลย"
                            required
                          />
                          <p className="text-white/60 text-xs mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span className="text-red-400 font-semibold">บังคับกรอก:</span> ระบุชื่อครูที่เป็นเจ้าของรูปภาพเฉลยนี้
                          </p>
                        </div>
                      </>
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

        {/* Search Solutions Modal */}
        {showSearchModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden border-2 border-white/20">
              {/* Modal Header */}
              <div className="bg-white/10 border-b border-white/20 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    ค้นหาเฉลยที่มีอยู่
                  </h2>
                  <button
                    onClick={() => {
                      setShowSearchModal(false);
                      setFilteredSolutions([]);
                      setSearchKeyword('');
                      setAllSolutions([]);
                    }}
                    className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Search Input - Realtime */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearchKeywordChange(e.target.value)}
                    placeholder="🔍 ค้นหาเฉลย... (พิมพ์เพื่อค้นหาแบบเรียลไทม์)"
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl pl-12 pr-16 py-3 text-white placeholder-white/60 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
                    autoFocus
                  />
                  {searchKeyword && (
                    <button
                      onClick={() => handleSearchKeywordChange('')}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-white/60 hover:text-white transition-colors"
                      title="ล้างคำค้นหา"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-white/60 text-sm mt-2">
                  แสดง {filteredSolutions.length} จาก {allSolutionsTotal} เฉลย
                  {searchKeyword && ` (กรองด้วย "${searchKeyword}")`}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                {allSolutionsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white/70">กำลังโหลด...</p>
                  </div>
                ) : filteredSolutions.length > 0 ? (
                  <div className="space-y-4">
                    {filteredSolutions.map((result) => (
                          <div key={result.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border-2 border-white/20 hover:border-white/40 transition-all duration-200">
                            <div className="flex gap-4">
                              <div className="flex-shrink-0">
                                {result.images.length > 0 ? (
                                  <div className="w-32 h-32 bg-gray-900/50 rounded-lg overflow-hidden">
                                    <img
                                      src={`http://localhost:8000/${result.images[0].image_path}`}
                                      alt="Solution preview"
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-32 h-32 bg-gray-900/50 rounded-lg flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h3 className="text-white font-semibold text-lg">{result.title || 'ไม่มีชื่อเฉลย'}</h3>
                                    {result.teacher_name && (
                                      <p className="text-white/60 text-sm">👨‍🏫 {result.teacher_name}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleCopySolution(result)}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                  >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    ใช้เฉลยนี้
                                  </button>
                                </div>
                                <p className="text-white/80 text-sm line-clamp-3">
                                  {result.answer_text || 'ไม่มีคำอธิบาย'}
                                </p>
                                <div className="flex items-center gap-4 text-sm text-white/60">
                                  <span className="flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {result.images.length} รูป
                                  </span>
                                  <span>ID: {result.id}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Pagination */}
                        {allSolutionsTotalPages > 1 && (
                          <div className="flex justify-center items-center gap-2 mt-6">
                            <button
                              onClick={() => loadAllSolutions(allSolutionsPage - 1)}
                              disabled={allSolutionsPage === 1}
                              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ← ก่อนหน้า
                            </button>
                            <span className="text-white">
                              หน้า {allSolutionsPage} / {allSolutionsTotalPages}
                            </span>
                            <button
                              onClick={() => loadAllSolutions(allSolutionsPage + 1)}
                              disabled={allSolutionsPage === allSolutionsTotalPages}
                              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ถัดไป →
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <svg className="w-20 h-20 text-white/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-white/70 text-lg">
                          {searchKeyword ? `ไม่พบเฉลยที่ตรงกับ "${searchKeyword}"` : 'ยังไม่มีเฉลยในระบบ'}
                        </p>
                      </div>
                    )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAddQuestionWithSolution;
