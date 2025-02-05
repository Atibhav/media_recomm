function SkeletonLoader() {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-poster"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta">
          <div className="skeleton-rating"></div>
          <div className="skeleton-year"></div>
        </div>
      </div>
    </div>
  )
}

export default SkeletonLoader