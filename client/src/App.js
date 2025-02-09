import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Dashboard from "./components/dashboard/Dashboard"
import WatchlistPage from './components/watchlist/WatchlistPage'
import SearchResults from './components/search/SearchResults'
import MovieDetails from './components/movies/MovieDetails'  
import { AuthProvider } from "./contexts/AuthContext"
import BrowsePage from './components/browse/BrowsePage'
import UserProfile from './components/profile/UserProfile'
import ErrorBoundary from './components/error/ErrorBoundary'
import AuthCallback from './components/auth/AuthCallback'
import NotFound from './components/error/NotFound'

import "./App.css"
import "./styles/main.css"
import "./styles/watchlist.css"
import "./styles/search.css"
import "./styles/movie-details.css"  
import './styles/browse.css'
import './styles/error.css'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/auth-callback" element={<AuthCallback />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/watchlist" element={<ProtectedRoute><WatchlistPage /></ProtectedRoute>} />
      <Route path="/search" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
      <Route path="/search/:query" element={<ProtectedRoute><SearchResults /></ProtectedRoute>} />
      <Route path="/movie/:movieId" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
      <Route path="/browse" element={<ProtectedRoute><BrowsePage /></ProtectedRoute>} />
      <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
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