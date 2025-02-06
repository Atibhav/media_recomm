import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, loading, login, logout } = context;

    return {
        isAuthenticated: !!user,
        isLoading: loading,
        user,
        login: (token) => {
            // Store token
            localStorage.setItem('token', token);
            
            // Call the context's login method
            login(token);
        },
        logout: () => {
            // Clear token
            localStorage.removeItem('token');
            
            // Call the context's logout method
            logout();
        },
        // Spread other context methods
        ...context
    };
};

export default useAuth;