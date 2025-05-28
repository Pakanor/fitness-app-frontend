// src/API/authApi.js
import axios from 'axios';

const API_URL = 'https://localhost:7177/api/auth'; // lub np. /api/auth w zależności od proxy

export const registerUser = async (formData) => {
  const response = await axios.post(`${API_URL}/register`, formData);
  return response.data;
};

export const loginUser = async (formData) => {
  const response = await axios.post(`${API_URL}/login`, formData);
  return response.data; // token
};

export const verifyEmail = async (token) => {
  const response = await axios.get(`${API_URL}/verify?token=${token}`);
  return response.data;
};
