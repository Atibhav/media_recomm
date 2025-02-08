const router = require('express').Router();
const movieController = require('../controllers/movieController');
const tmdbService = require('../services/tmdbService');
const auth = require('../middleware/auth');

// TMDB routes - Note: Order matters! More specific routes first
router.get('/popular', async (req, res) => {
    try {
        if (!process.env.TMDB_API_KEY) {
            throw new Error('TMDB API key not configured');
        }
        const movies = await tmdbService.getPopularMovies();
        res.json(movies);
    } catch (error) {
        console.error('Popular movies error:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies', details: error.message });
    }
});

router.get('/search', async (req, res) => {
    try {
        const movies = await tmdbService.searchMovies(req.query.query);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

router.get('/trending', async (req, res) => {
    try {
        const movies = await tmdbService.getTrendingMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch trending movies' });
    }
});

router.get('/upcoming', async (req, res) => {
    try {
        const movies = await tmdbService.getUpcomingMovies();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch upcoming movies' });
    }
});

router.get('/recommended/:userId', auth, async (req, res) => {
    try {
        const movies = await tmdbService.getRecommendedMovies(req.params.userId);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recommended movies' });
    }
});

// Routes with ID parameter should come after specific routes
router.get('/:id/details', async (req, res) => {
    try {
        const movie = await tmdbService.getMovieDetails(req.params.id);
        res.json(movie);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

router.get('/:id/similar', async (req, res) => {
    try {
        const movies = await tmdbService.getSimilarMovies(req.params.id);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch similar movies' });
    }
});

router.get('/:id/recommendations', async (req, res) => {
    try {
        const movies = await tmdbService.getMovieRecommendations(req.params.id);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch movie recommendations' });
    }
});

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