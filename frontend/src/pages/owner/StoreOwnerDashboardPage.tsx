import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { StarRating } from '../../components/StarRating'; // Import the StarRating component

interface RatingInfo {
  rating: number;
  user: {
    name: string;
  };
}

interface DashboardData {
  averageRating: string;
  ratings: RatingInfo[];
}

const StoreOwnerDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setData(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      }
    };
    fetchDashboardData();
  }, []);

  if (error) {
    return <div className="text-center text-red-500 mt-10">Error: {error}</div>;
  }

  if (!data) {
    return <div className="text-center text-gray-500 mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Store Dashboard</h1>
      
      {/* --- Stats Card for Average Rating --- */}
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-lg font-medium text-gray-500 uppercase">Overall Average Rating</h2>
        <p className="text-5xl font-bold text-indigo-600 mt-2">
          {Number(data.averageRating).toFixed(1)}
          <span className="text-3xl text-gray-400"> / 5</span>
        </p>
        <div className="flex justify-center mt-2">
            <StarRating rating={Number(data.averageRating)} readOnly />
        </div>
      </div>
      
      {/* --- Modern Styled Table for Raters --- */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Users Who Rated Your Store</h3>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating Given
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.ratings.map((r, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {r.user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <StarRating rating={r.rating} readOnly />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboardPage;