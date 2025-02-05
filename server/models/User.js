const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [function() { return this.authType === 'local'; }, 'Password is required for local auth'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    googleId: {
        type: String,
        sparse: true,    // Allows null but ensures uniqueness when present
        unique: true
    },
    authType: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    preferences: {
        genres: [{
            type: String
        }],
        watchlist: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        }],
        language: {
            primary: {
                type: String,
                default: 'en',
                enum: ['en', 'es', 'fr', 'hi', 'ja', 'ko', 'zh']
            },
            subtitle: {
                type: String,
                default: 'en'
            }
        },
        contentFilters: {
            maxRating: {
                type: String,
                enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
                default: 'R'
            },
            excludedGenres: [{
                type: String
            }],
            adultContent: {
                type: Boolean,
                default: false
            }
        },
        genrePreferences: {
            liked: [{
                genre: String,
                weight: {
                    type: Number,
                    default: 1,
                    min: 0,
                    max: 2
                }
            }],
            disliked: [String]
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);