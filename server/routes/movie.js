const router = require('express').Router();
const movieController = require('../controllers/movieController');
const tmdbService = require('../services/tmdbService');
const auth = require('../middleware/auth');

console.log('TMDB Service:', tmdbService); // Temporary debug log

// TMDB routes
router.get('/popular', tmdbService.getPopularMovies);
router.get('/search', tmdbService.searchMovies);
router.get('/:id/details', tmdbService.getMovieDetails);  // Keep your existing path

// Database routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);
router.post('/:id/rate', auth, movieController.rateMovie);

// New watchlist routes (to be implemented)
router.post('/:id/watchlist', auth, movieController.addToWatchlist);
router.delete('/:id/watchlist', auth, movieController.removeFromWatchlist);
router.get('/user/watchlist', auth, movieController.getWatchlist);

module.exports = router;