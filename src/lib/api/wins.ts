import axios from 'axios';
import type { UserWin } from '../../types';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const wins = {
  getUserWins: async () => {
    const response = await axios.get(
      `${API_URL}/wins`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  create: async (rouletteId: string, prize: any) => {
    const response = await axios.post(
      `${API_URL}/wins`,
      { rouletteId, prize },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  claimPrize: async (winId: string) => {
    const response = await axios.post(
      `${API_URL}/wins/${winId}/claim`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};