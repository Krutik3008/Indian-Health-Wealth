import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

// Remove auth interceptor since JWT is removed

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

export const assessmentAPI = {
  submit: (responses) => api.post('/assessment/submit', { responses }),
  getHistory: () => api.get('/assessment/history'),
};

export const recommendationsAPI = {
  getByDosha: (dosha) => api.get(`/recommendations/${dosha}`),
  getPersonalized: () => api.get('/recommendations/personalized'),
};

export const recipesAPI = {
  getAll: (params) => api.get('/recipes', { params }),
  getByDosha: (dosha) => api.get(`/recipes/dosha/${dosha}`),
};

export const forumAPI = {
  getPosts: () => api.get('/forum'),
  createPost: (postData) => api.post('/forum', postData),
  deletePost: (postId) => api.delete(`/forum/${postId}`),
};

export const progressAPI = {
  getStats: () => api.get('/progress/stats'),
  logVikriti: (data) => api.post('/progress/vikriti', data),
};

export default api;