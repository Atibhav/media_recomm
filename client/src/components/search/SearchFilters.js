import { useState, useEffect } from 'react';
import { movieAPI } from '../../services/api';

function SearchFilters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'relevance'
  });
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await movieAPI.getGenres();
        setGenres(response.data);
      } catch (err) {
        console.error('Failed to fetch genres:', err);
      }
    };
    fetchGenres();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const years = Array.from(
    { length: new Date().getFullYear() - 1900 }, 
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="search-filters">
      <div className="filter-group">
        <label>Genre</label>
        <select 
          value={filters.genre}
          onChange={(e) => handleFilterChange('genre', e.target.value)}
        >
          <option value="">All Genres</option>
          {genres.map(genre => (
            <option key={genre} value={genre.toLowerCase()}>{genre}</option>
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
          <option value="relevance">Relevance</option>
          <option value="rating">Rating</option>
          <option value="year">Year</option>
          <option value="title">Title</option>
        </select>
      </div>
    </div>
  );
}

export default SearchFilters;