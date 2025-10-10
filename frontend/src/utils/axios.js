import axios from 'axios';

// สร้าง axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Request interceptor - เพิ่ม token ในทุก request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - จัดการ 401 error
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // ลบ token และข้อมูล user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // แสดงข้อความแจ้งเตือน
      console.error('🔒 Session หมดอายุ กรุณาเข้าสู่ระบบอีกครั้ง');
      
      // Redirect ไปหน้า login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
