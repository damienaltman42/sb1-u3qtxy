import axios from 'axios';
import type { RouletteConfig } from '../../types';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const roulettes = {
  create: async (data: Partial<RouletteConfig>) => {
    const response = await axios.post(
      `${API_URL}/roulettes`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  },
  
  getAll: async () => {
    const response = await axios.get(
      `${API_URL}/roulettes/my`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getAllPublic: async () => {
    const response = await axios.get(`${API_URL}/roulettes`);
    return response.data;
  },
  
  getOne: async (id: string) => {
    const response = await axios.get(`${API_URL}/roulettes/${id}`);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await axios.delete(
      `${API_URL}/roulettes/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  update: async (id: string, data: Partial<RouletteConfig>) => {
    const response = await axios.put(
      `${API_URL}/roulettes/${id}`,
      data,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};