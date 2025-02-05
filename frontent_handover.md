# Movie Recommendation System - Frontend Development Handover

## Project Overview
Backend ML service that provides personalized movie recommendations using hybrid filtering. The frontend needs to consume these recommendations and present them in a Netflix-style interface.

## API Documentation

### 1. Get Recommendations
```typescript
// Endpoint: POST /recommendations
// Content-Type: application/json

// Request
interface RecommendationRequest {
    userId: string;
}

// Response
interface RecommendationResponse {
    success: boolean;
    recommendations: Array<{
        movieId: string;
        title: string;
        poster_path: string;        // TMDb poster URL
        overview: string;           // Movie description
        vote_average: number;       // Rating out of 10
        release_date: string;       // Format: "YYYY-MM-DD"
        genres: string[];
        recommendation_type: "collaborative" | "content";
        recommendation_reasons: string[];  // Why this movie was recommended
        confidence_score: number;    // 0 to 1
    }>;
}

// Example Usage
const getRecommendations = async (userId: string) => {
    try {
        const response = await fetch('/recommendations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
        });
        return await response.json();
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
};
```

## Data Structures

### Movie Object
```typescript
interface Movie {
    _id: string;
    title: string;
    poster_path: string;      // Format: "/path/to/poster.jpg"
    overview: string;
    vote_average: number;     // Range: 0-10
    release_date: string;     // Format: "YYYY-MM-DD"
    genres: string[];         // e.g., ["Action", "Drama"]
    director: string;
    cast: string[];
    keywords: string[];
}
```

### Recommendation Types
```typescript
type RecommendationType = "collaborative" | "content";

interface RecommendationReason {
    type: string;            // e.g., "genre", "actor", "director"
    description: string;     // e.g., "Because you like Action movies"
}
```

## Required Pages & Components

### 1. Main Dashboard
```jsx
// Components needed:
- RecommendationGrid
- MovieCard
- FilterBar (optional)
- LoadingState
- ErrorBoundary

// Example Structure
function Dashboard() {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch recommendations on mount
    useEffect(() => {
        fetchRecommendations();
    }, []);

    return (
        <div className="dashboard">
            <FilterBar /> {/* Optional */}
            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorMessage error={error} />
            ) : (
                <RecommendationGrid recommendations={recommendations} />
            )}
        </div>
    );
}
```

### 2. Movie Card Component
```jsx
// Required Features:
- Poster image
- Title overlay
- Rating badge
- Genre tags
- Recommendation reasons
- Confidence score indicator

// Example Structure
function MovieCard({ movie }) {
    return (
        <div className="movie-card">
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                alt={movie.title} 
            />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="rating">{movie.vote_average}</div>
                <div className="genres">
                    {movie.genres.map(genre => (
                        <span key={genre} className="genre-tag">
                            {genre}
                        </span>
                    ))}
                </div>
                <div className="recommendation-reasons">
                    {movie.recommendation_reasons.map(reason => (
                        <span key={reason} className="reason-tag">
                            {reason}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

## CSS Guidelines

### 1. Color Scheme
```css
:root {
    /* Main colors */
    --background-primary: #141414;    /* Main background */
    --background-secondary: #181818;  /* Card background */
    --text-primary: #ffffff;          /* Main text */
    --text-secondary: #b3b3b3;        /* Secondary text */
    --accent: #e50914;                /* Netflix red */
    
    /* UI colors */
    --rating-high: #46d369;           /* High ratings */
    --rating-medium: #ffa534;         /* Medium ratings */
    --rating-low: #db2360;            /* Low ratings */
}
```

### 2. Typography
```css
:root {
    /* Font sizes */
    --font-xs: 0.75rem;    /* 12px */
    --font-sm: 0.875rem;   /* 14px */
    --font-base: 1rem;     /* 16px */
    --font-lg: 1.125rem;   /* 18px */
    --font-xl: 1.25rem;    /* 20px */

    /* Font weights */
    --font-normal: 400;
    --font-medium: 500;
    --font-bold: 700;
}
```

## Error Handling

### Error States to Handle
1. Loading state
2. Network errors
3. Empty recommendations
4. Invalid user ID

```jsx
// Example Error Component
function ErrorMessage({ error }) {
    return (
        <div className="error-container">
            <h2>Oops! Something went wrong</h2>
            <p>{error.message}</p>
            <button onClick={() => window.location.reload()}>
                Try Again
            </button>
        </div>
    );
}
```

## Performance Considerations

1. **Image Loading**
   - Use appropriate TMDb image sizes
   - Implement lazy loading
   - Add loading placeholders

2. **State Management**
   - Cache recommendations
   - Implement pagination if needed
   - Handle loading states

## Getting Started

1. **Setup**
   ```bash
   # Clone the repository
   git clone [repository-url]
   
   # Install dependencies
   npm install
   
   # Start development server
   npm start
   ```

2. **Environment Variables**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   REACT_APP_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
   ```

## Testing

The backend includes test users with the following IDs:
- "test_user_1" - Regular user with ratings
- "test_user_2" - New user with few ratings
- "test_user_3" - User with diverse preferences

## Need Help?

Contact backend team for:
- API issues
- Data structure questions
- Testing credentials
- Performance concerns