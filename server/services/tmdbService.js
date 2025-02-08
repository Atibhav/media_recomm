const axios = require('axios');
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbService = {
    getPopularMovies: async () => {
        try {
            const url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
            const response = await axios.get(url);
            
            return response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch popular movies');
        }
    },

    searchMovies: async (query) => {
        try {
            const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
            const response = await axios.get(url);
            
            return response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data || error.message);
            throw new Error('Failed to search movies');
        }
    },

    getMovieDetails: async (movieId) => {
        try {
            // First check our database
            let movie = await Movie.findOne({ tmdbId: movieId });
            
            // Fetch fresh data from TMDB
            const url = `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=credits,similar`;
            const response = await axios.get(url);
            
            // If movie doesn't exist in our DB, create it
            if (!movie) {
                movie = await Movie.create({
                    tmdbId: response.data.id.toString(),
                    title: response.data.title,
                    overview: response.data.overview,
                    genres: response.data.genres.map(g => g.id),
                    releaseDate: response.data.release_date,
                    posterPath: response.data.poster_path,
                    backdropPath: response.data.backdrop_path,
                    voteAverage: response.data.vote_average,
                    voteCount: response.data.vote_count,
                    type: 'movie'
                });
            }

            return {
                ...response.data,
                dbId: movie._id,
                userRating: null,
                inWatchlist: false
            };
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch movie details');
        }
    },

    getTrendingMovies: async () => {
        try {
            const url = `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
            const response = await axios.get(url);
            
            return response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data || error.message);
            throw new Error('Failed to fetch trending movies');
        }
    }
};

module.exports = tmdbService;