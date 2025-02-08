export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
};

// Additional utility functions
export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};