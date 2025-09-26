import React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

// Define the type for our form inputs
type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      // For now, let's navigate to a placeholder home page on success
      navigate('/dashboard');
    } else {
      alert('Login Failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <button type="submit">Login</button>
      </form>

       <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>


    </div>
  );
};

export default LoginPage;