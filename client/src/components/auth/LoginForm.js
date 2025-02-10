import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authAPI } from '../../services/api';

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(formData);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || 
                'Invalid credentials. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        authAPI.googleLogin();
    };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Login</h2>
                
                {error && <div className="auth-error">{error}</div>}
                
                <div className="form-group">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({
                            ...formData,
                            email: e.target.value
                        })}
                        placeholder="Email"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                        })}
                        placeholder="Password"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="auth-divider">
                    <span>or</span>
                </div>

                <button 
                    type="button" 
                    className="google-auth-button"
                    onClick={handleGoogleLogin}
                >
                    <img src="/search.png" alt="Google" 
                    style={{ 
                        width: '18px', 
                        height: '18px',
                        marginRight: '10px',
                        verticalAlign: 'middle'  // This helps center the icon vertically
                    }}/>
                    Sign in with Google
                </button>

                <div className="auth-links">
                    <p>Don't have an account? <a href="/register">Sign up</a></p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;