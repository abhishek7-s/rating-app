import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import SignUpPage from './pages/SignUpPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { AdminRoute } from './components/AdminRoute';
import { AuthProvider } from './context/AuthProvider';
import StoreListPage from './pages/StoreListPage';
import { OwnerRoute } from './components/OwnerRoute';
import StoreOwnerDashboardPage from './pages/owner/StoreOwnerDashboardPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage/>} />
            <Route path="/stores" element={<StoreListPage />} />
          </Route>

          <Route element={<OwnerRoute />}>
            <Route path="/owner/dashboard" element={<StoreOwnerDashboardPage />} />
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