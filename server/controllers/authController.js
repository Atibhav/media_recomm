const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
    // Register new user
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create new user
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                preferences: { genres: [] } // Initialize empty preferences
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
                token,
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    preferences: savedUser.preferences
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'User does not exist' });
            }

            // Validate password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get user profile
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({
                id: user._id,
                username: user.username,
                email: user.email,
                preferences: user.preferences
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update preferences
    updatePreferences: async (req, res) => {
        try {
            const { genres } = req.body;
            
            // Validate genres
            if (!Array.isArray(genres)) {
                return res.status(400).json({ message: 'Genres must be an array' });
            }

            // Update user preferences
            const user = await User.findByIdAndUpdate(
                req.user.id,
                { 
                    $set: { 
                        preferences: { genres }
                    }
                },
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({
                message: 'Preferences updated successfully',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    preferences: user.preferences
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = authController;