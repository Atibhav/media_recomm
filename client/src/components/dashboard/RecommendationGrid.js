import MovieCard from "./MovieCard"
import SkeletonLoader from "../common/SkeletonLoader"

function RecommendationGrid({ movies, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="recommendation-grid">
        {[...Array(8)].map((_, index) => (
          <SkeletonLoader key={index} type="movie-card" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">Error: {error}</div>
        <button onClick={() => window.location.reload()} className="retry-button">
          Try Again
        </button>
      </div>
    )
  }

  if (!movies?.length) {
    return (
      <div className="empty-state">
        <p>No movies found matching your criteria</p>
      </div>
    )
  }

  return (
    <div className="recommendation-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}

export default RecommendationGrid