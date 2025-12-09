import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { movieAPI } from '../../services/api';
import MovieCard from './MovieCard';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorFallback from '../error/ErrorFallback';

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

        const [recommendData, trendingData] = await Promise.all([
          movieAPI.browse({ type: 'popular' }),
          movieAPI.getTrending()
        ]);

        setRecommendations(recommendData.data);
        setTrendingMovies(trendingData.data);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    // Fetch movies if user is authenticated OR if we want to show public content
    // For now, we assume dashboard is protected, so we wait for user
    if (user) {
      fetchMovies();
    } else {
        // If user is null but we are on dashboard, it might be loading auth
        // We should wait for auth loading to finish
        // But if auth is done and user is null, we should probably redirect (handled by ProtectedRoute)
        // For now, let's just stop loading if we have no user to prevent infinite shimmer
        const token = localStorage.getItem('token');
        if (!token) setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <SkeletonLoader count={8} />;
  }

  if (error) {
    return <ErrorFallback error={{ message: error }} resetError={() => window.location.reload()} />;
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
                  e.target.src = '/placeholder-movie.jpg';
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
                  e.target.src = '/placeholder-movie.jpg';
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