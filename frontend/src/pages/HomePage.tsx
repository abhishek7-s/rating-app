import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const HomePage: React.FC = () => {
  const { token } = useAuth();
  
  if (token) {
    return <Navigate to="/stores" replace />;
  }

  return (
    <div className="text-center mt-10">
      <h1 className="text-4xl font-bold">Welcome to Store Rater!</h1>
      <p className="text-lg text-gray-600 mt-2">
        Please sign up or log in to continue.
      </p>
    </div>
  );
};

export default HomePage;