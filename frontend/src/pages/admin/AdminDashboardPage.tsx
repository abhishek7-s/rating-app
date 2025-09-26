import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useForm, type SubmitHandler } from 'react-hook-form';

// Define a type for the store object
interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
}

// Define the type for the form inputs
type AddStoreFormInputs = Omit<Store, 'id'>;

const AdminDashboardPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const { register, handleSubmit, reset } = useForm<AddStoreFormInputs>();

  const fetchStores = async () => {
    try {
      const response = await api.get<Store[]>('/admin/stores');
      setStores(response.data);
    } catch (error) {
      console.error('Failed to fetch stores:', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const onSubmit: SubmitHandler<AddStoreFormInputs> = async (data) => {
    try {
      await api.post('/admin/stores', data);
      alert('Store created successfully!');
      reset(); 
      fetchStores(); 
    } catch (error: any) {
      alert(`Failed to create store: ${error.response?.data?.message}`);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard - Store Management</h1>
      <hr />
      
      <h2>Create New Store</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register('name', { required: true })} placeholder="Store Name" />
        <input type="email" {...register('email', { required: true })} placeholder="Store Email" />
        <input {...register('address', { required: true })} placeholder="Store Address" />
        <button type="submit">Create Store</button>
      </form>
      
      <hr />

      <h2>Store List</h2>
      <table border={1} style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboardPage;