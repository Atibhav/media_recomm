import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    const { user, loading } = context;

    return {
        isAuthenticated: !!user,
        isLoading: loading,
        user,
        ...context  // This spreads login, register, logout methods
    };
};

export default useAuth;