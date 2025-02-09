const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { email, password, username } = req.body;

            // Debug log
            console.log('Registration attempt:', { email, username });

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide email and password' 
                });
            }

            // Username validation
            const generatedUsername = username || email.split('@')[0];
            if (generatedUsername.length < 3) {
                return res.status(400).json({
                    success: false,
                    message: 'Username must be at least 3 characters long'
                });
            }

            // Password validation
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'Password must be at least 6 characters long'
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ 
                $or: [
                    { email: email.toLowerCase() },
                    { username: generatedUsername }
                ]
            });

            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: existingUser.email === email.toLowerCase() ? 
                        'Email already exists' : 
                        'Username already exists'
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user with default preferences
            const newUser = new User({
                username: generatedUsername,
                email: email.toLowerCase(),
                password: hashedPassword,
                authType: 'local',
                preferences: {
                    genres: [],
                    watchlist: [],
                    language: {
                        primary: 'en',
                        subtitle: 'en'
                    },
                    contentFilters: {
                        maxRating: 'PG-13',
                        excludedGenres: [],
                        adultContent: false
                    },
                    genrePreferences: {
                        liked: [],
                        disliked: []
                    }
                }
            });

            // Save user to database
            const savedUser = await newUser.save();
            console.log('User registered successfully:', savedUser._id);

            // Create JWT token
            const token = jwt.sign(
                { id: savedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            // Send response
            res.status(201).json({
                success: true,
                token,
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    preferences: savedUser.preferences
                }
            });

        } catch (error) {
            // Detailed error logging
            console.error('Registration error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
                code: error.code
            });

            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                return res.status(400).json({
                    success: false,
                    message: Object.values(error.errors)
                        .map(err => err.message)
                        .join(', ')
                });
            }

            // Handle duplicate key errors
            if (error.code === 11000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    success: false,
                    message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
                });
            }

            // Generic server error
            res.status(500).json({ 
                success: false, 
                message: 'Server error during registration',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide email and password' 
                });
            }

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid credentials' 
                });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error during login' 
            });
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }
            res.json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            console.error('Profile fetch error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error while fetching profile' 
            });
        }
    },

    // Update preferences
    updatePreferences: async (req, res) => {
        try {
            const { genres } = req.body;
            
            // Validate genres
            if (!Array.isArray(genres)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Genres must be an array' 
                });
            }

            // Update user preferences
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { 
                    $set: { 
                        'preferences.genres': genres 
                    }
                },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            res.json({
                success: true,
                message: 'Preferences updated successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            console.error('Preferences update error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error while updating preferences' 
            });
        }
    }
};

module.exports = authController;