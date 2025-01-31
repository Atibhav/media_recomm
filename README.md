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