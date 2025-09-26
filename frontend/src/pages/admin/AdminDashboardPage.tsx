import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { User } from '../../context/AuthContext';

// --- Type Definitions ---
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
}
type AddStoreFormInputs = Omit<Store, 'id' | 'ownerId'>;
type AddUserFormInputs = Omit<User, 'id'> & { password?: string };


const AdminDashboardPage: React.FC = () => {
  // --- State Management ---
  const [stores, setStores] = useState<Store[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Forms
  const { register: registerStore, handleSubmit: handleStoreSubmit, reset: resetStoreForm } = useForm<AddStoreFormInputs>();
  const { register: registerUser, handleSubmit: handleUserSubmit, reset: resetUserForm } = useForm<AddUserFormInputs>();
  
  // State for the assignment form
  const [selectedStore, setSelectedStore] = useState('');
  const [selectedOwner, setSelectedOwner] = useState('');

  // --- Data Fetching ---
  const fetchData = async () => {
    try {
      // Fetch both users and stores at the same time
      const [usersRes, storesRes] = await Promise.all([
        api.get<User[]>('/admin/users'),
        api.get<Store[]>('/admin/stores'),
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Event Handlers ---
  const onStoreSubmit: SubmitHandler<AddStoreFormInputs> = async (data) => {
    try {
      await api.post('/admin/stores', data);
      alert('Store created successfully!');
      resetStoreForm();
      fetchData(); // Refresh all data
    } catch (error: any) {
      alert(`Failed to create store: ${error.response?.data?.message}`);
    }
  };

  const onUserSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    try {
      await api.post('/admin/users', data);
      alert('User created successfully!');
      resetUserForm();
      fetchData(); // Refresh all data
    } catch (error: any) {
      alert(`Failed to create user: ${error.response?.data?.message}`);
    }
  };
  
  const handleAssignOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !selectedOwner) return alert('Please select a store and an owner.');
    try {
      await api.patch(`/admin/stores/${selectedStore}/assign-owner`, { ownerId: selectedOwner });
      alert('Owner assigned successfully!');
      fetchData(); // Refresh all data
    } catch (error: any) {
      alert(`Failed to assign owner: ${error.response?.data?.message}`);
    }
  };

  const storeOwners = users.filter(u => u.role === 'store_owner');

  // --- JSX ---
  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* User Management Section */}
      <section style={{ marginBottom: '40px' }}>
        <h2>User Management</h2>
        <form onSubmit={handleUserSubmit(onUserSubmit)} style={{ marginBottom: '20px' }}>
          <input {...registerUser('name', { required: true })} placeholder="User Name" />
          <input type="email" {...registerUser('email', { required: true })} placeholder="User Email" />
          <input type="password" {...registerUser('password', { required: true })} placeholder="Password" />
          <select {...registerUser('role', { required: true })}>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_admin">System Admin</option>
          </select>
          <button type="submit">Create User</button>
        </form>
        <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {users.map(user => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td>{user.role}</td></tr>)}
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