import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { User as AuthUser } from '../../context/AuthContext';
import { StarRating } from '../../components/StarRating';
import toast from 'react-hot-toast';

// --- Type Definitions ---
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string | null;
  averageRating?: string | null;
}
interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}
interface AdminUser extends AuthUser {
  storeAverageRating?: string | null;
  address?: string;
}
type AddStoreFormInputs = Omit<Store, 'id' | 'ownerId' | 'averageRating'>;
type AddUserFormInputs = Omit<AdminUser, 'id' | 'storeAverageRating'> & { password: string };

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
      const validFilters = Object.fromEntries(Object.entries(userFilters).filter(([, value]) => value !== ''));
      const [usersRes, storesRes, statsRes] = await Promise.all([
        api.get<AdminUser[]>('/admin/users', { params: validFilters }),
        api.get<Store[]>('/admin/stores'),
        api.get<DashboardStats>('/admin/users/stats'),
      ]);
      setUsers(usersRes.data);
      setStores(storesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("Failed to load dashboard data.");
    }
  }, [userFilters]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // --- Event Handlers ---
  const onUserSubmit: SubmitHandler<AddUserFormInputs> = async (data) => {
    const loadingToast = toast.loading('Creating user...');
    try {
      await api.post('/admin/users', data);
      toast.success('User created successfully!', { id: loadingToast });
      resetUserForm();
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to create user: ${error.response?.data?.message}`, { id: loadingToast });
    }
  };
  
  const onStoreSubmit: SubmitHandler<AddStoreFormInputs> = async (data) => {
    const loadingToast = toast.loading('Creating store...');
    try {
      await api.post('/admin/stores', data);
      toast.success('Store created successfully!', { id: loadingToast });
      resetStoreForm();
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to create store: ${error.response?.data?.message}`, { id: loadingToast });
    }
  };

  const handleAssignOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore || !selectedOwner) return toast.error('Please select a store and an owner.');
    const loadingToast = toast.loading('Assigning owner...');
    try {
      await api.patch(`/admin/stores/${selectedStore}/assign-owner`, { ownerId: selectedOwner });
      toast.success('Owner assigned successfully!', { id: loadingToast });
      setSelectedStore('');
      setSelectedOwner('');
      fetchData();
    } catch (error: any) {
      toast.error(`Failed to assign owner: ${error.response?.data?.message}`, { id: loadingToast });
    }
  };

  const storeOwners = users.filter(u => u.role === 'store_owner');

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* --- Stats Cards Grid --- */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-500 uppercase">Total Users</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-500 uppercase">Total Stores</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalStores}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-medium text-gray-500 uppercase">Total Ratings</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">{stats.totalRatings}</p>
          </div>
        </div>
      )}

      {/* --- User Management Card --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">User Management</h2>
        <form onSubmit={handleUserSubmit(onUserSubmit)} className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6 p-4 border rounded-lg">
          <input {...registerUser('name', { required: true })} placeholder="User Name" className="col-span-1 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="email" {...registerUser('email', { required: true })} placeholder="User Email" className="col-span-1 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input {...registerUser('address')} placeholder="User Address" className="col-span-1 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input type="password" {...registerUser('password', { required: true })} placeholder="Password" className="col-span-1 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <select {...registerUser('role', { required: true })} className="col-span-1 border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="normal_user">Normal</option>
            <option value="store_owner">Owner</option>
            <option value="system_admin">Admin</option>
          </select>
          <button type="submit" className="col-span-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm">Add User</button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
          <input placeholder="Filter By Name..." onChange={(e) => setUserFilters(prev => ({ ...prev, name: e.target.value }))} className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input placeholder="Filter By Email..." onChange={(e) => setUserFilters(prev => ({ ...prev, email: e.target.value }))} className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <input placeholder="Filter By Address..." onChange={(e) => setUserFilters(prev => ({ ...prev, address: e.target.value }))} className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          <select onChange={(e) => setUserFilters(prev => ({ ...prev, role: e.target.value }))} className="border p-2 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="">All Roles</option>
            <option value="normal_user">Normal User</option>
            <option value="store_owner">Store Owner</option>
            <option value="system_admin">System Admin</option>
          </select>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Store's Avg Rating</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.address || 'N/A'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                {user.role === 'store_owner' && user.storeAverageRating ? (
                                    <StarRating rating={Number(user.storeAverageRating)} readOnly />
                                ) : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* --- Store Management Card --- */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Store Management</h2>
        <form onSubmit={handleStoreSubmit(onStoreSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg">
            <input {...registerStore('name', { required: true })} placeholder="Store Name" className="col-span-1 border p-2 rounded-md shadow-sm" />
            <input type="email" {...registerStore('email', { required: true })} placeholder="Store Email" className="col-span-1 border p-2 rounded-md shadow-sm" />
            <input {...registerStore('address', { required: true })} placeholder="Store Address" className="col-span-1 border p-2 rounded-md shadow-sm" />
            <button type="submit" className="col-span-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 shadow-sm">Add Store</button>
        </form>

        <form onSubmit={handleAssignOwner} className="flex items-center gap-4 mb-6 p-4 border rounded-lg">
            <strong className="whitespace-nowrap text-gray-700">Assign Owner:</strong>
            <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)} className="flex-grow border p-2 rounded-md shadow-sm">
                <option value="">Select a Store</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={selectedOwner} onChange={e => setSelectedOwner(e.target.value)} className="flex-grow border p-2 rounded-md shadow-sm">
                <option value="">Select an Owner</option>
                {storeOwners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 shadow-sm">Assign</button>
        </form>

        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner ID</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {stores.map(store => (
                        <tr key={store.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.address}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">{store.ownerId || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;