import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';
import SearchFilters from './SearchFilters';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'relevance'
  });

  useEffect(() => {
    const searchMovies = async () => {
      if (!query.trim()) {
        setMovies([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/movies/search?q=${encodeURIComponent(query)}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (!response.ok) throw new Error('Search failed');
        
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        setError('Failed to search movies');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    searchMovies();
  }, [query, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (isLoading) return <div className="loading">Searching movies...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      <SearchFilters onFilterChange={handleFilterChange} />
      {movies.length === 0 ? (
        <div className="no-results">
          No movies found matching "{query}"
        </div>
      ) : (
        <>
          <div className="results-count">
            Found {movies.length} movies
          </div>
          <div className="movie-grid">
            {movies.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SearchResults;