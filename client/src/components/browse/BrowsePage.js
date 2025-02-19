import { useState, useEffect } from 'react';
import { movieAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorFallback from '../error/ErrorFallback';

function BrowsePage() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity'
  });

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [filters]);

  const fetchGenres = async () => {
    try {
      const response = await movieAPI.getGenres();
      setGenres(response.data);
    } catch (err) {
      console.error('Genre fetch error:', err);
      setError('Failed to fetch genres');
    }
  };

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const response = await movieAPI.browse(filters);
      setMovies(response.data);
    } catch (err) {
      console.error('Movie fetch error:', err);
      setError('Failed to fetch movies');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (error) {
    return <ErrorFallback error={{ message: error }} resetError={() => {
      setError(null);
      fetchMovies();
    }} />;
  }

  return (
    <div className="browse-page">
      <div className="browse-header">
        <h1>Browse Movies</h1>
        <div className="filters">
          <div className="filter-group">
            <label>Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              {genres?.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">All Ratings</option>
              <option value="9">9+ ⭐</option>
              <option value="8">8+ ⭐</option>
              <option value="7">7+ ⭐</option>
              <option value="6">6+ ⭐</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
              <option value="release_date">Release Date</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="movie-grid">
          {[...Array(12)].map((_, i) => (
            <SkeletonLoader key={i} />
          ))}
        </div>
      ) : (
        <>
          <div className="results-info">
            Found {movies.length} movies
          </div>

          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard 
                key={movie.id} 
                movie={movie}
              />
            ))}
          </div>

          {movies.length === 0 && (
            <div className="no-results">
              <p>No movies found matching your criteria</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default BrowsePage;