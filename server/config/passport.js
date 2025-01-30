require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// debugging logs - remove later
console.log('Loading passport config...');
console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID);
console.log('Google Client Secret exists:', !!process.env.GOOGLE_CLIENT_SECRET);

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
    callbackURL: 'https://cc65-115-244-45-193.ngrok-free.app/api/auth/google/callback',  
    proxy: true  // Add this to trust the proxy
}, async (accessToken, refreshToken, profile, done) => {
    console.log('Google strategy executing'); //debug log remove later
    try {
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                email: profile.emails[0].value,
                username: profile.displayName,
                authType: 'google',
                preferences: { genres: [] }
            });
        }
        
        return done(null, user);
    } catch (error) {
        console.error('Error in Google strategy:', error); //debug log remove later
        return done(error, null);
    }
}));

module.exports = passport;