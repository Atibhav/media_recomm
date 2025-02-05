import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { watchlistAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';

function WatchlistPage() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setIsLoading(true);
        const response = await watchlistAPI.getWatchlist(user.id);
        setWatchlist(response.data);
      } catch (err) {
        setError('Failed to fetch watchlist');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatchlist();

    // Listen for watchlist updates from other components
    const handleWatchlistUpdate = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, [user.id]);

  const handleRemoveFromWatchlist = async (movieId) => {
    try {
      await watchlistAPI.removeFromWatchlist(user.id, movieId);
      setWatchlist(watchlist.filter(movie => movie.id !== movieId));
      window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  if (isLoading) return <div className="loading">Loading watchlist...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="watchlist-page">
      <h1>My Watchlist</h1>
      {watchlist.length === 0 ? (
        <div className="empty-watchlist">
          <p>Your watchlist is empty</p>
          <p>Add movies to your watchlist to see them here</p>
        </div>
      ) : (
        <>
          <div className="watchlist-count">
            {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} in your watchlist
          </div>
          <div className="movie-grid">
            {watchlist.map(movie => (
              <div key={movie.id} className="watchlist-item">
                <MovieCard movie={movie} />
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveFromWatchlist(movie.id)}
                >
                  Remove from Watchlist
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default WatchlistPage;