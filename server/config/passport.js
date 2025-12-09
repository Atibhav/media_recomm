require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'https://media-recomm.onrender.com/api/auth/google/callback',
    proxy: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // 1. Check if user exists with googleId
        let user = await User.findOne({ googleId: profile.id });
        
        if (user) {
            return done(null, user);
        }

        // 2. Check if user exists with email
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            // Link googleId to existing user
            user.googleId = profile.id;
            // If the user was local, they can now also login with Google
            if (user.authType === 'local') {
                // We don't change authType to 'google' to preserve password login capability
                // But we could allow both. The schema has authType as a single string enum.
                // Ideally authType should be an array or we just rely on presence of googleId/password.
                // For now, we just save the googleId.
            }
            await user.save();
            return done(null, user);
        }

        // 3. Create new user
        // Handle username uniqueness
        let username = profile.displayName;
        let userWithUsername = await User.findOne({ username });
        if (userWithUsername) {
            // Append 4 random digits
            username = `${username}${Math.floor(1000 + Math.random() * 9000)}`;
        }

        user = await User.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            username: username,
            authType: 'google',
            preferences: { genres: [] }
        });
        
        return done(null, user);
    } catch (error) {
        console.error('Error in Google strategy:', error);
        return done(error, null);
    }
}));

module.exports = passport;