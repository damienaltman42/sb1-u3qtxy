import axios from 'axios';

const API_URL = 'http://localhost:3000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const likes = {
  like: async (rouletteId: string) => {
    const response = await axios.post(
      `${API_URL}/likes`,
      { rouletteId },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  unlike: async (rouletteId: string) => {
    const response = await axios.delete(
      `${API_URL}/likes/${rouletteId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  getLikedRoulettes: async () => {
    const response = await axios.get(
      `${API_URL}/likes`,
      { headers: getAuthHeader() }
    );
    return response.data;
  }
};