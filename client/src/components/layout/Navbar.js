import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect, useCallback } from 'react';

function Navbar() {
  const { user, logout } = useAuth();
  const [watchlistCount, setWatchlistCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const fetchWatchlistCount = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/watchlist/count/${user.id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch watchlist count');
      
      const data = await response.json();
      setWatchlistCount(data.count);
    } catch (err) {
      console.error('Failed to fetch watchlist count:', err);
      setWatchlistCount(0); // Reset count on error
    }
  }, [user]);

  useEffect(() => {
    fetchWatchlistCount();
  }, [fetchWatchlistCount]);

  useEffect(() => {
    const handleWatchlistUpdate = () => {
      fetchWatchlistCount();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, [fetchWatchlistCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleProfileClick = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest('.profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" className="logo">MovieRec</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/browse">Browse</Link>
        <Link to="/watchlist" className="watchlist-link">
          My List
          {watchlistCount > 0 && (
            <span className="watchlist-count" key={watchlistCount}>
              {watchlistCount}
            </span>
          )}
        </Link>
      </div>

      <div className={`nav-search ${isSearchOpen ? 'active' : ''}`}>
        <form onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchOpen(true)}
            onBlur={() => setIsSearchOpen(false)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>

      <div className="nav-user">
        {user ? (
          <div className="profile-menu-container">
            <div className="profile-trigger" onClick={handleProfileClick}>
              <img 
                src={user.avatar || '/default-avatar.png'} 
                alt="Profile" 
                className="profile-avatar"
              />
              <span className="user-name">{user.name}</span>
            </div>
            
            {isProfileMenuOpen && (
              <div className="profile-menu">
                <Link to="/user-profile" className="profile-menu-item">
                  Profile Settings
                </Link>
                <button onClick={logout} className="profile-menu-item logout-btn">
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;