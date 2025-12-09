# Movie Recommendation App

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

## Database Models

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



### Enhanced Movie Features
GET /api/movies/trending
GET /api/movies/upcoming
GET /api/movies/similar/:id

### User Preferences
Genre preferences management
Language preferences
Content filters






## API Endpoint

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



## Technical Stack Details
- Frontend: React.js, Context API, Axios
- Backend: Node.js, Express.js
- Database: MongoDB with Mongoose
- Authentication: JWT
- External API: TMDB API
- Deployment: Render Cloud Platform

## Development Practices
- Git version control
- Environment configuration management
- API documentation
- Error logging and monitoring
- Cross-origin resource sharing (CORS)
