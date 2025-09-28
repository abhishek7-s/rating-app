import { useCallback, useEffect, useState } from 'react';
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
      // Filter out empty strings before sending to the backend
      const validFilters = Object.fromEntries(
        Object.entries(debouncedFilters).filter(([, value]) => value !== '')
      );
      const response = await api.get('/stores', { params: validFilters });
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleRate = async (storeId: string, rating: number) => {
    try {
      await api.post(`/stores/${storeId}/ratings`, { rating });
      alert(`You rated this store ${rating} stars!`);
      fetchStores(); // Refresh list to show new ratings
    } catch (error) {
      alert('Failed to submit rating.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Explore Stores</h1>

      {/* --- Search Filters --- */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Search by address..."
          value={filters.address}
          onChange={(e) => setFilters(prev => ({ ...prev, address: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {/* --- Responsive Grid Layout for Store Cards --- */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div key={store.id} className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{store.name}</h3>
                <p className="text-gray-600 mb-4">{store.address}</p>
              </div>
              <div>
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-gray-800 font-semibold">
                    Overall Rating:{' '}
                    <span className="font-normal">
                      {store.averageRating ? `${Number(store.averageRating).toFixed(1)} ★` : 'Not Rated Yet'}
                    </span>
                  </p>
                  <p className="text-gray-800 font-semibold">
                    Your Rating:{' '}
                    <span className="font-normal">
                      {store.userRating ? `${store.userRating} ★` : 'Not Rated'}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Rate:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(store.id, star)}
                      className={`px-3 py-1 text-sm rounded-full transition-colors ${
                        store.userRating === star
                          ? 'bg-indigo-600 text-white font-bold' // Highlight user's current rating
                          : 'bg-gray-200 text-gray-700 hover:bg-indigo-500 hover:text-white'
                      }`}
                    >
                      {star}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">No stores found. Try adjusting your search.</p>
      )}
    </div>
  );
};

export default StoreListPage;