import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id?: string;
  username?: string;
  email?: string;
  isGuest?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  guestLogin: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          localStorage.removeItem('token');
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        console.error('Error loading stored auth state:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    };

    initializeAuth();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      const token = data.token;

      if (!token) {
        throw new Error('No token received from server');
      }

      const userToStore: User = {
        ...userData,
        username
      };

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userToStore);
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed: ' + error.message);
    }
  };

  const handleRegister = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        username,
        email,
        password
      });

      if (response.status !== 201) {
        throw new Error(response.data.message || 'Registration failed');
      }

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const guestLogin = async () => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/api/auth/guest`);
      
      const { token, user: userData } = response.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      const userToStore: User = {
        ...userData,
        isGuest: true
      };
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userToStore));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(userToStore);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Guest login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login: handleLogin, 
      register: handleRegister, 
      logout, 
      guestLogin, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
