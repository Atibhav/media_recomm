import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Layout from "./components/layout/Layout"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Dashboard from "./components/dashboard/Dashboard"
import WatchlistPage from './components/watchlist/WatchlistPage'
import SearchResults from './components/search/SearchResults'
import MovieDetails from './components/movies/MovieDetails'  
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import BrowsePage from './components/browse/BrowsePage'
import UserProfile from './components/profile/UserProfile'
import ErrorBoundary from './components/error/ErrorBoundary'

import "./App.css"
import "./styles/main.css"
import "./styles/watchlist.css"
import "./styles/search.css"
import "./styles/movie-details.css"  
import './styles/browse.css'
import './styles/error.css'

// New component to handle auth callback
function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (token) {
      // Store token
      localStorage.setItem('token', token);
      // Update auth context
      login(token);
      // Redirect to dashboard
      navigate('/dashboard');
    } else if (error) {
      console.error('Auth error:', error);
      navigate('/login', { state: { error } });
    }
  }, [navigate, login, location]);

  return <div>Processing authentication...</div>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
      <Route path="/movie/:movieId" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
      <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Layout>
            <AppRoutes />
          </Layout>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;