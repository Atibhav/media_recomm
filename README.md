# Movie Recommendation App

Last Updated: January 29 - 12pm, 2024

## Overview
A movie recommendation application with user authentication, personalized watchlists, and movie discovery features.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **External API**: TMDB (The Movie Database)
- **Development Tools**: Postman, Git

## Features Implemented

### Authentication
- User registration with email/password
- Secure login with JWT
- Protected routes for authenticated users
- User profile management

### Movie Operations
- Fetch popular movies
- Search movies by title
- Detailed movie information
- Integration with TMDB API

### Watchlist Management
- Add movies to personal watchlist
- Remove movies from watchlist
- View user's watchlist
- Persistent storage in MongoDB

## API Endpoints

### Authentication Routes
POST /api/auth/register
- Register new user with username, email, password
- Returns JWT token and user info

POST /api/auth/login
- Login with email and password
- Returns JWT token and user info

GET /api/auth/profile
- Get user profile with preferences
- Requires authentication

### Movie Operations
GET /api/movies/popular
- Fetch popular movies from TMDB
- Public access

GET /api/movies/search?query=moviename
- Search movies by title
- Public access

GET /api/movies/:id/details
- Get detailed movie information
- Combines TMDB data with local database

### Watchlist Management
POST /api/movies/:id/watchlist
- Add movie to user's watchlist
- Requires authentication

DELETE /api/movies/:id/watchlist
- Remove movie from watchlist
- Requires authentication

GET /api/movies/user/watchlist
- View user's watchlist
- Requires authentication

## Dataabse Models

### User Model
- username
- email
- password (hashed)
- preferences
  - genres
  - watchlist

### Movie Model
- tmdbId
- title
- overview
- genres
- releaseDate
- posterPath
- backdropPath
- voteAverage
- voteCount
- type (movie/tv)
- ratings
- watchedBy

## Features To Implement

### Rating System
POST /api/movies/:id/rate
GET /api/movies/user/ratings

### Recommendation Engine
GET /api/movies/recommendations
- Based on user preferences
- Based on watch history
- Based on ratings

### Enhanced Movie Features
GET /api/movies/trending
GET /api/movies/upcoming
GET /api/movies/similar/:id

### User Preferences
Genre preferences management
Language preferences
Content filters

### Frontend Integration
User interface design
API integration
State management

## Next Steps
Implement rating system
Build recommendation algorithm
Add more movie endpoints
Document API for v0 integration
Set up frontend collaboration


# Progress - 31/01 - 1:08 am
 # Movie Recommendation App

Last Updated: January 31 - 1:08am, 2024

## Overview
A movie recommendation application with user authentication, personalized watchlists, and movie discovery features.

## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Google OAuth
- **External API**: TMDB (The Movie Database)
- **Development Tools**: Postman, Git

## Features Implemented

### Authentication
- ✅ User registration with email/password
- ✅ Secure login with JWT
- ✅ Google OAuth integration
- ✅ Protected routes for authenticated users
- ✅ User profile management

### Movie Operations
- ✅ Fetch popular movies from TMDB
- ✅ Search movies by title
- ✅ Detailed movie information
- ✅ Integration with TMDB API
- ✅ Local database caching of movie details
- ✅ Trending Movies
- ✅ Upcoming Movies
- ✅ Similar Movies

### Watchlist Management
- ✅ Add movies to personal watchlist
- ✅ Remove movies from watchlist
- ✅ View user's watchlist
- ✅ Persistent storage in MongoDB

### Rating System
- ✅ Rate movies (1-5 stars with reviews)
- ✅ View movie ratings and reviews
- ✅ Update/delete user ratings
- ✅ Calculate average ratings

## API Endpoints

### Authentication Routes
POST /api/auth/register
- Register new user with username, email, password
- Returns JWT token and user info

POST /api/auth/login
- Login with email and password
- Returns JWT token and user info

GET /api/auth/google
- Initiate Google OAuth flow
- Returns JWT token and user info

GET /api/auth/profile
- Get user profile with preferences
- Requires authentication

PUT /api/auth/preferences
- Update user genre preferences
- Requires authentication

### Movie Operations
GET /api/movies/popular
- Fetch popular movies from TMDB
- Public access

GET /api/movies/search?query=moviename
- Search movies by title
- Public access

GET /api/movies/:id/details
- Get detailed movie information
- Combines TMDB data with local database

### Watchlist Management
POST /api/movies/:id/watchlist
- Add movie to user's watchlist
- Requires authentication

DELETE /api/movies/:id/watchlist
- Remove movie from watchlist
- Requires authentication

GET /api/movies/user/watchlist
- View user's watchlist
- Requires authentication

### Rating Routes
POST /api/movies/:id/rate
- Rate a movie (1-5) with optional review
- Requires authentication

GET /api/movies/:id/ratings
- Get all ratings for a movie
- Public access

GET /api/movies/user/ratings
- Get all ratings by current user
- Requires authentication

PUT /api/movies/:id/rate
- Update existing rating
- Requires authentication

DELETE /api/movies/:id/rate
- Delete user's rating
- Requires authentication

## Database Models

### User Model
- username
- email
- password (hashed)
- googleId (for OAuth)
- authType (local/google)
- preferences
  - genres
  - watchlist

### Movie Model
- tmdbId
- title
- overview
- genres
- releaseDate
- posterPath
- backdropPath
- voteAverage
- voteCount
- type (movie/tv)
- ratings
- watchedBy

## Features To Implement

### Rating System
POST /api/movies/:id/rate
GET /api/movies/user/ratings

### Recommendation Engine
GET /api/movies/recommendations
- Based on user preferences
- Based on watch history
- Based on ratings

### Enhanced Movie Features
GET /api/movies/trending
GET /api/movies/upcoming
GET /api/movies/similar/:id

### User Preferences
- Enhanced genre preferences management
- Language preferences
- Content filters

### Frontend Development
- User interface design
- API integration
- State management
- Authentication flows
- Movie browsing interface
- Watchlist management UI

## Next Steps
1. Implement rating system
2. Build recommendation algorithm
3. Add enhanced movie endpoints
4. Begin frontend development

# Movie Recommendation ML Service

A sophisticated movie recommendation system that combines collaborative and content-based filtering to provide personalized movie recommendations.

## Overview

The ML service uses a hybrid approach to generate movie recommendations:
- Collaborative Filtering: Finds similar users based on rating patterns
- Content-Based Filtering: Matches movies based on user preferences
- Hybrid System: Combines both approaches for optimal recommendations

## Architecture

### Core Components

1. **MovieRecommender Class**
   - Main recommendation engine
   - Handles both collaborative and content-based filtering
   - Manages database connections and data processing

2. **Feature Weighting System**
   ```python
   weights = {
       'genres': 0.4,        # Genre matching
       'keywords': 0.3,      # Plot elements and themes
       'director': 0.15,     # Director preferences
       'cast': 0.15         # Actor preferences
   }
   ```

3. **Database Integration**
   - MongoDB connection for storing:
     - User preferences
     - Movie metadata
     - User ratings
     - Recommendation history

## Features

### 1. Collaborative Filtering
- Uses k-Nearest Neighbors algorithm
- Finds similar users based on rating patterns
- Recommends movies liked by similar users

### 2. Content-Based Filtering
- Matches user preferences with movie attributes
- Considers multiple features:
  - Genres
  - Keywords/themes
  - Directors
  - Cast members
  - User-specific preferences

### 3. Hybrid Recommendations
- Combines both filtering approaches
- Provides diverse recommendation sources
- Includes confidence scores and reasoning

## API Endpoints

### Get Recommendations


## Setup and Installation

1. **Environment Setup**
   ```bash
   python -m venv env
   source env/bin/activate  # Unix
   env\Scripts\activate     # Windows
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Environment Variables**
   Create a `.env` file:
   ```
   MONGODB_URI=your_mongodb_uri
   ```

4. **Run the Service**
   ```bash
   python app.py
   ```

## Technical Details

### Machine Learning Components

1. **KNN Model**
   - Used for finding similar users
   - Cosine similarity metric
   - Configurable number of neighbors

2. **Feature Engineering**
   - Genre matching
   - Keyword extraction
   - Director/cast matching
   - Rating normalization

3. **Scoring System**
   - Weighted feature matching
   - Confidence score calculation
   - Hybrid recommendation ranking

### Data Processing

1. **Input Processing**
   - User preference extraction
   - Rating matrix creation
   - Feature normalization

2. **Output Processing**
   - Recommendation ranking
   - Reason generation
   - Confidence scoring

## Error Handling

The service includes comprehensive error handling for:
- Invalid user IDs
- Missing preferences
- Database connection issues
- Empty recommendation sets

## Performance Considerations

- Caching recommendations
- Batch processing for large datasets
- Efficient database queries
- Scalable architecture

## Future Enhancements

Potential areas for improvement:
1. Real-time recommendation updates
2. A/B testing support
3. Enhanced personalization
4. Performance optimization
5. Additional recommendation algorithms

## Dependencies

- Python 3.8+
- MongoDB
- Required Python packages:
  ```
  pandas
  numpy
  scikit-learn
  pymongo
  python-dotenv
  flask
  flask-cors
  ```



