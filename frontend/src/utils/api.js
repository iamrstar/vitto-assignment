import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const submitApplication = async (data) => {
  const response = await api.post('/applications', data);
  return response.data;
};

export const getApplications = async (status) => {
  const url = status ? `/applications?status=${status}` : '/applications';
  const response = await api.get(url);
  return response.data;
};

export const updateApplicationStatus = async (id, status) => {
  const response = await api.patch(`/applications/${id}/status`, { status });
  return response.data;
};

export const getSummary = async () => {
  const response = await api.get('/summary');
  return response.data;
};

export default api;
