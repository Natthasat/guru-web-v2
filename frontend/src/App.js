import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddQuestionWithSolution from './pages/AdminAddQuestionWithSolution';
import AdminManageQuestionsAdvanced from './pages/AdminManageQuestionsAdvanced';
import AdminManageUsers from './pages/AdminManageUsers';
import AdminManageTeachers from './pages/AdminManageTeachers';
import Login from './pages/Login';
import SolutionSearch from './pages/SolutionSearch';
import ProtectedRoute from './components/ProtectedRoute';
import { NotificationProvider } from './components/Notification';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <div className="min-h-screen">
          {/* Main Content */}
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-question-with-solution" element={
              <ProtectedRoute>
                <AdminAddQuestionWithSolution />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-questions-advanced" element={
              <ProtectedRoute>
                <AdminManageQuestionsAdvanced />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-users" element={
              <ProtectedRoute>
                <AdminManageUsers />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-teachers" element={
              <ProtectedRoute>
                <AdminManageTeachers />
              </ProtectedRoute>
            } />
            <Route path="/student/solution-search" element={<SolutionSearch />} />
            </Routes>
          </main>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;