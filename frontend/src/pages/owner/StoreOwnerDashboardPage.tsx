import React, { useState, useEffect } from 'react';
import api from '../../services/api';

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
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <h1>Store Dashboard</h1>
      <h2>Overall Average Rating: {data.averageRating} ★</h2>
      <hr />
      <h3>Users Who Rated Your Store</h3>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>User Name</th>
            <th>Rating Given</th>
          </tr>
        </thead>
        <tbody>
          {data.ratings.map((r, index) => (
            <tr key={index}>
              <td>{r.user.name}</td>
              <td>{r.rating} ★</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreOwnerDashboardPage;