import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default DashboardPage;