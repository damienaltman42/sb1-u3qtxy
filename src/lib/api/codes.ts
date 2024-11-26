import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const codes = {
  verify: async (rouletteId: string, code: string) => {
    const response = await axios.post(
      `${API_URL}/access-codes/verify`,
      { rouletteId, code },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  use: async (codeId: string) => {
    const response = await axios.post(
      `${API_URL}/access-codes/${codeId}/use`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  create: async (rouletteId: string, data: {
    spins: number;
    expiresIn?: number;
  }) => {
    const response = await axios.post(
      `${API_URL}/access-codes`,
      {
        rouletteId,
        totalSpins: data.spins,
        expiresIn: data.expiresIn
      },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(
      `${API_URL}/access-codes/${id}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};