import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const OwnerRoute: React.FC = () => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'store_owner') {
    return <Navigate to="/dashboard" />; // Redirect to normal dashboard
  }

  return <Outlet />;
};