import axios from 'axios';

const api_client = axios.create({
  baseURL: 'http://localhost:4000/api', 
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('user_token');
  if (token) {
    config.headers['Authorization'] = token;
  }
  return config;
});

export default api_client;