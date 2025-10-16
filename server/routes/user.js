const router = require('express').Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/test', (req, res) => {
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