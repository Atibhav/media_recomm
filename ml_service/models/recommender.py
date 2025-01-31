import pandas as pd
import numpy as np
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

class MovieRecommender:
    def __init__(self):
        # Connect to MongoDB
        self.mongo_uri = os.getenv('MONGODB_URI')
        self.client = MongoClient(self.mongo_uri)
        self.db = self.client.get_database()
        
        # Initialize the KNN model
        self.knn_model = NearestNeighbors(
            n_neighbors=1,
            metric='cosine'
        )
        
        # Feature weights
        self.weights = {
            'genres': 0.4,
            'keywords': 0.3,
            'director': 0.15,
            'cast': 0.15
        }
    
    def get_user_ratings(self):
        """Get all user ratings from MongoDB"""
        try:
            print("\nGetting all ratings from database")
            ratings = list(self.db.ratings.find({}))
            print(f"Found {len(ratings)} total ratings")
            
            if not ratings:
                print("No ratings found in database")
                return pd.DataFrame()
            
            # Convert MongoDB ObjectId to string
            for rating in ratings:
                rating['userId'] = str(rating['userId'])
                rating['movieId'] = str(rating['movieId'])
            
            df = pd.DataFrame(ratings)
            print(f"Created DataFrame with shape: {df.shape}")
            return df
        except Exception as e:
            print(f"Error getting ratings: {str(e)}")
            return pd.DataFrame()
    
    def get_user_preferences(self, user_id):
        """Get user preferences from MongoDB"""
        try:
            print(f"\nTrying to find user with ID: {user_id}")
            print(f"MongoDB URI: {self.mongo_uri.replace(self.mongo_uri.split('@')[0], '***')}")
            print(f"Database name: {self.db.name}")
            
            user = self.db.users.find_one({'_id': ObjectId(user_id)})
            print(f"Raw user data: {user}")
            
            if not user:
                print("❌ User not found in database")
                return None
            if 'preferences' not in user:
                print("❌ User has no preferences")
                return None
                
            print(f"✅ User preferences found: {user.get('preferences')}")
            return user.get('preferences')
        except Exception as e:
            print(f"Error getting user preferences: {str(e)}")
            return None

    def find_similar_users(self, user_id, ratings_df):
        """Find similar users based on rating patterns"""
        try:
            if ratings_df.empty:
                print("No ratings data available")
                return []
                
            print("\nCreating rating matrix...")
            rating_matrix = ratings_df.pivot(
                index='userId',
                columns='movieId',
                values='rating'
            ).fillna(0)
            
            print(f"Rating matrix shape: {rating_matrix.shape}")
            print(f"Rating matrix users: {rating_matrix.index.tolist()}")
            
            # If we only have one other user, return them
            users = rating_matrix.index.tolist()
            if len(users) <= 2:
                similar_users = [u for u in users if u != user_id]
                print(f"Only one other user available, returning them")
                return similar_users
            
            # Otherwise use KNN
            self.knn_model.fit(rating_matrix)
            
            if user_id not in rating_matrix.index:
                print(f"User {user_id} not found in ratings")
                return []
                
            user_vector = rating_matrix.loc[user_id].values.reshape(1, -1)
            distances, indices = self.knn_model.kneighbors(user_vector)
            
            similar_users = rating_matrix.index[indices[0]].tolist()
            if user_id in similar_users:
                similar_users.remove(user_id)
            
            print(f"Found {len(similar_users)} similar users")
            return similar_users
        except Exception as e:
            print(f"Error finding similar users: {str(e)}")
            return []

    def get_collaborative_recommendations(self, user_id, limit=10):
        """Get recommendations based on user ratings with detailed reasons"""
        try:
            print("\n=== Getting Collaborative Recommendations ===")
            
            # Get user preferences
            preferences = self.get_user_preferences(user_id)
            if not preferences:
                return []
            
            # Get all ratings
            ratings_df = self.get_user_ratings()
            if ratings_df.empty:
                return []
            
            # Find similar users
            similar_users = self.find_similar_users(str(user_id), ratings_df)
            if not similar_users:
                return []
            
            # Get highly rated movies from similar users
            similar_user_ratings = ratings_df[
                ratings_df['userId'].isin(similar_users) & 
                (ratings_df['rating'] >= 4)
            ]
            
            if len(similar_user_ratings) == 0:
                return []
            
            recommended_movies = similar_user_ratings['movieId'].unique()
            
            # Get movie details
            movies = list(self.db.movies.find({
                '_id': {'$in': [ObjectId(mid) for mid in recommended_movies]},
                'genres': {'$nin': preferences.get('contentFilters', {}).get('excludedGenres', [])}
            }))
            
            # Convert ObjectId to string and add detailed reasons
            for movie in movies:
                movie['_id'] = str(movie['_id'])
                movie['recommendation_type'] = 'collaborative'
                
                # Generate detailed reasons
                reasons = ['recommended by users with similar taste']
                
                # Check for matching preferences
                if 'preferred_directors' in preferences and movie.get('director'):
                    if movie['director'] in preferences['preferred_directors']:
                        reasons.append(f"directed by {movie['director']}")
                
                if 'preferred_actors' in preferences and movie.get('cast'):
                    cast_matches = set(movie['cast']).intersection(preferences.get('preferred_actors', []))
                    if cast_matches:
                        reasons.append(f"features {', '.join(cast_matches)}")
                
                # Genre matching
                movie_genres = set(movie.get('genres', []))
                genre_matches = movie_genres.intersection(preferences.get('genres', []))
                if genre_matches:
                    reasons.append("matches your preferred genres")
                
                # Keyword matching
                movie_keywords = set(movie.get('keywords', []))
                if 'keywords' in preferences:
                    keyword_matches = movie_keywords.intersection(preferences['keywords'])
                    if keyword_matches:
                        reasons.append("matches your interests")
                
                if float(movie.get('vote_average', 0)) >= 8.0:
                    reasons.append("highly rated")
                
                movie['recommendation_reasons'] = reasons
                
                # Add confidence score based on number of matching factors
                movie['confidence_score'] = len(reasons) / 5  # Normalize to 0-1 range
            
            # Sort by confidence score
            movies.sort(key=lambda x: x.get('confidence_score', 0), reverse=True)
            return movies[:limit]
            
        except Exception as e:
            print(f"Error in collaborative recommendations: {str(e)}")
            return []

    def get_content_based_recommendations(self, user_id, limit=10):
        """Get recommendations based on movie content"""
        try:
            print("\n=== Getting Content-Based Recommendations ===")
            
            # Get user preferences
            preferences = self.get_user_preferences(user_id)
            if not preferences:
                return []
            
            # Get preferred genres and other preferences
            preferred_genres = preferences.get('genres', [])
            excluded_genres = preferences.get('contentFilters', {}).get('excludedGenres', [])
            
            # Build query for movie matching
            query = {
                '$and': [
                    {'genres': {'$in': preferred_genres}},
                    {'genres': {'$nin': excluded_genres}},
                ]
            }
            
            # Get user's rated movies to exclude them
            rated_movies = set()
            user_ratings = self.db.ratings.find({'userId': ObjectId(user_id)})
            for rating in user_ratings:
                rated_movies.add(str(rating['movieId']))
            
            # Get matching movies
            movies = list(self.db.movies.find(query))
            
            # Score each movie based on similarity to preferences
            scored_movies = []
            for movie in movies:
                if str(movie['_id']) in rated_movies:
                    continue
                    
                score = 0
                reasons = []
                
                # Genre matching (40% weight)
                movie_genres = set(movie.get('genres', []))
                genre_match = len(movie_genres.intersection(preferred_genres))
                if genre_match > 0:
                    score += (genre_match / max(len(preferred_genres), 1)) * self.weights['genres']
                    reasons.append("matches your preferred genres")
                
                # Keyword matching (30% weight)
                movie_keywords = set(movie.get('keywords', []))
                if 'keywords' in preferences:
                    keyword_match = len(movie_keywords.intersection(preferences['keywords']))
                    if keyword_match > 0:
                        score += (keyword_match / max(len(preferences['keywords']), 1)) * self.weights['keywords']
                        reasons.append("matches your interests")
                
                # Director matching (15% weight)
                if 'preferred_directors' in preferences and movie.get('director'):
                    if movie['director'] in preferences['preferred_directors']:
                        score += self.weights['director']
                        reasons.append(f"directed by {movie['director']}")
                
                # Cast matching (15% weight)
                movie_cast = set(movie.get('cast', []))
                if 'preferred_actors' in preferences:
                    cast_matches = movie_cast.intersection(preferences['preferred_actors'])
                    if cast_matches:
                        score += (len(cast_matches) / max(len(preferences['preferred_actors']), 1)) * self.weights['cast']
                        reasons.append(f"features {', '.join(cast_matches)}")
                
                # Add vote average as a small bonus (0-0.1)
                vote_average = float(movie.get('vote_average', 0))
                if vote_average >= 8.0:
                    score += (vote_average / 10) * 0.1
                    reasons.append("highly rated")
                
                movie['_id'] = str(movie['_id'])
                movie['recommendation_type'] = 'content'
                movie['recommendation_reasons'] = reasons
                movie['confidence_score'] = score  # Add the calculated score
                scored_movies.append((movie, score))
            
            # Sort by score and return top movies
            scored_movies.sort(key=lambda x: x[1], reverse=True)
            return [movie for movie, score in scored_movies[:limit]]
            
        except Exception as e:
            print(f"Error in content recommendations: {str(e)}")
            return []

    def get_hybrid_recommendations(self, user_id, limit=10):
        """Combine collaborative and content-based recommendations"""
        try:
            print("\n=== Getting Hybrid Recommendations ===")
            
            # Get both types of recommendations
            collab_recommendations = self.get_collaborative_recommendations(user_id, limit=limit)
            content_recommendations = self.get_content_based_recommendations(user_id, limit=limit)
            
            print(f"Found {len(collab_recommendations)} collaborative recommendations")
            print(f"Found {len(content_recommendations)} content-based recommendations")
            
            # Combine recommendations
            all_recommendations = []
            existing_ids = set()
            
            # Add collaborative recommendations first (if any)
            for movie in collab_recommendations:
                if movie['_id'] not in existing_ids:
                    all_recommendations.append(movie)
                    existing_ids.add(movie['_id'])
            
            # Add content recommendations, avoiding duplicates
            for movie in content_recommendations:
                if movie['_id'] not in existing_ids:
                    all_recommendations.append(movie)
                    existing_ids.add(movie['_id'])
            
            # Sort by confidence score
            all_recommendations.sort(key=lambda x: x.get('confidence_score', 0), reverse=True)
            
            print(f"Returning {len(all_recommendations[:limit])} total recommendations")
            return all_recommendations[:limit]
            
        except Exception as e:
            print(f"Error in hybrid recommendations: {str(e)}")
            return []