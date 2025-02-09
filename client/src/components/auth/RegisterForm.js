import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';  // Update this import

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: '' // Optional
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');

      // Validation
      if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
      }

      setLoading(true);

      try {
          await register({  // Use register from useAuth hook
              email: formData.email,
              password: formData.password,
              username: formData.username || undefined
          });
          navigate('/');
      } catch (err) {
          console.error('Registration error:', err);
          setError(
              err.response?.data?.message || 
              'Server error during registration. Please try again.'
          );
      } finally {
          setLoading(false);
      }
  };

    return (
        <div className="auth-form-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h2>Create Account</h2>
                
                {error && <div className="error-message">{error}</div>}
                
                <div className="form-group">
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({
                            ...formData,
                            username: e.target.value
                        })}
                        placeholder="Username (optional)"
                    />
                </div>

                <div className="form-group">
                    <input
                        type="email"
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
                        value={formData.password}
                        onChange={(e) => setFormData({
                            ...formData,
                            password: e.target.value
                        })}
                        placeholder="Password"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({
                            ...formData,
                            confirmPassword: e.target.value
                        })}
                        placeholder="Confirm Password"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="auth-button"
                    disabled={loading}
                >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;