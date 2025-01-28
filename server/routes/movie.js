const router = require('express').Router();
const movieController = require('../controllers/movieController');
const tmdbService = require('../services/tmdbService');
const auth = require('../middleware/auth');

console.log('TMDB Service:', tmdbService); // Temporary debug log

//TMDB routes
router.get('/popular', tmdbService.getPopularMovies);
router.get('/search', tmdbService.searchMovies);

// Get all movies
router.get('/', movieController.getAllMovies);

// Get movie by ID
router.get('/:id', movieController.getMovieById);

// Rate a movie (protected route)
router.post('/:id/rate', auth, movieController.rateMovie);


module.exports = router;
