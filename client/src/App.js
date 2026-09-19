import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobDetail from './pages/JobDetail';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import PostJob from './pages/PostJob';
import ApplyJob from './pages/ApplyJob';
import Profile from './pages/Profile';
import EditJob from './pages/EditJob';

// Components
import Navbar from './components/Navbar';

// PROTECTED ROUTE
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// APP CONTENT
const AppContent = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Protected - Any logged in user */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected - Employers Only */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRole="employer">
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute allowedRole="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />

          {/* Edit Job */}
          <Route
            path="/employer/jobs/:id/edit"
            element={
              <ProtectedRoute allowedRole="employer">
                <EditJob />
              </ProtectedRoute>
            }
          />

          {/* Protected - Job Seekers Only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole="jobseeker">
                <JobSeekerDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs/:id/apply"
            element={
              <ProtectedRoute allowedRole="jobseeker">
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </main>
    </div>
  );
};

// ROOT APP
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;