const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reviewee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: String,
        comment: {
            type: String,
            maxlength: 500,
        },
        aspects: {
            quality: { type: Number, min: 1, max: 5 },
            communication: { type: Number, min: 1, max: 5 },
            timeliness: { type: Number, min: 1, max: 5 },
            packaging: { type: Number, min: 1, max: 5 },
        },
        images: [String],
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index({ reviewee: 1 });
reviewSchema.index({ reviewer: 1 });

module.exports = mongoose.model('Review', reviewSchema);
