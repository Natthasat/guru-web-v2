import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios'; // ใช้ axios instance ที่มี interceptor

const API_BASE_URL = 'http://localhost:8000/api';
const IMAGE_BASE_URL = 'http://localhost:8000';

function AdminManageQuestionsAdvanced() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [total, setTotal] = useState(0);
  
  // Filter options from API
  const [filterOptions, setFilterOptions] = useState({
    class_levels: [],
    subjects: [],
    teachers: [],
    content_levels: [],
    course_types: [],
    file_types: [],
    years: [],
    statuses: []
  });
  
  // Active filters
  const [filters, setFilters] = useState({
    class_level: '',
    subject: '',
    teacher: '',
    content_level: '',
    course_type: '',
    file_type: '',
    year: '',
    status: '',
    book_id: '',
    old_book_id: '',
    page: '',
    question_no: '',
    updated_by: ''
  });
  
  // Pagination & Sorting
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20);
  const [sortBy, setSortBy] = useState('updated_at');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Image modal
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Edit Modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingSolutions, setEditingSolutions] = useState([]);
  
  // Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteQuestionId, setDeleteQuestionId] = useState(null);
  const [deleteQuestionInfo, setDeleteQuestionInfo] = useState(null);
  
  // Messages
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Solution Search Modal
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [allSolutions, setAllSolutions] = useState([]);
  const [filteredSolutions, setFilteredSolutions] = useState([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(null);
  const [allSolutionsPage, setAllSolutionsPage] = useState(1);
  const [allSolutionsTotal, setAllSolutionsTotal] = useState(0);
  const [allSolutionsTotalPages, setAllSolutionsTotalPages] = useState(0);
  const [allSolutionsLoading, setAllSolutionsLoading] = useState(false);
  
  // Load filter options
  useEffect(() => {
    loadFilterOptions();
  }, []);
  
  // Load questions when filters change
  useEffect(() => {
    loadQuestions();
  }, [filters, currentPage, sortBy, sortOrder]);
  
  const loadFilterOptions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/manage/questions/filter-options`);
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };
  
  const loadQuestions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      // Add pagination
      params.append('skip', (currentPage - 1) * limit);
      params.append('limit', limit);
      params.append('sort_by', sortBy);
      params.append('sort_order', sortOrder);
      
      const response = await axios.get(`${API_BASE_URL}/manage/questions/list?${params}`);
      setQuestions(response.data.questions);
      setTotal(response.data.total);
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
  };
  
  const clearFilters = () => {
    setFilters({
      class_level: '',
      subject: '',
      teacher: '',
      content_level: '',
      course_type: '',
      file_type: '',
      year: '',
      status: '',
      book_id: '',
      old_book_id: '',
      page: '',
      question_no: '',
      updated_by: ''
    });
    setCurrentPage(1);
  };
  
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };
  
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${IMAGE_BASE_URL}/${imagePath}`;
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      'ขาดเฉลย': { bg: 'bg-red-500', text: 'ขาดเฉลย', icon: '❌' },
      'ขาดรูปวิธีทำ': { bg: 'bg-orange-500', text: 'ขาดรูปวิธีทำ', icon: '⚠️' },
      'ครบแล้ว': { bg: 'bg-green-500', text: 'ครบแล้ว', icon: '✅' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-500', text: status || 'ไม่ทราบ', icon: '❓' };
    
    return (
      <span className={`${config.bg} text-white px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1`}>
        <span>{config.icon}</span>
        <span>{config.text}</span>
      </span>
    );
  };
  
  const totalPages = Math.ceil(total / limit);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };
  
  // ฟังก์ชันแก้ไขโจทย์
  const handleEdit = async (question) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/qa/${question.book_id}/${question.page}/${question.question_no}`
      );

      setEditingQuestion({
        id: response.data.question.id,
        book_id: response.data.question.book_id,
        old_book_id: response.data.question.old_book_id || '',
        page: response.data.question.page,
        question_no: response.data.question.question_no,
        question_text: response.data.question.question_text || '',
        question_img: response.data.question.question_img,
        existing_question_img: response.data.question.question_img,
        updated_by: response.data.question.updated_by || localStorage.getItem('username') || 'Admin'
      });

      setEditingSolutions(
        response.data.solutions.map(sol => ({
          id: sol.id,
          title: sol.title,
          answer_text: sol.answer_text || '',
          teacher_name: sol.teacher_name || '',
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
  
  // ฟังก์ชันลบโจทย์
  const handleDelete = (question) => {
    setDeleteQuestionId(question.id);
    setDeleteQuestionInfo(question);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/questions/${deleteQuestionId}`);
      setMessage('🗑️ ลบโจทย์สำเร็จ!');
      setShowDeleteConfirm(false);
      setDeleteQuestionId(null);
      setDeleteQuestionInfo(null);
      loadQuestions(); // Reload list
    } catch (error) {
      setError(error.response?.data?.detail || 'ไม่สามารถลบโจทย์ได้');
      setShowDeleteConfirm(false);
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteQuestionId(null);
    setDeleteQuestionInfo(null);
  };
  
  // ฟังก์ชันจัดการข้อมูลโจทย์
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

  // ฟังก์ชันจัดการเฉลย
  const handleSolutionChange = (index, field, value) => {
    const newSolutions = [...editingSolutions];
    newSolutions[index][field] = value;
    setEditingSolutions(newSolutions);
  };

  const handleSolutionImagesChange = (index, e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('สามารถอัปโหลดได้สูงสุด 5 รูปต่อเฉลย');
      setTimeout(() => setError(''), 3000);
      return;
    }

    const previews = files.map(file => URL.createObjectURL(file));
    const newSolutions = [...editingSolutions];
    newSolutions[index].new_images = files;
    newSolutions[index].new_image_previews = previews;
    setEditingSolutions(newSolutions);
  };

  const addNewSolution = () => {
    setEditingSolutions([
      ...editingSolutions,
      {
        id: null,
        title: `วิธีที่ ${editingSolutions.length + 1}`,
        answer_text: '',
        teacher_name: '',
        existing_images: [],
        new_images: [],
        new_image_previews: []
      }
    ]);
  };

  // Realtime search/filter solutions
  const handleSearchKeywordChange = (keyword) => {
    setSearchKeyword(keyword);
    if (!keyword.trim()) {
      setFilteredSolutions(allSolutions);
      return;
    }
    
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
    const imageUrls = searchedSolution.images.map(img => `${IMAGE_BASE_URL}/${img.image_path}`);
    const imageCount = imageUrls.length;
    
    const newSolutions = [...editingSolutions];
    newSolutions[currentSolutionIndex] = {
      ...newSolutions[currentSolutionIndex],
      answer_text: searchedSolution.answer_text || '',
      teacher_name: searchedSolution.teacher_name || '',
      title: searchedSolution.title || newSolutions[currentSolutionIndex].title,
      copiedImageUrls: imageUrls,
      copiedFromSolutionId: searchedSolution.id,
      copiedMessage: `✅ คัดลอกเฉลยสำเร็จ!\n📝 คำอธิบาย: ${searchedSolution.answer_text?.substring(0, 50)}...\n📸 รูปภาพ: ${imageCount} รูป\n💡 รูปภาพจะถูกดาวน์โหลดและบันทึกอัตโนมัติเมื่อคุณกดปุ่ม "บันทึก"`
    };
    setEditingSolutions(newSolutions);
    
    setShowSearchModal(false);
    setSearchKeyword('');
  };

  // Load all solutions with pagination
  const loadAllSolutions = async (page = 1) => {
    setAllSolutionsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/solutions/list`, {
        params: { page, limit: 10 }
      });
      
      setAllSolutions(response.data.solutions);
      setFilteredSolutions(response.data.solutions);
      setAllSolutionsTotal(response.data.total);
      setAllSolutionsPage(response.data.page);
      setAllSolutionsTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Error loading solutions:', err);
      setError('ไม่สามารถโหลดรายการเฉลยได้');
    } finally {
      setAllSolutionsLoading(false);
    }
  };

  // Open search modal for specific solution
  const openSearchModal = (solutionIndex) => {
    setCurrentSolutionIndex(solutionIndex);
    setShowSearchModal(true);
    loadAllSolutions(1);
  };

  const removeSolution = async (index) => {
    const solution = editingSolutions[index];
    
    if (solution.id) {
      if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบเฉลยนี้?')) return;
      
      try {
        await axios.delete(`${API_BASE_URL}/solutions/${solution.id}`);
        setMessage('ลบเฉลยสำเร็จ');
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setError('ไม่สามารถลบเฉลยได้');
        setTimeout(() => setError(''), 3000);
        return;
      }
    }

    const newSolutions = editingSolutions.filter((_, i) => i !== index);
    setEditingSolutions(newSolutions);
  };

  // ฟังก์ชันบันทึกการแก้ไข
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const currentUsername = localStorage.getItem('username') || 'Admin';

      // อัปเดตโจทย์
      const questionFormData = new FormData();
      questionFormData.append('book_id', editingQuestion.book_id);
      questionFormData.append('old_book_id', editingQuestion.old_book_id || '');
      questionFormData.append('page', editingQuestion.page);
      questionFormData.append('question_no', editingQuestion.question_no);
      questionFormData.append('question_text', editingQuestion.question_text || '');
      questionFormData.append('updated_by', editingQuestion.updated_by || currentUsername);

      if (editingQuestion.question_img instanceof File) {
        questionFormData.append('question_img', editingQuestion.question_img);
      }

      await axios.put(
        `${API_BASE_URL}/questions/${editingQuestion.id}`,
        questionFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // อัปเดตหรือเพิ่มเฉลย
      for (const solution of editingSolutions) {
        const solutionFormData = new FormData();
        solutionFormData.append('title', solution.title);
        solutionFormData.append('answer_text', solution.answer_text || '');
        solutionFormData.append('teacher_name', solution.teacher_name || '');

        // เก็บรูปภาพที่จะอัปโหลด (เฉพาะรูปใหม่ที่ user เลือก)
        const imagesToUpload = [];
        
        // เก็บ path ของรูปที่คัดลอกมา (ให้ backend copy ภายใน server)
        const copiedImagePaths = [];
        if (solution.copiedImageUrls && solution.copiedImageUrls.length > 0) {
          solution.copiedImageUrls.forEach(imageUrl => {
            // แยก path จาก URL (เช่น http://localhost:8000/uploads/abc.png -> uploads/abc.png)
            const path = imageUrl.replace(IMAGE_BASE_URL + '/', '');
            copiedImagePaths.push(path);
          });
        }
        
        // เพิ่มรูปใหม่ที่ user อัปโหลด
        if (solution.new_images && solution.new_images.length > 0) {
          imagesToUpload.push(...solution.new_images);
        }

        if (solution.id) {
          // อัปเดตเฉลยที่มีอยู่ (ไม่รวมรูป)
          await axios.put(
            `${API_BASE_URL}/solutions/${solution.id}`,
            solutionFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          // อัปโหลดรูปภาพแยก (ถ้ามี)
          if (imagesToUpload.length > 0 || copiedImagePaths.length > 0) {
            const imageFormData = new FormData();
            
            // เพิ่มรูปใหม่ที่ user อัปโหลด
            imagesToUpload.forEach(file => {
              imageFormData.append('images', file);
            });
            
            // ส่ง paths ของรูปที่คัดลอกมา (ให้ backend copy)
            copiedImagePaths.forEach(path => {
              imageFormData.append('copied_image_paths', path);
            });

            await axios.post(
              `${API_BASE_URL}/solutions/${solution.id}/images`,
              imageFormData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
          }
        } else {
          // เพิ่มเฉลยใหม่
          const response = await axios.post(
            `${API_BASE_URL}/questions/${editingQuestion.id}/solutions`,
            solutionFormData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          // อัปโหลดรูปภาพหลังสร้างเฉลย (ถ้ามี)
          if ((imagesToUpload.length > 0 || copiedImagePaths.length > 0) && response.data.id) {
            const imageFormData = new FormData();
            
            // เพิ่มรูปใหม่ที่ user อัปโหลด
            imagesToUpload.forEach(file => {
              imageFormData.append('images', file);
            });
            
            // ส่ง paths ของรูปที่คัดลอกมา (ให้ backend copy)
            copiedImagePaths.forEach(path => {
              imageFormData.append('copied_image_paths', path);
            });

            await axios.post(
              `${API_BASE_URL}/solutions/${response.data.id}/images`,
              imageFormData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              }
            );
          }
        }
      }

      setMessage('✅ บันทึกการเปลี่ยนแปลงสำเร็จ!');
      setTimeout(() => {
        setMessage('');
        setShowEditModal(false);
        loadQuestions(); // Reload list
      }, 2000);

    } catch (error) {
      console.error('Error updating:', error);
      setError(error.response?.data?.detail || 'ไม่สามารถบันทึกการเปลี่ยนแปลงได้');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-6">
      <div className="max-w-[1800px] mx-auto">
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
        </div>

      <div>
        {/* Filters Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="mr-2">🔍</span>
              ตัวกรอง
            </h2>
            <button
              onClick={clearFilters}
              className="bg-gray-500/80 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200 text-sm"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">สถานะ</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.statuses.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            
            {/* Class Level */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ช่วงชั้น</label>
              <select
                value={filters.class_level}
                onChange={(e) => handleFilterChange('class_level', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.class_levels.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>
            
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">วิชา</label>
              <select
                value={filters.subject}
                onChange={(e) => handleFilterChange('subject', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            
            {/* Teacher */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ครูที่สอน</label>
              <select
                value={filters.teacher}
                onChange={(e) => handleFilterChange('teacher', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.teachers.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            
            {/* Content Level */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ระดับเนื้อหา</label>
              <select
                value={filters.content_level}
                onChange={(e) => handleFilterChange('content_level', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.content_levels.map(cl => (
                  <option key={cl} value={cl}>{cl}</option>
                ))}
              </select>
            </div>
            
            {/* Course Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ประเภทคอร์ส</label>
              <select
                value={filters.course_type}
                onChange={(e) => handleFilterChange('course_type', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.course_types.map(ct => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
            
            {/* File Type */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ประเภทไฟล์</label>
              <select
                value={filters.file_type}
                onChange={(e) => handleFilterChange('file_type', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.file_types.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            </div>
            
            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">ปี</label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">ทั้งหมด</option>
                {filterOptions.years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            {/* Book ID Search */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">รหัสหนังสือ</label>
              <input
                type="text"
                value={filters.book_id}
                onChange={(e) => handleFilterChange('book_id', e.target.value)}
                placeholder="ค้นหา..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            {/* Old Book ID Search */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">รหัสหนังสือเก่า</label>
              <input
                type="text"
                value={filters.old_book_id}
                onChange={(e) => handleFilterChange('old_book_id', e.target.value)}
                placeholder="ค้นหา..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            {/* Page */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">เลขหน้า</label>
              <input
                type="number"
                value={filters.page}
                onChange={(e) => handleFilterChange('page', e.target.value)}
                placeholder="ค้นหา..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            
            {/* Question No */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">เลขข้อ</label>
              <input
                type="number"
                value={filters.question_no}
                onChange={(e) => handleFilterChange('question_no', e.target.value)}
                placeholder="ค้นหา..."
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-t-2xl p-4 border border-white/20 border-b-0">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              ผลลัพธ์: {total} โจทย์
            </h3>
            <div className="flex items-center space-x-4">
              <span className="text-white/80 text-sm">
                หน้า {currentPage} / {totalPages}
              </span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/10 backdrop-blur-sm rounded-b-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20 text-white/80">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-lg">ไม่พบโจทย์ที่ตรงตามเงื่อนไข</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('book_id')}
                      >
                        รหัสหนังสือ {sortBy === 'book_id' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        รหัสเก่า
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('page')}
                      >
                        หน้า {sortBy === 'page' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('question_no')}
                      >
                        ข้อ {sortBy === 'question_no' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        รูปโจทย์
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ช่วงชั้น
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        วิชา
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ครู
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ระดับเนื้อหา
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        ประเภทไฟล์
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                        เฉลย
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('updated_at')}
                      >
                        แก้ไขล่าสุด {sortBy === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('updated_by')}
                      >
                        แก้ไขโดย {sortBy === 'updated_by' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th 
                        className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider cursor-pointer hover:bg-white/10"
                        onClick={() => handleSort('status')}
                      >
                        สถานะ {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {questions.map((q) => (
                      <tr key={q.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 text-sm text-white font-mono">
                          {q.book_id}
                        </td>
                        <td className="px-4 py-3 text-sm text-white/80 font-mono">
                          {q.old_book_id || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.page}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.question_no}
                        </td>
                        <td className="px-4 py-3">
                          {q.question_img ? (
                            <button
                              onClick={() => setSelectedImage(getImageUrl(q.question_img))}
                              className="w-12 h-12 rounded-lg overflow-hidden border-2 border-blue-400 hover:border-blue-300 transition-all"
                            >
                              <img
                                src={getImageUrl(q.question_img)}
                                alt="Question"
                                className="w-full h-full object-cover"
                              />
                            </button>
                          ) : (
                            <span className="text-white/40 text-xs">ไม่มีรูป</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.class_level || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.subject || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.teacher_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.content_level_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white">
                          {q.file_type_name || '-'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-white">{q.solution_count}</span>
                            <span className="text-white/60 text-xs">({q.image_count} รูป)</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-white/80">
                          {q.updated_at ? new Date(q.updated_at).toLocaleDateString('th-TH', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '-'}
                        </td>
                        <td className="px-4 py-3 text-sm text-white/80">
                          {q.updated_by || '-'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {getStatusBadge(q.status)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(q)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                              title="แก้ไข"
                            >
                              ✏️ แก้ไข
                            </button>
                            <button
                              onClick={() => handleDelete(q)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs transition-all"
                              title="ลบ"
                            >
                              🗑️ ลบ
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-t border-white/10">
                <div className="text-sm text-white/80">
                  แสดง {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, total)} จาก {total} รายการ
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ← ก่อนหน้า
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(totalPages)].map((_, i) => {
                      const page = i + 1;
                      // Show first, last, current, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded-lg transition-all ${
                              currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return <span key={page} className="text-white/60">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ถัดไป →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-5xl max-h-[90vh] relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
            >
              ✕ ปิด
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingQuestion && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <form onSubmit={handleUpdateSubmit}>
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-t-2xl border-b border-white/20 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span>✏️</span> แก้ไขโจทย์และเฉลย
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Question Section */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-2 border-blue-200/30">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <span>📝</span> ข้อมูลโจทย์
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white font-semibold mb-2 block">รหัสหนังสือ</label>
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
                      <label className="text-white font-semibold mb-2 block">เลขหน้า</label>
                      <input
                        type="number"
                        value={editingQuestion.page}
                        onChange={(e) => handleQuestionChange('page', e.target.value)}
                        className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-white font-semibold mb-2 block">เลขข้อ</label>
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
                      placeholder="ข้อความโจทย์ (ถ้ามี)"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="text-white font-semibold mb-2 block">รูปภาพโจทย์</label>
                    {editingQuestion.existing_question_img && !editingQuestion.question_img_preview && (
                      <div className="mb-2 bg-gray-900/50 rounded-lg p-2" style={{ height: '192px' }}>
                        <img
                          src={getImageUrl(editingQuestion.existing_question_img)}
                          alt="Current question"
                          className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-all"
                          onClick={() => setSelectedImage(getImageUrl(editingQuestion.existing_question_img))}
                        />
                      </div>
                    )}
                    {editingQuestion.question_img_preview && (
                      <div className="mb-2 bg-gray-900/50 rounded-lg p-2 border-2 border-green-400" style={{ height: '192px' }}>
                        <img
                          src={editingQuestion.question_img_preview}
                          alt="New question"
                          className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-all"
                          onClick={() => setSelectedImage(editingQuestion.question_img_preview)}
                        />
                        <div className="text-green-400 text-sm mt-2">✓ รูปใหม่</div>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQuestionImageChange}
                      className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                  </div>

                  {/* แก้ไขโดย */}
                  <div className="mt-4">
                    <label className="text-white font-semibold mb-2 flex items-center gap-2">
                      <span>👤</span> แก้ไขโดย
                    </label>
                    <input
                      type="text"
                      value={editingQuestion.updated_by || ''}
                      onChange={(e) => handleQuestionChange('updated_by', e.target.value)}
                      className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                      placeholder="ชื่อผู้แก้ไข"
                      required
                    />
                    <p className="text-white/60 text-sm mt-1">
                      *ระบุชื่อผู้ทำการแก้ไขข้อมูลนี้
                    </p>
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
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            🗑️ ลบ
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
                            placeholder="เช่น วิธีที่ 1, วิธีแบบง่าย"
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
                                  const newSolutions = [...editingSolutions];
                                  delete newSolutions[index].copiedMessage;
                                  setEditingSolutions(newSolutions);
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
                              onClick={() => openSearchModal(index)}
                              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                              title="ค้นหาและคัดลอกเฉลยที่มีอยู่แล้วในระบบ"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                              <span>🔍 ค้นหาเฉลยที่มีอยู่</span>
                            </button>
                          </div>
                          <textarea
                            value={solution.answer_text}
                            onChange={(e) => handleSolutionChange(index, 'answer_text', e.target.value)}
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

                        <div>
                          <label className="text-white/90 mb-1 block">รูปภาพเฉลย</label>
                          
                          {/* Existing Images */}
                          {solution.existing_images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {solution.existing_images.map((img, imgIndex) => (
                                <div key={img.id} className="relative group bg-gray-900/50 rounded-lg p-2" style={{ height: '150px' }}>
                                  <img
                                    src={getImageUrl(img.image_path)}
                                    alt={`Solution ${index + 1} - Image ${imgIndex + 1}`}
                                    className="w-full h-full object-contain rounded-lg cursor-pointer hover:opacity-90 transition-all"
                                    onClick={() => setSelectedImage(getImageUrl(img.image_path))}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (window.confirm('ลบรูปนี้?')) {
                                        axios.delete(`${API_BASE_URL}/solutions/${solution.id}/images/${img.id}`)
                                        .then(() => {
                                          const newSolutions = [...editingSolutions];
                                          newSolutions[index].existing_images = newSolutions[index].existing_images.filter(i => i.id !== img.id);
                                          setEditingSolutions(newSolutions);
                                          setMessage('ลบรูปสำเร็จ');
                                          setTimeout(() => setMessage(''), 2000);
                                        }).catch(() => setError('ไม่สามารถลบรูปได้'));
                                      }
                                    }}
                                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* New Images Preview */}
                          {solution.new_image_previews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                              {solution.new_image_previews.map((preview, imgIndex) => (
                                <div key={imgIndex} className="bg-gray-900/50 rounded-lg p-2 border-2 border-green-400" style={{ height: '150px' }}>
                                  <img
                                    src={preview}
                                    alt={`New ${imgIndex + 1}`}
                                    className="w-full h-full object-contain rounded-lg"
                                  />
                                  <div className="text-green-400 text-xs mt-1">✓ รูปใหม่</div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Teacher Name (ถ้ามีรูป) */}
                          {(solution.existing_images.length > 0 || solution.new_image_previews.length > 0) && (
                            <div className="mb-2">
                              <label className="text-white/90 mb-1 block text-sm">ชื่อครูผู้ให้เฉลย</label>
                              <input
                                type="text"
                                value={solution.teacher_name}
                                onChange={(e) => handleSolutionChange(index, 'teacher_name', e.target.value)}
                                className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-2 text-white text-sm"
                                placeholder="ชื่อครูผู้ให้เฉลย"
                              />
                            </div>
                          )}

                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => handleSolutionImagesChange(index, e)}
                            className="w-full text-white text-sm file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-green-500 file:text-white hover:file:bg-green-600"
                          />
                          <p className="text-white/60 text-xs mt-1">*สามารถเลือกได้สูงสุด 5 รูป</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 sticky bottom-0 bg-gradient-to-t from-gray-900 to-transparent pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ กำลังบันทึก...' : '✓ บันทึกการเปลี่ยนแปลง'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    ✕ ยกเลิก
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteQuestionInfo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">ยืนยันการลบโจทย์</h3>
              <p className="text-white/70">คุณแน่ใจหรือไม่ที่จะลบโจทย์นี้?</p>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-white/70">รหัสหนังสือ:</span>
                <span className="bg-red-500/30 px-3 py-1 rounded-lg font-mono text-white">{deleteQuestionInfo.book_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">หน้า:</span>
                <span className="bg-red-500/30 px-3 py-1 rounded-lg font-mono text-white">{deleteQuestionInfo.page}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">ข้อที่:</span>
                <span className="bg-red-500/30 px-3 py-1 rounded-lg font-mono text-white">{deleteQuestionInfo.question_no}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-xl transition-all font-semibold"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl transition-all font-semibold"
              >
                ✓ ลบโจทย์
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success/Error Messages */}
      {(message || error) && (
        <div className="fixed bottom-4 right-4 z-50">
          {message && (
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg mb-2">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Solution Search Modal */}
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

export default AdminManageQuestionsAdvanced;
