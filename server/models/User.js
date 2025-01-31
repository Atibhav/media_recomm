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
        }],
        //user preferences enhancements
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