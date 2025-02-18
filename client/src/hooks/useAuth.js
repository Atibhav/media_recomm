import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '../services/api';
import { setAuthToken, getAuthToken, clearAuth, isAuthenticated } from '../utils/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                setLoading(false);
                return;
            }
            const response = await authAPI.verifyToken();
            setUser(response.data.user);
        } catch (error) {
            clearAuth();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        try {
            // If we have a token (from OAuth), just verify and set the user
            if (credentials.token) {
                console.log('OAuth login with token');
                setAuthToken(credentials.token);
                const response = await authAPI.verifyToken();
                setUser(response.data.user);
                return response.data.user;
            }
            
            // Regular email/password login
            console.log('Regular login with credentials');
            const response = await authAPI.login(credentials);
            const { token, user } = response.data;
            setAuthToken(token);
            setUser(user);
            return user;
        } catch (error) {
            console.error('Login error:', error);
            clearAuth();
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            console.log('Starting registration in useAuth with:', {
                email: userData.email,
                username: userData.username
                // Don't log password
            });
            
            const response = await authAPI.register(userData);
            console.log('Registration API response:', response);
            
            const { token, user } = response.data;
            console.log('Setting auth token and user');
            setAuthToken(token);
            setUser(user);
            return user;
        } catch (error) {
            console.error('Registration error in useAuth:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            clearAuth();
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            loading, 
            login, 
            logout,
            register,
            isAuthenticated: isAuthenticated()
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};