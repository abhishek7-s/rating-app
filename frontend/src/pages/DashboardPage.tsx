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
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormInputs>();
  
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
    <div className="w-full max-w-md p-8 mt-6 space-y-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-center">Change Your Password</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            {...register('currentPassword', { required: 'Current password is required' })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.currentPassword && <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>}
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword', { required: 'New password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};


const DashboardPage: React.FC = () => {
  const { user } = useAuth(); 

  return (
    <div className="flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard, {user?.name}!</h1>
        <p className="text-gray-600">This is your personal space to manage your account.</p>
      </div>
      

      <UpdatePasswordForm />
    </div>
  );
};

export default DashboardPage;