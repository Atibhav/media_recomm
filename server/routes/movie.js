const router = require('express').Router();
const movieController = require('../controllers/movieController');
const tmdbService = require('../services/tmdbService');
const auth = require('../middleware/auth');

console.log('TMDB Service:', tmdbService); // Temporary debug log

// TMDB routes
router.get('/popular', tmdbService.getPopularMovies);
router.get('/search', tmdbService.searchMovies);
router.get('/:id/details', tmdbService.getMovieDetails);  // Keep your existing path
router.get('/trending', tmdbService.getTrendingMovies);       // Add this
router.get('/upcoming', tmdbService.getUpcomingMovies);       // Add this
router.get('/:id/similar', tmdbService.getSimilarMovies);
router.get('/recommended/:userId', auth, tmdbService.getRecommendedMovies);
router.get('/:id/recommendations', tmdbService.getMovieRecommendations);

// Database routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/:id/rate', auth, movieController.rateMovie);

// Rating routes 
router.post('/:id/rate', auth, movieController.rateMovie);
router.get('/:id/ratings', movieController.getMovieRatings);
router.get('/user/ratings', auth, movieController.getUserRatings);
router.put('/:id/rate', auth, movieController.updateRating);
router.delete('/:id/rate', auth, movieController.deleteRating);


// Watchlist routes 
router.post('/:id/watchlist', auth, movieController.addToWatchlist);
router.delete('/:id/watchlist', auth, movieController.removeFromWatchlist);
router.get('/user/watchlist', auth, movieController.getWatchlist);


module.exports = router;