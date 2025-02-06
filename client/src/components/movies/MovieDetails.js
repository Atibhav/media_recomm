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
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsError, setRecommendationsError] = useState(null);

  const fetchMovieDetails = useCallback(async () => {
    try {
      console.log('1. Fetching movie details for:', movieId);
      setIsLoading(true);
      const response = await movieAPI.getById(movieId);
      console.log('2. Movie details response:', response.data);
      setMovie(response.data);
    } catch (err) {
      console.error('3. Error fetching movie details:', err);
      setError('Failed to fetch movie details');
    } finally {
      setIsLoading(false);
    }
  }, [movieId]);

  const fetchRecommendations = useCallback(async () => {
    try {
      console.log('4. Fetching recommendations for movie:', movieId);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/movies/${movieId}/recommendations`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      console.log('5. Recommendations response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('6. Received recommendations:', data);
      setRecommendations(data);
    } catch (error) {
      console.error('7. Error fetching recommendations:', error);
      setRecommendationsError('Failed to fetch recommendations');
    }
  }, [movieId]);

  const checkWatchlistStatus = useCallback(async () => {
    try {
      console.log('8. Checking watchlist status');
      const response = await watchlistAPI.checkStatus(user.id, movieId);
      console.log('9. Watchlist status:', response.data);
      setIsInWatchlist(response.data.isInWatchlist);
    } catch (err) {
      console.error('10. Error checking watchlist status:', err);
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
    fetchRecommendations();
    checkWatchlistStatus();
  }, [fetchMovieDetails, fetchRecommendations, checkWatchlistStatus]);

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

        {/* Add Recommendations Section */}
        <div className="recommendations">
          <h3>Recommended Movies</h3>
          {recommendationsError ? (
            <div className="error">{recommendationsError}</div>
          ) : recommendations.length > 0 ? (
            <div className="recommendations-grid">
              {recommendations.map(rec => (
                <div key={rec.id} className="recommendation-card" onClick={() => navigate(`/movie/${rec.id}`)}>
                  <img src={rec.posterPath} alt={rec.title} />
                  <h4>{rec.title}</h4>
                  <span className="rating">★ {rec.voteAverage.toFixed(1)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No recommendations available</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;