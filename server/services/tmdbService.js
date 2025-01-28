const axios = require('axios');
const Movie = require('../models/Movie');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbService = {
    getPopularMovies: async (req, res) => {
        try {
            // Using exact same format as the working curl request
            const url = `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`;
            
            // Make request with explicit configuration
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
            const url = `${BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,similar`;
            
            const response = await axios.get(url);
            
            // Check if movie exists in our DB
            let movie = await Movie.findOne({ tmdbId: id });
            
            if (!movie) {
                movie = await Movie.create({
                    tmdbId: response.data.id.toString(),
                    title: response.data.title,
                    overview: response.data.overview,
                    genres: response.data.genres.map(g => g.id),
                    releaseDate: response.data.release_date,
                    posterPath: response.data.poster_path,
                    type: 'movie',
                    cast: response.data.credits.cast.slice(0, 10),
                    similar: response.data.similar.results.slice(0, 5)
                });
            }

            res.json({
                ...response.data,
                dbId: movie._id // Include our database ID for rating/watchlist
            });
        } catch (error) {
            console.error('TMDB API Error:', error.response?.data);
            res.status(500).json({ 
                message: 'TMDB API Error',
                error: error.response?.data || error.message
            });
        }
    }
};

module.exports = tmdbService;