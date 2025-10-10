// Admin User Management Page
import React, { useState, useEffect } from 'react';
import axios from '../utils/axios'; // ใช้ axios instance ที่มี interceptor
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../components/Notification';
import LoadingSpinner from '../components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:8000/api';

const AdminManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check token before fetching
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('❌ No token - redirecting to login');
      setError('⚠️ กรุณาเข้าสู่ระบบก่อนใช้งาน');
      setLoading(false);
      setTimeout(() => navigate('/login'), 1500);
      return;
    }
    fetchUsers();
  }, [navigate]);

  // Auto scroll to top when message changes
  useEffect(() => {
    if (successMessage || error) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Auto hide success message after 3 seconds
      if (successMessage) {
        const timer = setTimeout(() => {
          setSuccessMessage('');
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [successMessage, error]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('❌ No token found in localStorage');
        setError('⚠️ กรุณาเข้าสู่ระบบก่อนใช้งาน');
        setTimeout(() => navigate('/login'), 1000);
        return;
      }

      console.log('📡 Fetching users with token...');
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Users data:', response.data); // Debug log
      
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setError('');
      } else {
        console.error('Invalid data format:', response.data);
        setError('⚠️ รูปแบบข้อมูลไม่ถูกต้อง');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      
      if (error.response?.status === 401) {
        setError('⚠️ Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(`❌ ไม่สามารถโหลดรายการผู้ใช้ได้: ${error.response?.data?.detail || error.message}`);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('⚠️ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่');
        return;
      }
      
      await axios.post(`${API_BASE_URL}/users`, newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('🎉 เพิ่มผู้ใช้สำเร็จ!');
      setNewUser({ username: '', password: '' });
      setShowAddModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      setError(`❌ ${error.response?.data?.detail || 'ไม่สามารถเพิ่มผู้ใช้ได้'}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?')) return;

    setError('');
    setSuccessMessage('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('⚠️ ไม่พบ Token กรุณาเข้าสู่ระบบใหม่');
        return;
      }
      
      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSuccessMessage('🎉 ลบผู้ใช้สำเร็จ!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(`❌ ${error.response?.data?.detail || 'ไม่สามารถลบผู้ใช้ได้'}`);
    }
  };

  if (loading) return <LoadingSpinner message="กำลังโหลดรายการผู้ใช้..." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
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
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 animate-pulse">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-green-800 font-semibold">{successMessage}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
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

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl">
                <span className="text-3xl">👥</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  จัดการผู้ใช้
                </h1>
                <p className="text-white/70 text-sm mt-1">จัดการบัญชีผู้ใช้ในระบบ</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center gap-2 shadow-lg transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              เพิ่มผู้ใช้
            </button>
          </div>

          {users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👤</div>
              <p className="text-white/70 text-lg">ยังไม่มีผู้ใช้ในระบบ</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold rounded-tl-xl">ID</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">ชื่อผู้ใช้</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">วันที่สร้าง</th>
                    <th className="px-6 py-4 text-center text-white font-semibold rounded-tr-xl">จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`${index % 2 === 0 ? 'bg-white/5' : 'bg-white/10'} hover:bg-white/20 transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 text-white font-mono">{user.id}</td>
                      <td className="px-6 py-4 text-white font-semibold flex items-center gap-2">
                        <span className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-sm">
                          👤
                        </span>
                        {user.username}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {user.created_at 
                          ? new Date(user.created_at).toLocaleDateString('th-TH', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'
                        }
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.username.toLowerCase() === 'admin' ? (
                          <div className="flex items-center justify-center gap-2 text-yellow-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm font-semibold">ป้องกัน</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 mx-auto shadow-md transform hover:scale-105"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            ลบ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Total Users Count */}
          <div className="mt-6 pt-4 border-t border-white/20">
            <p className="text-white/70 text-center">
              ทั้งหมด <span className="text-white font-bold text-lg">{users.length}</span> ผู้ใช้
            </p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-8 max-w-md w-full border-2 border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl">
                <span className="text-2xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-white">เพิ่มผู้ใช้ใหม่</h2>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-5">
              <div>
                <label className="flex items-center gap-2 text-white font-semibold mb-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  ชื่อผู้ใช้
                </label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                  placeholder="กรอกชื่อผู้ใช้"
                  required
                />
              </div>
              
              <div>
                <label className="flex items-center gap-2 text-white font-semibold mb-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  รหัสผ่าน
                </label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 backdrop-blur-sm"
                  placeholder="กรอกรหัสผ่าน"
                  required
                  minLength={4}
                />
                <p className="text-white/60 text-sm mt-1">รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร</p>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 font-semibold shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  เพิ่มผู้ใช้
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({ username: '', password: '' });
                  }}
                  className="flex-1 bg-white/20 text-white py-3 rounded-xl hover:bg-white/30 transition-all duration-200 font-semibold backdrop-blur-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
