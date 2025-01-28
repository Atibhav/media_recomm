const Movie = require('../models/Movie');
const User = require('../models/User');

const movieController = {
    // Get all movies
    getAllMovies: async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get movie by ID
    getMovieById: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
            res.json(movie);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Rate a movie
    rateMovie: async (req, res) => {
        try {
            const { rating } = req.body;
            const movie = await Movie.findById(req.params.id);

            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Check if user has already rated
            const existingRating = movie.ratings.find(
                r => r.user.toString() === req.user.id
            );

            if (existingRating) {
                existingRating.rating = rating;
            } else {
                movie.ratings.push({
                    user: req.user.id,
                    rating
                });
            }

            await movie.save();
            res.json(movie);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = movieController;