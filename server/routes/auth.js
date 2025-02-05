const router = require('express').Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const User = require('../models/User');

// Test route
router.get('/', (req, res) => {
    console.log('Base auth route hit');
    res.json({ message: 'Auth route is working' });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', 
    passport.authenticate('google', { 
        failureRedirect: '/login',
        session: false
    }),
    (req, res) => {
        try {
            console.log('Google callback user:', req.user); // Debug log

            // Generate JWT
            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Redirect to frontend with token
            res.redirect(`https://media-recomm-frontend.onrender.com/auth-callback?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`https://media-recomm-frontend.onrender.com/login?error=Authentication failed`);
        }
    }
);

// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;