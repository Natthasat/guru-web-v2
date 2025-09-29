import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Login = () => {
  const [questionCount, setQuestionCount] = useState(0);
  const [solutionCount, setSolutionCount] = useState(0);
  const [statLoading, setStatLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUsername, setLoggedInUsername] = useState('');
  const navigate = useNavigate();

  // ตรวจสอบสถานะ login เมื่อ component โหลด
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    if (token) {
      setIsLoggedIn(true);
      setLoggedInUsername(username || '');
    }
    // ดึงจำนวนโจทย์และเฉลย
    const fetchStats = async () => {
      setStatLoading(true);
      try {
        const qRes = await axios.get('http://localhost:8000/api/questions');
        setQuestionCount(qRes.data.length);
        const sRes = await axios.get('http://localhost:8000/api/solutions');
        setSolutionCount(sRes.data.length);
      } catch (err) {
        setQuestionCount(0);
        setSolutionCount(0);
      } finally {
        setStatLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/auth/login', {
        username,
        password
      });

      if (response.data.access_token) {
        // เก็บ access token ใน localStorage
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('token_type', response.data.token_type);
        localStorage.setItem('username', username);
        
        // อัพเดท state เพื่อแสดงเมนู admin
        setIsLoggedIn(true);
        setLoggedInUsername(username);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response && error.response.status === 401) {
        setError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      } else {
        setError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('username');
    
    // อัพเดท state เพื่อกลับไปหน้า login
    setIsLoggedIn(false);
    setLoggedInUsername('');
    setUsername('');
    setPassword('');
    setError('');
  };

  // ถ้าล็อกอินแล้ว แสดงเมนูการจัดการ
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">📚</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Guru Web Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white/80">สวัสดี, {loggedInUsername}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-white px-4 py-2 rounded-lg border border-red-300/30 transition-all duration-200 backdrop-blur-sm"
              >
                ออกจากระบบ
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-center py-16 px-4">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                ระบบจัดการโจทย์และเฉลย
              </h2>
              <p className="text-white/70 text-lg">
                เลือกเมนูที่ต้องการจัดการ
              </p>
              {/* Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
                <div className="bg-blue-500/20 rounded-xl p-6 border border-blue-400/30 flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2">📝</span>
                  <span className="text-2xl font-bold text-blue-200">{statLoading ? '...' : questionCount}</span>
                  <p className="text-blue-300 text-sm mt-2">โจทย์ทั้งหมด</p>
                </div>
                <div className="bg-green-500/20 rounded-xl p-6 border border-green-400/30 flex flex-col items-center justify-center">
                  <span className="text-3xl mb-2">✅</span>
                  <span className="text-2xl font-bold text-green-200">{statLoading ? '...' : solutionCount}</span>
                  <p className="text-green-300 text-sm mt-2">เฉลยทั้งหมด</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* เพิ่มโจทย์ */}
              <Link to="/admin/add-question" className="group">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">➕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">เพิ่มโจทย์</h3>
                    <p className="text-white/70">เพิ่มโจทย์ใหม่เข้าสู่ระบบ</p>
                  </div>
                </div>
              </Link>

              {/* เพิ่มเฉลย */}
              <Link to="/admin/add-solution" className="group">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">✅</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">เพิ่มเฉลย</h3>
                    <p className="text-white/70">เพิ่มเฉลยสำหรับโจทย์</p>
                  </div>
                </div>
              </Link>

              {/* จัดการโจทย์ */}
              <Link to="/admin/manage-questions" className="group">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">📝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">จัดการโจทย์</h3>
                    <p className="text-white/70">แก้ไข ลบ และจัดการโจทย์</p>
                  </div>
                </div>
              </Link>

              {/* จัดการเฉลย */}
              <Link to="/admin/manage-solutions" className="group">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl">🔧</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">จัดการเฉลย</h3>
                    <p className="text-white/70">แก้ไข ลบ และจัดการเฉลย</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ถ้ายังไม่ล็อกอิน แสดงฟอร์มล็อกอิน
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-4xl">🔐</span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              เข้าสู่ระบบ
            </h2>
            <p className="text-white/70">
              ระบบจัดการโจทย์และเฉลย
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto mt-4"></div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white/90 mb-2">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-white/60">👤</span>
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="กรอกชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white/90 mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-white/60">🔑</span>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="block w-full pl-10 pr-3 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                    placeholder="กรอกรหัสผ่าน"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <span className="text-red-300 mr-2">⚠️</span>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <span>🚀</span>
                )}
              </span>
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-white/50 text-xs">
              สำหรับผู้ดูแลระบบเท่านั้น
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-0 w-24 h-24 bg-indigo-400/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default Login;