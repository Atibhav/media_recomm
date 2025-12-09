import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status);
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout'),
    verifyToken: () => api.get('/api/auth/verify'),
    googleLogin: () => window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/google`

};

export const movieAPI = {
    getPopular: () => api.get('/api/movies/popular'),
    search: (query) => api.get('/api/movies/search', { params: { query }}),
    getTrending: () => api.get('/api/movies/trending'),
    getById: (id) => api.get(`/api/movies/${id}/details`),
    getRecommended: (userId) => api.get(`/api/movies/recommended/${userId}`),
    browse: (params) => api.get('/api/movies/browse', { params }),
    getGenres: () => api.get('/api/movies/genres')
};

export const watchlistAPI = {
    getWatchlist: () => api.get('/api/watchlist'),
    addToWatchlist: (movieId) => api.post('/api/watchlist', { movieId }),
    removeFromWatchlist: (movieId) => api.delete(`/api/watchlist/${movieId}`),
    checkStatus: (movieId) => api.get(`/api/watchlist/check/${movieId}`)
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getPreferences: () => api.get('/api/users/preferences'),
  updatePreferences: (data) => api.put('/api/users/preferences', data)
};

export default api;