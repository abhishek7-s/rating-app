import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar: React.FC = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log(user)

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Brand/Logo Link */}
        <Link to="/" className="text-white text-2xl font-bold hover:text-gray-300">
          Store Rater
        </Link>

        <div className="space-x-4 flex items-center">
          {token && user ? (
            <>
              <span className="text-gray-300">Welcome {user.email}!</span>
              <Link to="/stores" className="text-gray-300 hover:text-white">
                Stores
              </Link>
              {user.role === 'system_admin' && (
                <Link to="/admin/dashboard" className="text-gray-300 hover:text-white">
                  Admin Dashboard
                </Link>
              )}
              {user.role === 'store_owner' && (
                <Link to="/owner/dashboard" className="text-gray-300 hover:text-white">
                  My Store
                </Link>
              )}
              
              <Link to="/dashboard" className="text-gray-300 hover:text-white">My Dashboard</Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (

            <>
              <Link to="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};