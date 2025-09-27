import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { User as AuthUser } from '../../context/AuthContext';

// --- Type Definitions ---
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
}
interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

interface AdminUser extends AuthUser {
  storeAverageRating?: string | null;
}
type AddStoreFormInputs = Omit<Store, 'id' | 'ownerId' | 'averageRating'>;
type AddUserFormInputs = Omit<AdminUser, 'id' | 'storeAverageRating'> & { password?: string };



const AdminDashboardPage: React.FC = () => {
  // --- State Management ---
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });
  
  const { register: registerStore, handleSubmit: handleStoreSubmit, reset: resetStoreForm } = useForm<AddStoreFormInputs>();
  const { register: registerUser, handleSubmit: handleUserSubmit, reset: resetUserForm } = useForm<AddUserFormInputs>();
  
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    try {
      const [usersRes, storesRes, statsRes] = await Promise.all([
        // Pass filters as query parameters to the users endpoint
        api.get<AdminUser[]>('/admin/users', { params: userFilters }),
        api.get<Store[]>('/admin/stores'),
        api.get<DashboardStats>('/admin/users/stats'),
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
      setStats(statsRes.data);
    } catch (error) { console.error('Failed to fetch data:', error); }
  }, [userFilters]); // Re-run this function if filters change

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onStoreSubmit: SubmitHandler<AddStoreFormInputs> = async (data) => {
    try {
      await api.post('/admin/stores', data);
      alert('Store created successfully!');
      resetStoreForm();
      fetchData();
    } catch (error: any) { alert(`Failed to create store: ${error.response?.data?.message}`); }
  };

  const onUserSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    try {
      await api.post('/admin/users', data);
      alert('User created successfully!');
      resetUserForm();
      fetchData();
    } catch (error: any) { alert(`Failed to create user: ${error.response?.data?.message}`); }
  };
  
  const handleAssignOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !selectedOwner) return alert('Please select a store and an owner.');
    try {
      await api.patch(`/admin/stores/${selectedStore}/assign-owner`, { ownerId: selectedOwner });
      alert('Owner assigned successfully!');
      fetchData();
    } catch (error: any) { alert(`Failed to assign owner: ${error.response?.data?.message}`); }
  };

  const storeOwners = users.filter(u => u.role === 'store_owner');

  // --- JSX ---
  return (
    <div>
      <h1>Admin Dashboard</h1>
      {stats && (
        <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
          <h3>Total Users: {stats.totalUsers}</h3>
          <h3>Total Stores: {stats.totalStores}</h3>
          <h3>Total Ratings: {stats.totalRatings}</h3>
        </div>
      )}

      {/* User Management Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2>User Management</h2>
        <form onSubmit={handleUserSubmit(onUserSubmit)} style={{ marginBottom: '20px' }}>
          <input {...registerUser('name', { required: true })} placeholder="User Name" />
          <input type="email" {...registerUser('email', { required: true })} placeholder="User Email" />
          <input {...registerUser('address')} placeholder="User Address" />
          <input type="password" {...registerUser('password', { required: true })} placeholder="Password" />
          <select {...registerUser('role', { required: true })}>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_admin">System Admin</option>
          </select>
          <button type="submit">Create User</button>
        </form>

        <div style={{ margin: '20px 0' }}>
          <strong>Filter Users:</strong>
          <input placeholder="By Name..." onChange={(e) => setUserFilters(prev => ({ ...prev, name: e.target.value }))} />
          <input placeholder="By Email..." onChange={(e) => setUserFilters(prev => ({ ...prev, email: e.target.value }))} />
          <input placeholder="By Address..." onChange={(e) => setUserFilters(prev => ({ ...prev, address: e.target.value }))} />
          <select onChange={(e) => setUserFilters(prev => ({ ...prev, role: e.target.value }))}>
            <option value="">All Roles</option>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_admin">System Admin</option>
          </select>
        </div>


        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Address</th><th>Role</th><th>Store's Avg Rating</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td><td>{user.email}</td><td>{user.address}</td><td>{user.role}</td>
                <td>
                  {user.role === 'store_owner' && user.storeAverageRating
                    ? `${Number(user.storeAverageRating).toFixed(1)} ★`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Store Management Section */}
      <section>
        <h2>Store Management</h2>
        <form onSubmit={handleStoreSubmit(onStoreSubmit)} style={{ marginBottom: '20px' }}>
          <input {...registerStore('name', { required: true })} placeholder="Store Name" />
          <input type="email" {...registerStore('email', { required: true })} placeholder="Store Email" />
          <input {...registerStore('address', { required: true })} placeholder="Store Address" />
          <button type="submit">Create Store</button>
        </form>

        <form onSubmit={handleAssignOwner} style={{ marginBottom: '20px' }}>
            <strong>Assign Owner:</strong>
            <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}>
                <option value="">Select a Store</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)}>
                <option value="">Select an Owner</option>
                {storeOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button type="submit">Assign</button>
        </form>
        
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Owner ID</th></tr></thead>
          <tbody>
            {stores.map(store => <tr key={store.id}><td>{store.name}</td><td>{store.email}</td><td>{store.address}</td><td>{store.ownerId || 'N/A'}</td></tr>)}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboardPage;