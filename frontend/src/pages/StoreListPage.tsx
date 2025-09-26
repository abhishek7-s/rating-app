import React, { useState, useEffect } from 'react';
import api from '../services/api';

// This type should match the response from your new backend endpoint
interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: string | null; // Sequelize returns this as a string
  userRating: number | null; // The current user's rating
}

const StoreListPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleRate = async (storeId: string, rating: number) => {
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating });
      alert(`You rated this store ${rating} stars!`);
      fetchStores(); // Refresh list to show new ratings
    } catch (error) {
        console.log(error)
      alert('Failed to submit rating.');
    }
  };

  return (
    <div>
      <h1>Stores</h1>
      {stores.map((store) => (
        <div key={store.id} style={{ border: '1px solid #ccc', padding: '16px', marginBottom: '16px' }}>
          <h3>{store.name}</h3>
          <p>{store.address}</p>
          <p>
            <strong>Overall Rating:</strong>{' '}
            {store.averageRating ? Number(store.averageRating).toFixed(1) : 'Not Rated Yet'}
          </p>
          <p>
            <strong>Your Rating:</strong> {store.userRating || 'You have not rated this store'}
          </p>
          <div>
            <strong>Rate this store:</strong>{' '}
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleRate(store.id, star)}>
                {star} ★
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreListPage;