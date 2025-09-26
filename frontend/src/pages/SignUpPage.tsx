import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

// Define the type for our form inputs, matching the backend DTO
type SignUpFormInputs = {
  name: string;
  email: string;
  password: string;
  address: string;
};

const SignUpPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      await api.post('/auth/signup', data);
      alert('Registration successful! Please log in.');
      navigate('/login'); 
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      alert(`Registration Failed: ${errorMessage}`);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input {...register('name', { required: 'Name is required' })} />
          {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email', { required: 'Email is required' })}
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>
        <div>
          <label>Address</label>
          <input {...register('address')} />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignUpPage;