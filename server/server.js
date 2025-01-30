require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');  
const passport = require('passport');        
require('./config/passport');               

const app = express();

// Debug logging
console.log('Starting server...');

// Middleware
app.use(cors({
    origin: '*',  // Allow all origins for testing
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Location']  // Add this line
}));
app.use(express.json());

//security headers
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    res.header('X-XSS-Protection', '1; mode=block');
    next();
});
// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Add after middleware and before routes
app.get('/test', (req, res) => {
    res.send(`
        <html>
            <body>
                <h1>Test Page</h1>
                <p>Server is working!</p>
                <a href="/api/auth/google">Click here to test Google OAuth</a>
            </body>
        </html>
    `);
});

// Test route to verify server response
app.get('/', (req, res) => {
    console.log('Root route hit');
    res.json({ message: 'Server is working' });
});

app.get('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Test route is working' });
});

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// Add after other middleware
app.use((req, res, next) => {
    // Set timeout to 30 seconds
    req.setTimeout(30000, () => {
        console.error('Request timeout');
        res.status(408).json({ error: 'Request timeout' });
    });
    next();
});

app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
// Add after your routes
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(500).send(`
        <html>
        <body>
            <h1>Server Error</h1>
            <p>${err.message}</p>
        </body>
        </html>
    `);
});

// Add a route to serve the auth page
app.get('/auth-test', (req, res) => {
    res.sendFile(__dirname + '/public/auth.html');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Add after your middleware setup
app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store');
    res.header('Content-Security-Policy', "default-src 'self' https: 'unsafe-inline'");
    res.header('X-Content-Type-Options', 'nosniff');
    next();
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Try accessing:');
    console.log(`- http://localhost:${PORT}`);
    console.log(`- http://localhost:${PORT}/test`);
});