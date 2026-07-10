import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const registerUser = async (formData) => {
  const response = await apiClient.post('/register', formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await apiClient.post('/login', formData);
  return response.data;
};

export const verifyEmail = async (token) => {
  const response = await apiClient.get(`/verify?token=${token}`);
  return response.data;
};

export const fetchMe = async () => {
  const response = await apiClient.get('/me');
  return response.data;
};

export const logoutUser = async () => {
  await apiClient.post('/logout');
};
