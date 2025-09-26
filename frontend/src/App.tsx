import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider } from './context/AuthProvider';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage/>} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Route>

          <Route path="/" element={<h1>Welcome! Please log in.</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;