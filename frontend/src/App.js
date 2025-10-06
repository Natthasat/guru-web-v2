import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddQuestion from './pages/AdminAddQuestion';
import AdminAddSolutionNew from './pages/AdminAddSolutionNew';
import AdminLinkQuestionSolution from './pages/AdminLinkQuestionSolution';
import AdminManageQuestions from './pages/AdminManageQuestions';
import AdminManageSolutions from './pages/AdminManageSolutions';
import AdminManageUsers from './pages/AdminManageUsers';
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
            <Route path="/admin/add-question" element={
              <ProtectedRoute>
                <AdminAddQuestion />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-solution" element={
              <ProtectedRoute>
                <AdminAddSolutionNew />
              </ProtectedRoute>
            } />
            <Route path="/admin/link-question-solution" element={
              <ProtectedRoute>
                <AdminLinkQuestionSolution />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-questions" element={
              <ProtectedRoute>
                <AdminManageQuestions />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-solutions" element={
              <ProtectedRoute>
                <AdminManageSolutions />
              </ProtectedRoute>
            } />
            <Route path="/admin/manage-users" element={
              <ProtectedRoute>
                <AdminManageUsers />
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