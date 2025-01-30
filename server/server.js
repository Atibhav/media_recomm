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
    credentials: true
}));
app.use(express.json());

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
    console.log(`- http://localhost:${PORT}/test`);
});