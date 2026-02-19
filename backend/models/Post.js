const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: ['discussion', 'question', 'success_story', 'video_tutorial', 'government_scheme', 'news'],
            default: 'discussion',
        },
        media: [
            {
                type: { type: String, enum: ['image', 'video', 'document'], default: 'image' },
                url: String,
            },
        ],
        tags: [String],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        // Denormalized count for performance
        likesCount: {
            type: Number,
            default: 0,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isVerifiedExpertAnswer: {
            type: Boolean,
            default: false, // For Q&A
        },
    },
    {
        timestamps: true,
    }
);

postSchema.index({ type: 1, createdAt: -1 });
postSchema.index({ tags: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
