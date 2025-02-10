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
                console.log('AuthCallback mounted, search params:', location.search);
                const params = new URLSearchParams(location.search);
                const token = params.get('token');
                
                console.log('Received token:', token ? 'yes' : 'no');
                
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
        </div>
    );
}

export default AuthCallback;