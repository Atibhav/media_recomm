import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"
import { authAPI } from "../../services/api"
import { setAuthToken } from "../../utils/auth"

function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      const response = await authAPI.login(formData);
      const { token } = response.data;

      if (token) {
        setAuthToken(token);
        login(token);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    const backendUrl = process.env.REACT_APP_API_URL || 'https://media-recomm.onrender.com';
    const googleAuthUrl = `${backendUrl}/api/auth/google`;
    window.location.href = googleAuthUrl;
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className="auth-button"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button 
          type="button"
          className="google-auth-button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          Sign in with Google
        </button>

        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Sign up</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default LoginForm