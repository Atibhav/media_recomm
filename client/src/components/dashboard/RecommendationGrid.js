import MovieCard from "./MovieCard"
import SkeletonLoader from "../common/SkeletonLoader"
import ErrorFallback from "../error/ErrorFallback"

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
    return <ErrorFallback error={{ message: error }} resetError={() => window.location.reload()} />;
  }

  if (!movies?.length) {
    return (
      <div className="empty-state">
        <p>No movies found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="recommendation-grid">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default RecommendationGrid;