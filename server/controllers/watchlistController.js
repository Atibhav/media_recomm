const User = require('../models/User');
const Movie = require('../models/Movie');

const watchlistController = {
    addToWatchlist: async (req, res) => {
        try {
            const { userId } = req.params;
            const { movieId } = req.body;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (!user.watchlist.includes(movieId)) {
                user.watchlist.push(movieId);
                await user.save();
            }

            res.json({ message: 'Added to watchlist', watchlist: user.watchlist });
        } catch (error) {
            console.error('Error adding to watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    removeFromWatchlist: async (req, res) => {
        try {
            const { userId, movieId } = req.params;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            user.watchlist = user.watchlist.filter(id => id !== movieId);
            await user.save();

            res.json({ message: 'Removed from watchlist', watchlist: user.watchlist });
        } catch (error) {
            console.error('Error removing from watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getWatchlist: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId).populate('watchlist');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user.watchlist);
        } catch (error) {
            console.error('Error getting watchlist:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    getWatchlistCount: async (req, res) => {
        try {
            const { userId } = req.params;

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ count: user.watchlist.length });
        } catch (error) {
            console.error('Error getting watchlist count:', error);
            res.status(500).json({ message: 'Server error' });
        }
    }
};

module.exports = watchlistController;