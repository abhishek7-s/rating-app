import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { Layout } from './components/Layout'; // Import the Layout
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import StoreListPage from './pages/StoreListPage';
import DashboardPage from './pages/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import { OwnerRoute } from './components/OwnerRoute';
import StoreOwnerDashboardPage from './pages/owner/StoreOwnerDashboardPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route element={<Layout />}>

            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="/stores" element={<StoreListPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            </Route>


            <Route element={<OwnerRoute />}>
              <Route path="/owner/dashboard" element={<StoreOwnerDashboardPage />} />
            </Route>
            
            <Route path="/" element={<HomePage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;