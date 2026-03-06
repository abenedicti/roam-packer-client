import axios from 'axios';

const service = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});
//* add token for each request
service.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
export default service;
