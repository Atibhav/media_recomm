import { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        if (token) {
            // For now, just set a basic user object
            setUser({ id: 'test_user_1' }); // Using test user from the documentation
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            // Simulate API call for now
            // Later we'll integrate with real backend
            if (credentials.email && credentials.password) {
                const user = { id: 'test_user_1' };
                localStorage.setItem('token', 'dummy_token');
                setUser(user);
                return { success: true };
            }
            throw new Error('Invalid credentials');
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            // Simulate API call for now
            if (userData.email && userData.password) {
                const user = { id: 'test_user_1' };
                localStorage.setItem('token', 'dummy_token');
                setUser(user);
                return { success: true };
            }
            throw new Error('Invalid user data');
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            loading 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;