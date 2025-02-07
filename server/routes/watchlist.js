const router = require('express').Router();
const auth = require('../middleware/auth');
const watchlistController = require('../controllers/watchlistController');

// Get watchlist count
router.get('/count/:userId', auth, watchlistController.getCount);

// Get user's watchlist
router.get('/:userId', auth, watchlistController.getWatchlist);

// Add to watchlist
router.post('/:userId/:movieId', auth, watchlistController.addToWatchlist);

// Remove from watchlist
router.delete('/:userId/:movieId', auth, watchlistController.removeFromWatchlist);

module.exports = router;