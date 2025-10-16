import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { setAuthToken } from '../../utils/auth';

function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                
                if (token) {
                    setAuthToken(token);
                    await login({ token });
                    navigate('/dashboard');
                } else {
                    throw new Error('No token received');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                navigate('/login');
            }
        };
    
        handleCallback();
    }, [navigate, login, location]);

    return (
        <div className="auth-callback">
            <p>Processing authentication...</p>
            <p className="auth-callback-info">Please wait while we complete your sign-in...</p>
        </div>
    );
}

export default AuthCallback;