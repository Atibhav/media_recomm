import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { watchlistAPI } from '../../services/api';

function MovieCard({ movie, onRemove, isWatchlist = false }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user } = useAuth();

  const handleWatchlistAction = async () => {
    setIsLoading(true);
    try {
      if (isWatchlist) {
        await onRemove();
        setNotification({
          type: 'success',
          message: 'Removed from watchlist'
        });
      } else {
        await watchlistAPI.addToWatchlist(user.id, movie.id);
        setNotification({
          type: 'success',
          message: 'Added to watchlist!'
        });
      }
      window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    } catch (error) {
      setNotification({
        type: 'error',
        message: isWatchlist ? 'Failed to remove' : 'Failed to add to watchlist'
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <div 
      className="movie-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={movie.poster_path || "/placeholder.svg"} 
        alt={movie.title} 
        className="movie-poster" 
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="movie-rating">★ {movie.vote_average.toFixed(1)}</span>
          <span className="movie-year">
            {new Date(movie.release_date).getFullYear()}
          </span>
        </div>
      </div>
      
      {isHovered && (
        <div className="movie-overlay">
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-overview">{movie.overview}</p>
          <div className="movie-genres">
            {movie.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>
          <div className="movie-actions">
            <button 
              className={`watchlist-btn ${isLoading ? 'loading' : ''}`}
              onClick={handleWatchlistAction}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 
                isWatchlist ? '- Remove from Watchlist' : '+ Add to Watchlist'}
            </button>
          </div>
          {notification && (
            <div className={`notification ${notification.type}`}>
              {notification.message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MovieCard;