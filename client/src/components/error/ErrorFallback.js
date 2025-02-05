function ErrorFallback({ error, resetError }) {
    return (
      <div className="error-fallback">
        <h2>Something went wrong:</h2>
        <pre>{error.message}</pre>
        <button onClick={resetError}>Try again</button>
      </div>
    );
  }
  
  export default ErrorFallback;