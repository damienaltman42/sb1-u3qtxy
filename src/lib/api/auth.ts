import axios from 'axios';
import type { SignUpData } from '../../types';

const API_URL = 'http://localhost:3000';

export const auth = {
  login: async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    
    return { access_token, user };
  },
  
  register: async (data: SignUpData) => {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    
    const { access_token, user } = response.data;
    localStorage.setItem('token', access_token);
    
    return { access_token, user };
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },

  updateProfile: async (data: Partial<SignUpData>) => {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${API_URL}/users/profile`,
      data,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  }
};