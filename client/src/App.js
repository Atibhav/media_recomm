import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Layout from "./components/layout/Layout"
import LoginForm from "./components/auth/LoginForm"
import RegisterForm from "./components/auth/RegisterForm"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Dashboard from "./components/dashboard/Dashboard"
import WatchlistPage from './components/watchlist/WatchlistPage'
import SearchResults from './components/search/SearchResults'
import MovieDetails from './components/movies/MovieDetails'  
import { AuthProvider } from "./hooks/useAuth"
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
import './styles/auth-forms.css'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Auth routes outside of Layout */}
            <Route path="/auth-callback" element={<AuthCallback />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            
            {/* All other routes inside Layout */}
            <Route element={<Layout />}>  {/* Changed to use outlet */}
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
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;