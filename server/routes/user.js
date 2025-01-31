const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

console.log('Setting up user routes'); // Debug log

// Test route without auth middleware
router.get('/test', (req, res) => {
    console.log('Test route hit'); // Debug log
    res.json({ message: 'User routes working' });
});

// Get all user preferences
router.get('/preferences', auth, userController.getPreferences);

// Update language preferences
router.put('/preferences/language', auth, userController.updateLanguagePreferences);

// Update content filters
router.put('/preferences/filters', auth, userController.updateContentFilters);

// Update genre preferences
router.put('/preferences/genres', auth, userController.updateGenrePreferences);

module.exports = router;