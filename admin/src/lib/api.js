// lib/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api/v1',
  withCredentials: true,
  headers: { Accept: 'application/json' },
});

// 👉 Add a request interceptor to include token automatically
api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
