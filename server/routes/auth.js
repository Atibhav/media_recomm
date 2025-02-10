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
        failureRedirect: `${process.env.CLIENT_URL}/login`,
        session: false
    }),
    (req, res) => {
        try {
            console.log('Google callback user:', req.user);
            console.log('Using CLIENT_URL:', process.env.CLIENT_URL); // Debug log

            const token = jwt.sign(
                { id: req.user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.redirect(`${process.env.CLIENT_URL}/auth-callback?token=${token}`);
        } catch (error) {
            console.error('Token generation error:', error);
            res.redirect(`${process.env.CLIENT_URL}/login?error=Authentication failed`);
        }
    }
);

// Regular auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', auth, authController.getProfile);
router.put('/preferences', auth, authController.updatePreferences);

module.exports = router;