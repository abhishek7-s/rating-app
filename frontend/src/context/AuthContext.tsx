import { createContext } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  address?: string;
  role: 'system_admin' | 'normal_user' | 'store_owner';
}


export interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);