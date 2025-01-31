# Movie Recommendation System - Frontend Development Guide

## System Overview

A personalized movie recommendation system using hybrid filtering (collaborative + content-based) to suggest movies to users.

## API Endpoints

### 1. Get Recommendations
```javascript
POST /recommendations
Content-Type: application/json

Request Body:
{
    "userId": "string"
}

Response:
{
    "success": true,
    "recommendations": [
        {
            "movieId": "string",
            "title": "string",
            "poster_path": "string",
            "overview": "string",
            "vote_average": number,
            "release_date": "string",
            "genres": ["string"],
            "recommendation_type": "collaborative/content",
            "recommendation_reasons": ["string"],
            "confidence_score": number
        }
    ]
}
```

## Data Structures

### Movie Object
```typescript
interface Movie {
    _id: string;
    title: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    release_date: string;
    genres: string[];
    director: string;
    cast: string[];
    keywords: string[];
}
```

### Recommendation Object
```typescript
interface Recommendation {
    movieId: string;
    title: string;
    poster_path: string;
    overview: string;
    vote_average: number;
    release_date: string;
    genres: string[];
    recommendation_type: 'collaborative' | 'content';
    recommendation_reasons: string[];
    confidence_score: number;
}
```

## Required Frontend Pages

### 1. Home/Dashboard
- Display personalized recommendations
- Show recommendation reasons
- Filter/sort options
- Movie cards with basic info

### 2. Movie Details
- Full movie information
- Rating option
- Similar movies
- Cast and crew

### 3. User Profile
- Viewing history
- Rating history
- Genre preferences
- Favorite actors/directors

## UI Components Needed

### 1. Movie Card
- Poster image
- Title
- Rating
- Genre tags
- Quick actions

### 2. Recommendation Section
- Recommendation type label
- Confidence score
- Reason badges
- Sort/filter controls

### 3. Navigation
- User profile
- Home/Dashboard
- Search (future feature)

## Design Guidelines

### Colors
```css
:root {
    --primary: #1a1a1a;     /* Dark background */
    --secondary: #2d2d2d;   /* Card background */
    --accent: #e50914;      /* Netflix-like red */
    --text: #ffffff;        /* Text color */
    --text-secondary: #b3b3b3;  /* Secondary text */
}
```

### Typography
```css
/* Font families */
--font-main: 'Inter', sans-serif;
--font-headers: 'Poppins', sans-serif;

/* Font sizes */
--text-sm: 0.875rem;
--text-base: 1rem;
--text-lg: 1.125rem;
--text-xl: 1.25rem;
--text-2xl: 1.5rem;
```

## Component Examples

### Movie Card Component
```jsx
function MovieCard({ movie }) {
    return (
        <div className="movie-card">
            <img src={movie.poster_path} alt={movie.title} />
            <div className="movie-info">
                <h3>{movie.title}</h3>
                <div className="movie-meta">
                    <span className="rating">{movie.vote_average}</span>
                    <span className="year">
                        {new Date(movie.release_date).getFullYear()}
                    </span>
                </div>
                <div className="genres">
                    {movie.genres.map(genre => (
                        <span key={genre} className="genre-tag">
                            {genre}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

### Recommendation Section
```jsx
function RecommendationSection({ recommendations }) {
    return (
        <div className="recommendations">
            <div className="recommendations-header">
                <h2>Recommended for You</h2>
                <div className="filters">
                    {/* Filter/sort controls */}
                </div>
            </div>
            <div className="recommendations-grid">
                {recommendations.map(movie => (
                    <MovieCard 
                        key={movie.movieId} 
                        movie={movie}
                        reasons={movie.recommendation_reasons}
                        confidence={movie.confidence_score}
                    />
                ))}
            </div>
        </div>
    );
}
```

## User Interactions

### 1. View Recommendations
- Load on page load
- Pull-to-refresh
- Filter/sort options

### 2. Movie Details
- Click on movie card
- Show full details
- Show similar movies

### 3. User Actions
- Rate movies
- Update preferences
- View history

## Error States

### 1. Loading States
- Skeleton loaders for cards
- Loading spinners
- Placeholder content

### 2. Error Messages
- Failed to load recommendations
- Network errors
- Invalid user ID

### 3. Empty States
- No recommendations yet
- No rating history
- No preferences set

## Performance Considerations

1. Lazy loading for images
2. Pagination for recommendations
3. Caching responses
4. Optimistic UI updates

## Future Features (Not Implemented Yet)

1. Real-time updates
2. Search functionality
3. Advanced filtering
4. Social features
5. Watchlist
