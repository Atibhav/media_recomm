import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { watchlistAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorFallback from '../error/ErrorFallback';

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

    const handleWatchlistUpdate = () => fetchWatchlist();
    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);
    return () => window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
  }, [user.id]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorFallback error={{ message: error }} resetError={() => setError(null)} />;

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