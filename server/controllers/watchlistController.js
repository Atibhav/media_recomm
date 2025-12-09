const User = require('../models/User');
const Movie = require('../models/Movie');

const watchlistController = {
    addToWatchlist: async (req, res) => {
        try {
            const userId = req.user.id;
            const { movieId } = req.body;

            if (!movieId) {
                return res.status(400).json({ message: 'Movie ID is required' });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Check if already in watchlist
            const exists = user.preferences.watchlist.some(item => item.tmdbId === movieId.toString());
            
            if (!exists) {
                user.preferences.watchlist.push({ tmdbId: movieId.toString() });
                await user.save();
            }

            res.json({ message: 'Added to watchlist', watchlist: user.preferences.watchlist });
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const userId = req.user.id;
            const { movieId } = req.params;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.preferences.watchlist = user.preferences.watchlist.filter(
                item => item.tmdbId !== movieId.toString()
            );
            await user.save();

            res.json({ message: 'Removed from watchlist', watchlist: user.preferences.watchlist });
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getWatchlist: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ watchlist: user.preferences.watchlist });
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getWatchlistCount: async (req, res) => {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            res.json({ count: user ? user.preferences.watchlist.length : 0 });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    },

    checkStatus: async (req, res) => {
        try {
            const userId = req.user.id;
            const { movieId } = req.params;
            
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: 'User not found' });

            const isInWatchlist = user.preferences.watchlist.some(
                item => item.tmdbId === movieId.toString()
            );

            res.json({ isInWatchlist });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = watchlistController;
