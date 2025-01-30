const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false  // Not required for Google auth
    },
    googleId: {
        type: String,
        sparse: true    // Allows null but ensures uniqueness when present
    },
    authType: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    preferences: {
        genres: [String],
        watchlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);