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
    }
};

module.exports = tmdbService;