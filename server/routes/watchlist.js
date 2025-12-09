const router = require('express').Router();
const auth = require('../middleware/auth');
const watchlistController = require('../controllers/watchlistController');

// Get watchlist count
router.get('/count', auth, watchlistController.getWatchlistCount);

// Get user's watchlist
router.get('/', auth, watchlistController.getWatchlist);

// Add to watchlist
router.post('/', auth, watchlistController.addToWatchlist);

// Remove from watchlist
router.delete('/:movieId', auth, watchlistController.removeFromWatchlist);

// Check status
router.get('/check/:movieId', auth, watchlistController.checkStatus);

module.exports = router;