import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { movieAPI } from '../../services/api';
import MovieCard from '../dashboard/MovieCard';
import SkeletonLoader from '../common/SkeletonLoader';
import ErrorFallback from '../error/ErrorFallback';

function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  const [filters, setFilters] = useState({
    genre: searchParams.get('genre') || '',
    year: searchParams.get('year') || '',
    rating: searchParams.get('rating') || '',
    sortBy: searchParams.get('sortBy') || 'popularity',
    page: currentPage
  });

  const [genres, setGenres] = useState([]);
  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  const fetchGenres = useCallback(async () => {
    try {
      const response = await movieAPI.getGenres();
      setGenres(response.data);
    } catch (err) {
      setError('Failed to fetch genres. Please try again later.');
      console.error('Genre fetch error:', err);
    }
  }, []);

  const fetchMovies = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await movieAPI.browse({ 
        ...filters, 
        page: currentPage 
      });
      
      const { movies: moviesList, totalPages: total } = response.data;
      setMovies(moviesList);
      setTotalPages(total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch movies. Please try again.');
      console.error('Movie fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    fetchMovies();
    setSearchParams({ ...filters, page: currentPage });
  }, [fetchMovies, filters, setSearchParams, currentPage]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setSearchParams({ ...newFilters, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="page-btn prev"
      >
        ←
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="page-btn"
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="ellipsis">...</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-btn ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="ellipsis">...</span>);
      }
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="page-btn"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="page-btn next"
      >
        →
      </button>
    );

    return pages;
  };

  if (isLoading && !movies.length) {
    return (
      <div className="movie-grid">
        {[...Array(12)].map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>
    );
  }

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
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
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

      <div className="results-info">
        Found {movies.length} movies • Page {currentPage} of {totalPages}
      </div>

      <div className="movie-grid">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>

      {isLoading && <div className="loading-overlay">Loading...</div>}

      {totalPages > 1 && (
        <div className="pagination">
          {renderPagination()}
        </div>
      )}
    </div>
  );
}

export default BrowsePage;