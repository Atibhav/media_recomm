import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function AuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (token) {
            // Store token and update auth context
            localStorage.setItem('token', token);
            login(token);
            
            // Redirect to dashboard
            navigate('/dashboard');
        } else {
            // Handle error case
            navigate('/login');
        }
    }, [navigate, login, location]);

    return (
        <div className="auth-callback">
            <p>Processing authentication...</p>
        </div>
    );
}

export default AuthCallback;