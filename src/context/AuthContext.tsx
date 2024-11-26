import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/api';
import type { User, SignUpData } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: SignUpData) => Promise<User>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // TODO: Implement token verification endpoint
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string) => {
    const response = await auth.login(email, password);
    setUser(response.user);
    return response.user;
  };

  const signUp = async (data: SignUpData) => {
    const response = await auth.register(data);
    setUser(response.user);
    return response.user;
  };

  const signOut = async () => {
    auth.logout();
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = await auth.updateProfile(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, updateProfile, loading }}>
      {!loading && children}
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