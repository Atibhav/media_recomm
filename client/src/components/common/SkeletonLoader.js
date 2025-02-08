function SkeletonLoader() {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-poster pulse"></div>
      <div className="skeleton-content">
        <div className="skeleton-title pulse"></div>
        <div className="skeleton-meta">
          <div className="skeleton-rating pulse"></div>
          <div className="skeleton-year pulse"></div>
        </div>
        <div className="skeleton-description pulse"></div>
      </div>
    </div>
  );
}

export default SkeletonLoader;