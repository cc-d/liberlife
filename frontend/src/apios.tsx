import axios from 'axios';

const apios = axios.create({
  baseURL: 'http://localhost:8999',  // replace with your API's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

apios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apios;
