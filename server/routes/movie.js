const router = require('express').Router();
const movieController = require('../controllers/movieController');
const tmdbService = require('../services/tmdbService');
const auth = require('../middleware/auth');

// TMDB routes
router.get('/popular', async (req, res) => {
    try {
        if (!process.env.TMDB_API_KEY) {
            throw new Error('TMDB API key not configured');
        }
        const movies = await tmdbService.getPopularMovies();
        res.json(movies);
    } catch (error) {
        console.error('Popular movies error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch popular movies', 
            details: error.message 
        });
    }
});

router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ error: 'Search query is required' });
        }
        const movies = await tmdbService.searchMovies(query);
        res.json(movies);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Failed to search movies',
            details: error.message 
        });
    }
});

router.get('/trending', async (req, res) => {
    try {
        const movies = await tmdbService.getTrendingMovies();
        res.json(movies);
    } catch (error) {
        console.error('Trending movies error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch trending movies',
            details: error.message 
        });
    }
});

router.get('/:id/details', async (req, res) => {
    try {
        const movie = await tmdbService.getMovieDetails(req.params.id);
        res.json(movie);
    } catch (error) {
        console.error('Movie details error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch movie details',
            details: error.message 
        });
    }
});

// Protected routes

// Get genres
router.get('/genres', async (req, res) => {
    try {
        const genres = await tmdbService.getGenres();
        res.json(genres);
    } catch (error) {
        console.error('Genres fetch error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch genres', 
            details: error.message 
        });
    }
});

// Browse movies with filters
router.get('/browse', async (req, res) => {
    try {
        const { genre, sortBy, year } = req.query;
        const movies = await tmdbService.browseMovies({ genre, sortBy, year });
        res.json(movies);
    } catch (error) {
        console.error('Browse movies error:', error);
        res.status(500).json({ 
            error: 'Failed to browse movies', 
            details: error.message 
        });
    }
});

// Database routes
router.get('/', movieController.getAllMovies);
router.get('/:id', movieController.getMovieById);

// Rating routes (all protected)
router.post('/:id/rate', auth, movieController.rateMovie);
router.get('/:id/ratings', movieController.getMovieRatings);
router.get('/user/ratings', auth, movieController.getUserRatings);
router.put('/:id/rate', auth, movieController.updateRating);
router.delete('/:id/rate', auth, movieController.deleteRating);

// Watchlist routes (all protected)
router.post('/:id/watchlist', auth, movieController.addToWatchlist);
router.delete('/:id/watchlist', auth, movieController.removeFromWatchlist);
router.get('/user/watchlist', auth, movieController.getWatchlist);
router.delete('/user/watchlist', auth, movieController.clearWatchlist);

module.exports = router;