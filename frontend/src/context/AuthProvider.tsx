import React, { useEffect, useState, type ReactNode } from 'react';
import api from '../services/api';
import { AuthContext, type User } from './AuthContext';  
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        console.log(token)
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data); 
        } catch (error) {
          console.error('Invalid token. Logging out.', error);
          logout();
        }
      }
      setLoading(false);
    };
    fetchUserProfile();
  }, [token]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post<{ access_token: string }>('/auth/login', { email, password });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};