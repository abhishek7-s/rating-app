import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: string | null;
  userRating: number | null;
}

const StoreListPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);

  const [filters, setFilters] = useState({ name: '', address: '' });
  const debouncedFilters = useDebounce(filters, 500); 
  const fetchStores = useCallback(async () => {
    try {
      // 2. Pass the debounced filters object as params
      const response = await api.get('/stores', { params: debouncedFilters });
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  }, [debouncedFilters]); // 3. Rerun when the debounced filters change

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

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
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
        />
        <input
          type="text"
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
        />
      </div>

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