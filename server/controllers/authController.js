const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Validate input
            if (!username || !email || !password) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Please provide all required fields' 
                });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'User already exists' 
                });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                authType: 'local',
                preferences: { genres: [] }
            });

            // Save user to database
            const savedUser = await newUser.save();

            // Create JWT token
            const token = jwt.sign(
                { id: savedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

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
            console.error('Registration error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Server error during registration' 
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