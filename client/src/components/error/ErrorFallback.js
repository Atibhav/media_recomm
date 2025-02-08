function ErrorFallback({ error, resetError }) {
  const isAuthError = error.status === 401;

  return (
    <div className="error-fallback">
      <h2>{isAuthError ? 'Authentication Error' : 'Something went wrong'}</h2>
      <pre>{error.message}</pre>
      {isAuthError ? (
        <button onClick={() => window.location.href = '/login'}>
          Go to Login
        </button>
      ) : (
        <button onClick={resetError} className="retry-button">
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorFallback;