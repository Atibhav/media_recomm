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
    
            if (!rating || rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating must be between 1 and 5' });
            }
    
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
            const tmdbId = req.params.id;  
            const userId = req.user.id;

            // Find user and check if movie already in watchlist
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if movie already in watchlist
            const alreadyInWatchlist = user.preferences.watchlist.some(
                item => item.tmdbId === tmdbId
            );

            if (alreadyInWatchlist) {
                return res.status(400).json({ message: 'Movie already in watchlist' });
            }

            // Add movie to user's watchlist
            user.preferences.watchlist.push({ tmdbId });
            await user.save();

            res.json({ 
                success: true,
                message: 'Added to watchlist',
                watchlist: user.preferences.watchlist
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }    
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const tmdbId = req.params.id;  
            const userId = req.user.id;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Remove movie from watchlist
            user.preferences.watchlist = user.preferences.watchlist.filter(
                item => item.tmdbId !== tmdbId
            );
            await user.save();

            res.json({ 
                success: true,
                message: 'Removed from watchlist',
                watchlist: user.preferences.watchlist
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }    
    },

    getWatchlist: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

 
            const watchlistWithTmdbIds = user.preferences.watchlist.map(item => ({
                id: item.tmdbId,           
                tmdbId: item.tmdbId,
                addedAt: item.addedAt
            }));

            res.json({ 
                success: true,
                watchlist: watchlistWithTmdbIds,
                count: watchlistWithTmdbIds.length
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    
    clearWatchlist: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.preferences.watchlist = [];
            await user.save();

            res.json({ 
                success: true,
                message: 'Watchlist cleared successfully',
                watchlist: []
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Recommendation functions
    getMovieRatings: async (req, res) => {
        try {
            const movie = await Movie.findById(req.params.id)
                .populate('ratings.user', 'username');  
    
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