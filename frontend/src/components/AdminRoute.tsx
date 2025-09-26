import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const AdminRoute: React.FC = () => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'system_admin') {

    return <Navigate to="/dashboard" />;
  }


  return <Outlet />;
};