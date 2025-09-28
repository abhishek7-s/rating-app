import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Toaster } from 'react-hot-toast';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};