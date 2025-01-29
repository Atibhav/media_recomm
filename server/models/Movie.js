const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    tmdbId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    overview: String,
    genres: [{
        type: String
    }],
    releaseDate: Date,
    posterPath: String,
    backdropPath: String,        
    voteAverage: Number,         
    voteCount: Number,           
    type: {
        type: String,
        enum: ['movie', 'tv'],
        required: true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    watchedBy: [{                
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;