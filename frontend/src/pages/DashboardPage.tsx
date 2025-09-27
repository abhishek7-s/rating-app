import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import api from '../services/api';


type PasswordFormInputs = {
  currentPassword: string;
  newPassword: string;
};

const UpdatePasswordForm: React.FC = () => {
  const { register, handleSubmit, reset } = useForm<PasswordFormInputs>();
  
  const onSubmit: SubmitHandler<PasswordFormInputs> = async (data) => {
    try {
      await api.patch('/auth/password', data);
      alert('Password updated successfully!');
      reset();
    } catch (error: any) {
      alert(`Error: ${error.response?.data?.message || 'Failed to update password.'}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>Update Password</h3>
      <input type="password" {...register('currentPassword', { required: true })} placeholder="Current Password" />
      <input type="password" {...register('newPassword', { required: true })} placeholder="New Password" />
      <button type="submit">Update</button>
    </form>
  );
};

const DashboardPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      <UpdatePasswordForm />
    </div>
  );
};

export default DashboardPage;