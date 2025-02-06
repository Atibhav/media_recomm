import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

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
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      console.log('Attempting login with:', formData); // Debug log
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      console.log('Login response:', data); // Debug log

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "An error occurred during login");
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Hardcode both URLs for testing
    const backendUrl = 'https://media-recomm.onrender.com';
    const frontendUrl = 'https://media-recomm-frontend.onrender.com';
    
    console.log('Frontend URL:', frontendUrl);
    console.log('Backend URL:', backendUrl);
    
    const googleAuthUrl = `${backendUrl}/api/auth/google`;
    console.log('Redirecting to:', googleAuthUrl);
    
    // Add a small delay to see the logs
    setTimeout(() => {
        window.location.href = googleAuthUrl;
    }, 1000);
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