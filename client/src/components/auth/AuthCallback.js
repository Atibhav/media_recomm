function AuthCallback() {
    console.log('AuthCallback component rendered'); // debug log
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
                    console.log('Setting auth token...');
                    setAuthToken(token);
                    
                    console.log('Calling login...');
                    await login({ token });
                    
                    console.log('Login successful, navigating to dashboard...');
                    navigate('/dashboard');
                } else {
                    throw new Error('No token received');
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                // Add more detailed error logging
                if (error.response) {
                    console.error('Error response:', error.response.data);
                }
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