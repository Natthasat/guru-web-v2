import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminManageQuestionAndSolutions() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]); // Store all questions for filtering
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingSolutions, setEditingSolutions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  
  // Search filters
  const [searchFilters, setSearchFilters] = useState({
    book_id: '',
    page: '',
    question_no: '',
    question_text: ''
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchQuestions();
  }, []);

  // Handle ESC key to close image preview
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && imagePreview) {
        setImagePreview(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [imagePreview]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(response.data);
      setAllQuestions(response.data); // Store all questions
    } catch (error) {
      setError('ไม่สามารถโหลดรายการโจทย์ได้');
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSearch = () => {
    let filtered = [...allQuestions];

    if (searchFilters.book_id) {
      filtered = filtered.filter(q => 
        q.book_id.toLowerCase().includes(searchFilters.book_id.toLowerCase())
      );
    }

    if (searchFilters.page) {
      filtered = filtered.filter(q => 
        q.page.toString() === searchFilters.page
      );
    }

    if (searchFilters.question_no) {
      filtered = filtered.filter(q => 
        q.question_no.toString() === searchFilters.question_no
      );
    }

    if (searchFilters.question_text) {
      filtered = filtered.filter(q => 
        q.question_text && q.question_text.toLowerCase().includes(searchFilters.question_text.toLowerCase())
      );
    }

    setQuestions(filtered);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handleClearSearch = () => {
    setSearchFilters({
      book_id: '',
      page: '',
      question_no: '',
      question_text: ''
    });
    setQuestions(allQuestions);
    setCurrentPage(1); // Reset to page 1
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestions = questions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(questions.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEdit = async (question) => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch full question details with solutions
      const response = await axios.get(
        `${API_BASE_URL}/qa/${question.book_id}/${question.page}/${question.question_no}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingQuestion({
        id: response.data.question.id,
        book_id: response.data.question.book_id,
        old_book_id: response.data.question.old_book_id || '',
        page: response.data.question.page,
        question_no: response.data.question.question_no,
        question_text: response.data.question.question_text || '',
        question_img: response.data.question.question_img,
        existing_question_img: response.data.question.question_img
      });

      setEditingSolutions(
        response.data.solutions.map(sol => ({
          id: sol.id,
          title: sol.title,
          answer_text: sol.answer_text || '',
          existing_images: sol.images || [],
          new_images: [],
          new_image_previews: []
        }))
      );

      setShowEditModal(true);
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลโจทย์ได้');
      console.error('Error loading question details:', error);
    }
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบโจทย์และเฉลยทั้งหมด?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('ลบโจทย์สำเร็จ');
      fetchQuestions();
    } catch (error) {
      setError(error.response?.data?.detail || 'ไม่สามารถลบโจทย์ได้');
    }
  };

  const handleQuestionChange = (field, value) => {
    setEditingQuestion(prev => ({ ...prev, [field]: value }));
  };

  const handleQuestionImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditingQuestion(prev => ({
        ...prev,
        question_img: file,
        question_img_preview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...editingSolutions];
    newSolutions[index][field] = value;
    setEditingSolutions(newSolutions);
  };

  const handleSolutionImagesChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('สามารถอัปโหลดได้สูงสุด 5 รูปต่อเฉลย');
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    const newSolutions = [...editingSolutions];
    newSolutions[index].new_images = files;
    newSolutions[index].new_image_previews = previews;
    setEditingSolutions(newSolutions);
  };

  const handleDeleteExistingImage = async (solutionIndex, imageId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/solution-images/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const newSolutions = [...editingSolutions];
      newSolutions[solutionIndex].existing_images = newSolutions[solutionIndex].existing_images.filter(
        img => img.id !== imageId
      );
      setEditingSolutions(newSolutions);
      setMessage('ลบรูปภาพสำเร็จ');
    } catch (error) {
      setError('ไม่สามารถลบรูปภาพได้');
    }
  };

  const addNewSolution = () => {
    setEditingSolutions([
      ...editingSolutions,
      {
        id: null,
        title: `วิธีที่ ${editingSolutions.length + 1}`,
        answer_text: '',
        existing_images: [],
        new_images: [],
        new_image_previews: []
      }
    ]);
  };

  const removeSolution = async (index) => {
    const solution = editingSolutions[index];
    
    if (solution.id) {
      // Existing solution - delete from server
      if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบเฉลยนี้?')) return;
      
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_BASE_URL}/solutions/${solution.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessage('ลบเฉลยสำเร็จ');
      } catch (error) {
        setError('ไม่สามารถลบเฉลยได้');
        return;
      }
    }

    // Remove from state
    const newSolutions = editingSolutions.filter((_, i) => i !== index);
    setEditingSolutions(newSolutions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Update Question
      const questionFormData = new FormData();
      questionFormData.append('book_id', editingQuestion.book_id);
      questionFormData.append('old_book_id', editingQuestion.old_book_id || '');
      questionFormData.append('page', editingQuestion.page);
      questionFormData.append('question_no', editingQuestion.question_no);
      questionFormData.append('question_text', editingQuestion.question_text || '');

      if (editingQuestion.question_img instanceof File) {
        questionFormData.append('question_img', editingQuestion.question_img);
      }

      await axios.put(
        `${API_BASE_URL}/questions/${editingQuestion.id}`,
        questionFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Update/Create Solutions
      for (const solution of editingSolutions) {
        const solutionFormData = new FormData();
        solutionFormData.append('title', solution.title);
        solutionFormData.append('answer_text', solution.answer_text);

        if (solution.id) {
          // Update existing solution
          await axios.put(
            `${API_BASE_URL}/solutions/${solution.id}`,
            solutionFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        } else {
          // Create new solution
          const response = await axios.post(
            `${API_BASE_URL}/questions/${editingQuestion.id}/solutions`,
            solutionFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          solution.id = response.data.id;
        }

        // Upload new images if any
        if (solution.new_images.length > 0) {
          const imageFormData = new FormData();
          solution.new_images.forEach(image => {
            imageFormData.append('images', image);
          });

          await axios.post(
            `${API_BASE_URL}/solutions/${solution.id}/images`,
            imageFormData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );
        }
      }

      setMessage('บันทึกข้อมูลสำเร็จ!');
      setShowEditModal(false);
      fetchQuestions();
    } catch (error) {
      console.error('Error:', error);
      setError(error.response?.data?.detail || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };

  if (loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="group flex items-center gap-2 text-white hover:text-purple-200 font-semibold transition-all duration-200 mb-6"
        >
          <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          กลับไปหน้าหลัก
        </button>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 border border-white/20">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-3 rounded-xl">
              <span className="text-3xl">📚</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                จัดการโจทย์และเฉลย
              </h1>
              <p className="text-white/70 text-sm mt-1">แก้ไขโจทย์พร้อมเฉลยในหน้าเดียว</p>
            </div>
          </div>

          {message && (
            <div className="mb-4 p-4 rounded-xl bg-green-500/20 border-2 border-green-400 text-green-200">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border-2 border-red-400 text-red-200">
              {error}
            </div>
          )}

          {/* Search Form */}
          <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200/30">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔍</span>
              <h2 className="text-xl font-bold text-white">ค้นหาโจทย์</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-white/90 text-sm mb-2 block">รหัสหนังสือ</label>
                <input
                  type="text"
                  value={searchFilters.book_id}
                  onChange={(e) => handleSearchFilterChange('book_id', e.target.value)}
                  placeholder="ค้นหารหัสหนังสือ"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-white/90 text-sm mb-2 block">หน้า</label>
                <input
                  type="number"
                  value={searchFilters.page}
                  onChange={(e) => handleSearchFilterChange('page', e.target.value)}
                  placeholder="ค้นหาหน้า"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-white/90 text-sm mb-2 block">ข้อที่</label>
                <input
                  type="number"
                  value={searchFilters.question_no}
                  onChange={(e) => handleSearchFilterChange('question_no', e.target.value)}
                  placeholder="ค้นหาข้อที่"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-white/90 text-sm mb-2 block">ข้อความโจทย์</label>
                <input
                  type="text"
                  value={searchFilters.question_text}
                  onChange={(e) => handleSearchFilterChange('question_text', e.target.value)}
                  placeholder="ค้นหาข้อความ"
                  className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-2.5 text-white placeholder-white/40 focus:border-purple-400 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={handleSearch}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                ค้นหา
              </button>
              <button
                onClick={handleClearSearch}
                className="px-8 bg-white/20 text-white font-semibold py-3 rounded-xl hover:bg-white/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                ล้างค่า
              </button>
            </div>
          </div>

          {questions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-white/70 text-lg">
                {allQuestions.length === 0 ? 'ยังไม่มีโจทย์ในระบบ' : 'ไม่พบโจทย์ที่ค้นหา'}
              </p>
              {allQuestions.length > 0 && (
                <button
                  onClick={handleClearSearch}
                  className="mt-4 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-all"
                >
                  แสดงทั้งหมด
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold rounded-tl-xl">รหัสหนังสือ</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">หน้า</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">ข้อที่</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">โจทย์</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">วันที่สร้าง</th>
                    <th className="px-6 py-4 text-center text-white font-semibold rounded-tr-xl">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuestions.map((question, index) => (
                    <tr
                      key={question.id}
                      className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} hover:bg-white/20 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 text-white font-mono">{question.book_id}</td>
                      <td className="px-6 py-4 text-white">{question.page}</td>
                      <td className="px-6 py-4 text-white">{question.question_no}</td>
                      <td className="px-6 py-4 text-white/80 max-w-xs truncate">
                        {question.question_text || <span className="text-white/40">ไม่มีข้อความ</span>}
                      </td>
                      <td className="px-6 py-4 text-white/90 text-sm">
                        {question.created_at ? (
                          <div className="flex flex-col">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(question.created_at).toLocaleDateString('th-TH', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="flex items-center gap-1 text-white/60 text-xs">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(question.created_at).toLocaleTimeString('th-TH', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(question)}
                            className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-md transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDelete(question.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-md transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            ลบ
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-white/70 text-center md:text-left">
                {questions.length === allQuestions.length ? (
                  <>ทั้งหมด <span className="text-white font-bold text-lg">{questions.length}</span> โจทย์</>
                ) : (
                  <>
                    แสดง <span className="text-purple-300 font-bold text-lg">{questions.length}</span> จาก <span className="text-white font-bold text-lg">{allQuestions.length}</span> โจทย์
                  </>
                )}
                {totalPages > 1 && (
                  <span className="block md:inline md:ml-2 text-white/60 text-sm mt-1 md:mt-0">
                    (หน้า {currentPage} จาก {totalPages})
                  </span>
                )}
              </p>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">ก่อนหน้า</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and adjacent pages
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                              currentPage === pageNumber
                                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-110'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span key={pageNumber} className="w-10 h-10 flex items-center justify-center text-white/50">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50"
                  >
                    <span className="hidden sm:inline">ถัดไป</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingQuestion && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 md:p-8 max-w-6xl w-full border-2 border-white/20 shadow-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <span className="text-3xl">✏️</span>
                แก้ไขโจทย์และเฉลย
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
              {/* Question Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📝</span> ข้อมูลโจทย์
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white font-semibold mb-2 block">รหัสหนังสือ *</label>
                    <input
                      type="text"
                      value={editingQuestion.book_id}
                      onChange={(e) => handleQuestionChange('book_id', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">รหัสหนังสือเก่า</label>
                    <input
                      type="text"
                      value={editingQuestion.old_book_id}
                      onChange={(e) => handleQuestionChange('old_book_id', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">หน้า *</label>
                    <input
                      type="number"
                      value={editingQuestion.page}
                      onChange={(e) => handleQuestionChange('page', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white font-semibold mb-2 block">ข้อที่ *</label>
                    <input
                      type="number"
                      value={editingQuestion.question_no}
                      onChange={(e) => handleQuestionChange('question_no', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-white font-semibold mb-2 block">โจทย์ (Text)</label>
                  <textarea
                    value={editingQuestion.question_text}
                    onChange={(e) => handleQuestionChange('question_text', e.target.value)}
                    rows="3"
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white resize-none"
                  />
                </div>

                <div className="mt-4">
                  <label className="text-white font-semibold mb-2 block">รูปภาพโจทย์</label>
                  {editingQuestion.existing_question_img && !editingQuestion.question_img_preview && (
                    <div className="mb-2">
                      <img
                        src={getImageUrl(editingQuestion.existing_question_img)}
                        alt="Current question"
                        className="w-48 h-auto rounded-lg border-2 border-white/30 cursor-pointer hover:border-blue-400 transition-all transform hover:scale-105"
                        onClick={() => setImagePreview(getImageUrl(editingQuestion.existing_question_img))}
                        title="คลิกเพื่อดูภาพขนาดเต็ม"
                      />
                    </div>
                  )}
                  {editingQuestion.question_img_preview && (
                    <div className="mb-2">
                      <img
                        src={editingQuestion.question_img_preview}
                        alt="New question"
                        className="w-48 h-auto rounded-lg border-2 border-green-400 cursor-pointer hover:border-green-500 transition-all transform hover:scale-105"
                        onClick={() => setImagePreview(editingQuestion.question_img_preview)}
                        title="คลิกเพื่อดูภาพขนาดเต็ม"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageChange}
                    className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                  />
                </div>
              </div>

              {/* Solutions Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-green-200/30">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>✅</span> เฉลย ({editingSolutions.length} วิธี)
                  </h3>
                  <button
                    type="button"
                    onClick={addNewSolution}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
                  >
                    + เพิ่มเฉลย
                  </button>
                </div>

                {editingSolutions.map((solution, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-4 mb-4 border border-white/20">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-bold">เฉลยที่ {index + 1}</h4>
                      {editingSolutions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSolution(index)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-white/90 mb-1 block">ชื่อเฉลย</label>
                        <input
                          type="text"
                          value={solution.title}
                          onChange={(e) => handleSolutionChange(index, 'title', e.target.value)}
                          className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="text-white/90 mb-1 block">คำอธิบาย</label>
                        <textarea
                          value={solution.answer_text}
                          onChange={(e) => handleSolutionChange(index, 'answer_text', e.target.value)}
                          rows="3"
                          className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-white/90 mb-1 block">รูปภาพ</label>
                        
                        {/* Existing Images */}
                        {solution.existing_images.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {solution.existing_images.map((img) => (
                              <div key={img.id} className="relative group">
                                <img
                                  src={getImageUrl(img.image_path)}
                                  alt={`Solution ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-all"
                                  onClick={() => setImagePreview(getImageUrl(img.image_path))}
                                  title="คลิกเพื่อดูภาพขนาดเต็ม"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleDeleteExistingImage(index, img.id)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* New Images Preview */}
                        {solution.new_image_previews.length > 0 && (
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {solution.new_image_previews.map((preview, imgIndex) => (
                              <img
                                key={imgIndex}
                                src={preview}
                                alt={`New ${imgIndex + 1}`}
                                className="w-full h-24 object-cover rounded-lg border-2 border-green-400 cursor-pointer hover:opacity-80 transition-all"
                                onClick={() => setImagePreview(preview)}
                                title="คลิกเพื่อดูภาพขนาดเต็ม"
                              />
                            ))}
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleSolutionImagesChange(index, e)}
                          className="w-full text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-8 bg-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/30 transition-all"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div 
          className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setImagePreview(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setImagePreview(null)}
              className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-2xl transform hover:scale-110 transition-all z-10"
              title="ปิด (ESC)"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Image */}
            <img
              src={imagePreview}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-6 py-3 rounded-full backdrop-blur-sm">
              <p className="text-sm">🖱️ คลิกพื้นหลังหรือกด ESC เพื่อปิด</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminManageQuestionAndSolutions;
