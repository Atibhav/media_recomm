const axios = require('axios');
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbService = {
    getPopularMovies: async (req, res) => {
        try {
            const url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            // Transform the data to match frontend expectations
            const movies = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
            
            res.json(movies);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    },


    searchMovies: async (req, res) => {
        try {
            const { query } = req.query;
            const url = `${BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            res.json(response.data);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    },

    getMovieDetails: async (req, res) => {
        try {
            const { id } = req.params;
            
            // First check our database
            let movie = await Movie.findOne({ tmdbId: id });
            
            // Fetch fresh data from TMDB
            const url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,similar`;
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
    
            // Combine TMDB data with our DB data
            const movieData = {
                ...response.data,
                dbId: movie._id,
                userRating: null,  
                inWatchlist: false 
            };
    
            res.json(movieData);
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data);
            res.status(500).json({ 
                message: 'Error fetching movie details',
                error: error.response?.data || error.message
            });
        }
    },

    getTrendingMovies: async (req, res) => {
        try {
            const url = `${BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            // Transform the data to match frontend expectations
            const movies = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                overview: movie.overview,
                posterPath: movie.poster_path,
                backdropPath: movie.backdrop_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
            
            res.json(movies);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    },

    getMovieRecommendations: async (req, res) => {
        try {
            const { id } = req.params;
            const url = `${BASE_URL}/movie/${id}/recommendations?api_key=${TMDB_API_KEY}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            // Transform the data to match frontend expectations
            const recommendations = response.data.results.map(movie => ({
                id: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
                releaseDate: movie.release_date,
                voteAverage: movie.vote_average
            }));
            
            res.json(recommendations);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    },

    getUpcomingMovies: async (req, res) => {
        try {
            const url = `${BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            res.json(response.data);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    },

    getSimilarMovies: async (req, res) => {
        try {
            const { id } = req.params;
            const url = `${BASE_URL}/movie/${id}/similar?api_key=${TMDB_API_KEY}`;
            
            const response = await axios({
                method: 'get',
                url: url,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            
            res.json(response.data);
        } catch (error) {
            console.error('Full error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    }
};

module.exports = tmdbService;