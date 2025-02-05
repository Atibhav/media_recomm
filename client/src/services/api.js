import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true
});

// API endpoints organized by feature
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  logout: () => api.get('/api/auth/logout')
};

export const movieAPI = {
  browse: (params) => api.get('/api/movies/browse', { params }),
  getById: (id) => api.get(`/api/movies/${id}`),
  search: (query) => api.get('/api/movies/search', { params: { q: query } }),
  getGenres: () => api.get('/api/movies/genres'),
  getRecommended: (userId) => api.get(`/api/movies/recommended/${userId}`),
  getTrending: () => api.get('/api/movies/trending')
};

export const watchlistAPI = {
  getWatchlist: (userId) => api.get(`/api/user/watchlist/${userId}`),
  addToWatchlist: (userId, movieId) => api.post('/api/user/watchlist', { userId, movieId }),
  removeFromWatchlist: (userId, movieId) => api.delete(`/api/user/watchlist/${userId}/${movieId}`),
  checkStatus: (userId, movieId) => api.get(`/api/user/watchlist/${userId}/check/${movieId}`)
};

export const userAPI = {
  getPreferences: (userId) => api.get(`/api/user/preferences/${userId}`),
  updateLanguage: (userId, data) => api.put(`/api/user/preferences/${userId}/language`, data),
  updateFilters: (userId, data) => api.put(`/api/user/preferences/${userId}/filters`, data),
  updateGenres: (userId, data) => api.put(`/api/user/preferences/${userId}/genres`, data)
};

export default api;