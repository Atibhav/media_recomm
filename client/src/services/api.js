import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Debug log for API URL
console.log('API URL:', process.env.REACT_APP_API_URL);

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        console.log('Making request to:', config.baseURL + config.url); //debugging logging
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

// Handle auth errors
api.interceptors.response.use(
    (response) => {
        console.log('Received response:', {  //debugging logging
            url: response.config.url,
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('API Error:', {  //debugging logging
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
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
    getRecommended: (userId) => api.get(`/api/movies/recommended/${userId}`)
};

export const watchlistAPI = {
    getWatchlist: () => api.get('/api/movies/user/watchlist'),
    addToWatchlist: (movieId) => api.post('/api/movies/user/watchlist', { movieId }),
    removeFromWatchlist: (movieId) => api.delete(`/api/movies/user/watchlist/${movieId}`),
    checkStatus: (movieId) => api.get(`/api/movies/user/watchlist/check/${movieId}`)
};

export const userAPI = {
  getProfile: () => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  getPreferences: () => api.get('/api/users/preferences'),
  updatePreferences: (data) => api.put('/api/users/preferences', data)
};

export default api;