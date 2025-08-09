
import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { getUsers } from '../services/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('levelnet-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('levelnet-user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const allUsers = getUsers(); // Get users from the dynamic service
      const userToLogin = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (userToLogin) {
        // Omit password before storing
        const { password: _, ...userToStore } = userToLogin;
        setUser(userToStore);
        localStorage.setItem('levelnet-user', JSON.stringify(userToStore));
        resolve();
      } else {
        reject(new Error('Email atau password salah.'));
      }
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('levelnet-user');
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};