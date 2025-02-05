import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, watchlistAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

function MovieDetails() {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const fetchMovieDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await movieAPI.getById(movieId);
      setMovie(response.data);
    } catch (err) {
      setError('Failed to fetch movie details');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  const checkWatchlistStatus = useCallback(async () => {
    try {
      const response = await watchlistAPI.checkStatus(user.id, movieId);
      setIsInWatchlist(response.data.isInWatchlist);
    } catch (err) {
      console.error('Error checking watchlist status:', err);
    }
  }, [movieId, user.id]);

  const handleWatchlistToggle = async () => {
    try {
      if (isInWatchlist) {
        await watchlistAPI.removeFromWatchlist(user.id, movieId);
      } else {
        await watchlistAPI.addToWatchlist(user.id, movieId);
      }
      setIsInWatchlist(!isInWatchlist);
      window.dispatchEvent(new CustomEvent('watchlistUpdated'));
    } catch (err) {
      console.error('Error updating watchlist:', err);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
    checkWatchlistStatus();
  }, [fetchMovieDetails, checkWatchlistStatus]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!movie) return <div className="error">Movie not found</div>;

  return (
    <div className="movie-details">
      <button className="back-button" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="movie-header">
        <img 
          src={movie.backdrop_path} 
          alt={movie.title} 
          className="backdrop"
        />
        <div className="movie-info-overlay">
          <h1>{movie.title}</h1>
          <div className="movie-meta">
            <span className="year">{new Date(movie.release_date).getFullYear()}</span>
            <span className="rating">★ {movie.vote_average.toFixed(1)}</span>
            <span className="runtime">{movie.runtime} min</span>
          </div>
        </div>
      </div>

      <div className="movie-content">
        <div className="main-info">
          <p className="overview">{movie.overview}</p>
          
          <div className="genres">
            {movie.genres.map(genre => (
              <span key={genre} className="genre-tag">{genre}</span>
            ))}
          </div>

          <button 
            className={`watchlist-btn ${isInWatchlist ? 'remove' : 'add'}`}
            onClick={handleWatchlistToggle}
          >
            {isInWatchlist ? '- Remove from Watchlist' : '+ Add to Watchlist'}
          </button>
        </div>

        <div className="additional-info">
          <h3>Additional Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Director</span>
              <span className="value">{movie.director}</span>
            </div>
            <div className="info-item">
              <span className="label">Cast</span>
              <span className="value">{movie.cast?.join(', ')}</span>
            </div>
            <div className="info-item">
              <span className="label">Release Date</span>
              <span className="value">
                {new Date(movie.release_date).toLocaleDateString()}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Original Language</span>
              <span className="value">{movie.original_language}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;