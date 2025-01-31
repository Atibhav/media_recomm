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
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Location']
}));
app.use(express.json());

// Security headers
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
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Request timeout middleware
app.use((req, res, next) => {
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
const userRoutes = require('./routes/user');
console.log('User routes loaded:', userRoutes); // Debug log

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);  // Changed from /api/user to /api/users

// Test Routes
app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working' });
});

// HTML Routes
app.get('/', (req, res) => {
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

app.get('/auth-test', (req, res) => {
    res.sendFile(__dirname + '/public/auth.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Try accessing:');
    console.log(`- http://localhost:${PORT}`);
    console.log(`- http://localhost:${PORT}/api/test`);
});