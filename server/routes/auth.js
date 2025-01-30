const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Test route with more logging
router.get('/', (req, res) => {
    console.log('Base auth route hit');
    res.json({ message: 'Auth route is working' });
});

// Google OAuth routes with error handling and logging
router.get('/google', (req, res, next) => {
    console.log('Google auth route hit - before passport');
    try {
        const authenticator = passport.authenticate('google', { 
            scope: ['profile', 'email']
        });
        console.log('Authenticator created');
        
        authenticator(req, res, next);
        
        console.log('Google auth route hit - after passport');
    } catch (error) {
        console.error('Error in Google auth:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/google/callback',
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false 
    }),
    (req, res) => {
        try {
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                token,
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    preferences: req.user.preferences
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
);

// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;