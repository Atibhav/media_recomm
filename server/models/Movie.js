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
            max: 5,
            required: true
        },
        review: {
            type: String,
            maxLength: 500  
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {            
        type: Number,
        default: 0
    },
    totalRatings: {            
        type: Number,
        default: 0
    },
    watchedBy: [{                
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

movieSchema.pre('save', function(next) {
    if (this.ratings && this.ratings.length > 0) {
        this.totalRatings = this.ratings.length;
        this.averageRating = this.ratings.reduce((sum, rating) => sum + rating.rating, 0) / this.ratings.length;
    } else {
        this.totalRatings = 0;
        this.averageRating = 0;
    }
    next();
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;