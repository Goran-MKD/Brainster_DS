"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, registerUser, getMe } from '@/lib/api';
import Cookies from 'js-cookie';

interface User {
  id: number;
  email: string;
  credits: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email, password) => Promise<void>;
  logout: () => void;
  register: (email, password) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const fetchUser = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const userData = await getMe(token);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid or expired
        Cookies.remove('token');
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    Cookies.set('token', data.access_token, { expires: 1 });
    const userData = await getMe(data.access_token);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const register = async (email, password) => {
    await registerUser(email, password);
    // Optionally log the user in automatically after registration
    await login(email, password);
  };

  const refreshUser = fetchUser;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
