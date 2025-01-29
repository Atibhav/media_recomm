const Movie = require('../models/Movie');
const User = require('../models/User');  

const movieController = {
    getAllMovies: async (req, res) => {
        try {
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

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
    },

    // Watchlist functions 
    addToWatchlist: async (req, res) => {
        try {
            const movieId = req.params.id;
            const userId = req.user.id;

            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Check if movie is already in watchlist
            if (movie.watchedBy.includes(userId)) {
                return res.status(400).json({ message: 'Movie already in watchlist' });
            }

            // Add user to movie's watchedBy array
            movie.watchedBy.push(userId);
            await movie.save();

            // Add movie to user's watchlist
            await User.findByIdAndUpdate(userId, {
                $addToSet: { 'preferences.watchlist': movieId }
            });

            res.json({ message: 'Added to watchlist', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }    
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const movieId = req.params.id;
            const userId = req.user.id;

            const movie = await Movie.findById(movieId);
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }

            // Remove user from movie's watchedBy array
            movie.watchedBy = movie.watchedBy.filter(id => id.toString() !== userId);
            await movie.save();

            // Remove movie from user's watchlist
            await User.findByIdAndUpdate(userId, {
                $pull: { 'preferences.watchlist': movieId }
            });

            res.json({ message: 'Removed from watchlist', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }    
    },

    getWatchlist: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .populate('preferences.watchlist');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user.preferences.watchlist);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = movieController;