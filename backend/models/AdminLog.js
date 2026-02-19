const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema(
    {
        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        entity: {
            type: { type: String, enum: ['user', 'crop', 'order', 'payment', 'logistics', 'system'] },
            id: String,
        },
        details: mongoose.Schema.Types.Mixed,
        ipAddress: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('AdminLog', adminLogSchema);
