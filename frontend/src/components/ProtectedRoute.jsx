import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // ถ้าไม่มี token redirect ไปหน้าล็อกอิน
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedRoute;