import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import MovieCard from './MovieCard';

function Dashboard() {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch popular movies instead of recommended if user is new
        const recommendResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/movies/popular`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!recommendResponse.ok) {
          throw new Error('Failed to fetch popular movies');
        }

        const recommendData = await recommendResponse.json();
        setRecommendations(recommendData);

        // Fetch trending movies
        const trendingResponse = await fetch(
          `${process.env.REACT_APP_API_URL}/api/movies/trending`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!trendingResponse.ok) {
          throw new Error('Failed to fetch trending movies');
        }

        const trendingData = await trendingResponse.json();
        setTrendingMovies(trendingData);

      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      fetchMovies();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading your movie recommendations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <h1>Welcome{user?.name ? `, ${user.name}` : ''}!</h1>
      
      {recommendations.length > 0 && (
        <section className="recommendations">
          <h2>Popular Movies</h2>
          <div className="movie-grid">
            {recommendations.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg'; // Add a placeholder image
                }}
              />
            ))}
          </div>
        </section>
      )}

      {trendingMovies.length > 0 && (
        <section className="trending">
          <h2>Trending Now</h2>
          <div className="movie-grid">
            {trendingMovies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
                onError={(e) => {
                  e.target.src = '/placeholder-movie.jpg'; // Add a placeholder image
                }}
              />
            ))}
          </div>
        </section>
      )}

      {!recommendations.length && !trendingMovies.length && (
        <div className="no-movies">
          <p>No movies available at the moment. Please check back later.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;