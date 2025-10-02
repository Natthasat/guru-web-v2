import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddQuestion from './pages/AdminAddQuestion';
import AdminAddSolution from './pages/AdminAddSolution';
import AdminManageQuestions from './pages/AdminManageQuestions';
import AdminManageSolutions from './pages/AdminManageSolutions';
import Login from './pages/Login';
import SolutionSearch from './pages/SolutionSearch';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
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
                <AdminAddSolution />
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
              <Route path="/student/solution-search" element={<SolutionSearch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;