import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';

const API_BASE_URL = 'http://localhost:8000/api';

function AdminManageTeachers() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deletingTeacher, setDeletingTeacher] = useState(null);
  
  const [formData, setFormData] = useState({
    teacher_code: '',
    teacher_name: '',
    subject: '',
    class_level: ''
  });
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadTeachers();
  }, []);
  
  const loadTeachers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers/list`);
      setTeachers(response.data.teachers);
    } catch (error) {
      setError('ไม่สามารถโหลดข้อมูลครูได้');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdd = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post(`${API_BASE_URL}/teachers/add`, formData);
      setMessage(response.data.message);
      setShowAddModal(false);
      setFormData({ teacher_code: '', teacher_name: '', subject: '', class_level: '' });
      loadTeachers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'ไม่สามารถเพิ่มครูได้');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      teacher_code: teacher.teacher_code,
      teacher_name: teacher.teacher_name,
      subject: teacher.subject,
      class_level: teacher.class_level
    });
    setShowEditModal(true);
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await axios.put(`${API_BASE_URL}/teachers/${editingTeacher.teacher_code}`, {
        teacher_name: formData.teacher_name,
        subject: formData.subject,
        class_level: formData.class_level
      });
      setMessage('อัปเดตข้อมูลครูสำเร็จ');
      setShowEditModal(false);
      setEditingTeacher(null);
      loadTeachers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'ไม่สามารถอัปเดตข้อมูลครูได้');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (teacher) => {
    setDeletingTeacher(teacher);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = async () => {
    if (!deletingTeacher) return;
    
    setLoading(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/teachers/${deletingTeacher.teacher_code}`);
      setMessage(response.data.message);
      setShowDeleteModal(false);
      setDeletingTeacher(null);
      loadTeachers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setError(error.response?.data?.detail || 'ไม่สามารถลบครูได้');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <span>👨‍🏫</span>
                  จัดการข้อมูลครู
                </h1>
                <p className="text-white/80">เพิ่ม แก้ไข หรือลบข้อมูลครู (Course Decoder)</p>
              </div>
              <button
                onClick={() => {
                  setFormData({ teacher_code: '', teacher_name: '', subject: '', class_level: '' });
                  setShowAddModal(true);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                + เพิ่มครูใหม่
              </button>
            </div>
          </div>
        </div>
        
        {/* Teachers List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          {loading && !teachers.length ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-20 text-white/80">
              <span className="text-4xl mb-4 block">📭</span>
              <p className="text-lg">ยังไม่มีข้อมูลครู</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      รหัสครู
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ชื่อครู
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      วิชา
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                      ช่วงชั้น
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {teachers.map((teacher) => (
                    <tr key={teacher.teacher_code} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white font-mono font-bold">
                        {teacher.teacher_code}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {teacher.teacher_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {teacher.subject}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {teacher.class_level}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => handleEdit(teacher)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-xs transition-all"
                            title="แก้ไข"
                          >
                            ✏️ แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeleteClick(teacher)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-xs transition-all"
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
          )}
        </div>
        
        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>➕</span> เพิ่มครูใหม่
              </h2>
              
              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">รหัสครู (2 ตัวอักษร)</label>
                  <input
                    type="text"
                    value={formData.teacher_code}
                    onChange={(e) => setFormData({...formData, teacher_code: e.target.value.toUpperCase()})}
                    maxLength={2}
                    pattern="[A-Za-z]{2}"
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white uppercase font-mono"
                    placeholder="เช่น JA, NP"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">ชื่อครู</label>
                  <input
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    placeholder="เช่น ครูจารวี"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">วิชา</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    placeholder="เช่น คณิตศาสตร์"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">ช่วงชั้น</label>
                  <input
                    type="text"
                    value={formData.class_level}
                    onChange={(e) => setFormData({...formData, class_level: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    placeholder="เช่น ม.ต้น, ม.ปลาย"
                    required
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ กำลังบันทึก...' : '✓ บันทึก'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    ✕ ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && deletingTeacher && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-red-900 to-gray-900 rounded-2xl max-w-md w-full border border-red-500/50 p-6 shadow-2xl transform animate-pulse-once">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-500/20 mb-4">
                  <svg className="h-10 w-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  ยืนยันการลบครู
                </h3>
                
                <p className="text-white/80 mb-2">
                  คุณแน่ใจหรือไม่ที่จะลบครู
                </p>
                
                <div className="bg-white/10 rounded-xl p-4 mb-6">
                  <div className="text-white font-bold text-lg mb-1">
                    {deletingTeacher.teacher_name}
                  </div>
                  <div className="text-white/60 text-sm">
                    รหัสครู: <span className="font-mono font-bold text-red-400">{deletingTeacher.teacher_code}</span>
                  </div>
                  <div className="text-white/60 text-sm">
                    วิชา: {deletingTeacher.subject} ({deletingTeacher.class_level})
                  </div>
                </div>
                
                <p className="text-red-300 text-sm mb-6">
                  ⚠️ การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeletingTeacher(null);
                    }}
                    disabled={loading}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    ✕ ยกเลิก
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={loading}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ กำลังลบ...' : '🗑️ ยืนยันการลบ'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Edit Modal */}
        {showEditModal && editingTeacher && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl max-w-md w-full border border-white/20 p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <span>✏️</span> แก้ไขข้อมูลครู
              </h2>
              
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">รหัสครู</label>
                  <input
                    type="text"
                    value={formData.teacher_code}
                    className="w-full bg-gray-700 border-2 border-gray-600 rounded-xl px-4 py-3 text-white/50 uppercase font-mono"
                    disabled
                  />
                  <p className="text-white/60 text-xs mt-1">* ไม่สามารถแก้ไขรหัสครูได้</p>
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">ชื่อครู</label>
                  <input
                    type="text"
                    value={formData.teacher_name}
                    onChange={(e) => setFormData({...formData, teacher_name: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">วิชา</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-white font-semibold mb-2 block">ช่วงชั้น</label>
                  <input
                    type="text"
                    value={formData.class_level}
                    onChange={(e) => setFormData({...formData, class_level: e.target.value})}
                    className="w-full bg-white/10 border-2 border-white/30 rounded-xl px-4 py-3 text-white"
                    required
                  />
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {loading ? '⏳ กำลังบันทึก...' : '✓ บันทึกการเปลี่ยนแปลง'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingTeacher(null);
                    }}
                    className="px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all"
                  >
                    ✕ ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Messages */}
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
      </div>
    </div>
  );
}

export default AdminManageTeachers;
