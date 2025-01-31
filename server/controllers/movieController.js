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
            const { rating, review } = req.body;
            const movie = await Movie.findById(req.params.id);
            
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            // Validate rating
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
    
            // Check if user has already rated
            const existingRating = movie.ratings.find(
                r => r.user.toString() === req.user.id
            );
    
            if (existingRating) {
                return res.status(400).json({ 
                    message: 'You have already rated this movie. Use PUT to update.' 
                });
            }
    
            // Add new rating
            movie.ratings.push({
                user: req.user.id,
                rating,
                review: review || '',
                createdAt: Date.now()
            });
    
            await movie.save();
            res.json({ message: 'Rating added successfully', movie });
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
    },

    // Recommendation functions
    getMovieRatings: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id)
                .populate('ratings.user', 'username');  // Get username of raters
    
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            // Calculate average rating
            const averageRating = movie.ratings.length > 0
                ? movie.ratings.reduce((sum, r) => sum + r.rating, 0) / movie.ratings.length
                : 0;
    
            res.json({
                averageRating,
                totalRatings: movie.ratings.length,
                ratings: movie.ratings
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getUserRatings: async (req, res) => {
        try {
            const movies = await Movie.find({
                'ratings.user': req.user.id
            }).select('title posterPath ratings.$');
    
            res.json(movies);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateRating: async (req, res) => {
        try {
            const { rating, review } = req.body;
            const movie = await Movie.findById(req.params.id);
            
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            // Find user's rating
            const ratingIndex = movie.ratings.findIndex(
                r => r.user.toString() === req.user.id
            );
    
            if (ratingIndex === -1) {
                return res.status(404).json({ message: 'Rating not found' });
            }
    
            // Update rating
            movie.ratings[ratingIndex].rating = rating;
            if (review !== undefined) {
                movie.ratings[ratingIndex].review = review;
            }
            movie.ratings[ratingIndex].updatedAt = Date.now();
    
            await movie.save();
            res.json({ message: 'Rating updated', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    deleteRating: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id);
            
            if (!movie) {
                return res.status(404).json({ message: 'Movie not found' });
            }
    
            // Remove the rating
            movie.ratings = movie.ratings.filter(
                r => r.user.toString() !== req.user.id
            );
    
            await movie.save();
            res.json({ message: 'Rating deleted', movie });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = movieController;