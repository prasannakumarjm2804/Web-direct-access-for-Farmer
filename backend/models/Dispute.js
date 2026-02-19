const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema(
    {
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        raisedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        issueType: {
            type: String,
            enum: ['quality_mismatch', 'quantity_shortage', 'payment_issue', 'logistics_delay', 'damaged_goods', 'other'],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        evidence: [
            {
                type: String, // URL to image/video
                required: true,
            },
        ],
        status: {
            type: String,
            enum: ['open', 'under_review', 'resolved', 'escalated', 'closed'],
            default: 'open',
        },
        resolution: {
            outcome: String,
            refundAmount: Number,
            resolvedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Admin ID
            },
            resolvedAt: Date,
        },
        adminNotes: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Dispute', disputeSchema);
