import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { movieAPI } from '../../services/api';
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
        
        // Fetch recommended movies
        const recommendResponse = await movieAPI.getRecommended();
        setRecommendations(recommendResponse.data);

        // Fetch trending movies
        const trendingResponse = await movieAPI.getTrending();
        setTrendingMovies(trendingResponse.data);

      } catch (err) {
        setError('Failed to fetch movies');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [user.id]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <section className="recommendations">
        <h2>Recommended for You</h2>
        <div className="movie-grid">
          {recommendations.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="trending">
        <h2>Trending Now</h2>
        <div className="movie-grid">
          {trendingMovies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;