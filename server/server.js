const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simplified MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Movie Recommendation API' });
});