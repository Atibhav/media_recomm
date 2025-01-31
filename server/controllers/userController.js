const User = require('../models/User');

const userController = {
    updateLanguagePreferences: async (req, res) => {
        try {
            const { primary, subtitle } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.language': {
                        primary: primary || 'en',
                        subtitle: subtitle || 'en'
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Language preferences updated',
                preferences: user.preferences.language
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateContentFilters: async (req, res) => {
        try {
            const { maxRating, excludedGenres, adultContent } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.contentFilters': {
                        maxRating: maxRating || 'R',
                        excludedGenres: excludedGenres || [],
                        adultContent: adultContent || false
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Content filters updated',
                preferences: user.preferences.contentFilters
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateGenrePreferences: async (req, res) => {
        try {
            const { liked, disliked } = req.body;
            
            // Validate genre weights
            if (liked) {
                liked.forEach(genre => {
                    if (genre.weight < 0 || genre.weight > 2) {
                        throw new Error('Genre weight must be between 0 and 2');
                    }
                });
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.genrePreferences': {
                        liked: liked || [],
                        disliked: disliked || []
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Genre preferences updated',
                preferences: user.preferences.genrePreferences
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getPreferences: async (req, res) => {
        try {
            const user = await User.findById(req.user.id)
                .select('preferences');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            res.json(user.preferences);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateLanguagePreferences: async (req, res) => {
        try {
            const { primary, subtitle } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.language': {
                        primary: primary || 'en',
                        subtitle: subtitle || 'en'
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Language preferences updated',
                preferences: user.preferences.language
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateContentFilters: async (req, res) => {
        try {
            const { maxRating, excludedGenres, adultContent } = req.body;
            
            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.contentFilters': {
                        maxRating: maxRating || 'R',
                        excludedGenres: excludedGenres || [],
                        adultContent: adultContent || false
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Content filters updated',
                preferences: user.preferences.contentFilters
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    updateGenrePreferences: async (req, res) => {
        try {
            const { liked, disliked } = req.body;
            
            // Validate genre weights
            if (liked) {
                liked.forEach(genre => {
                    if (genre.weight < 0 || genre.weight > 2) {
                        throw new Error('Genre weight must be between 0 and 2');
                    }
                });
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                {
                    'preferences.genrePreferences': {
                        liked: liked || [],
                        disliked: disliked || []
                    }
                },
                { new: true }
            );

            res.json({
                message: 'Genre preferences updated',
                preferences: user.preferences.genrePreferences
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = userController;