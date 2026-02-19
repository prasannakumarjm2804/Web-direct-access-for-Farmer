const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: [
                'order_placed', 'order_accepted', 'order_rejected',
                'payment_received', 'payment_sent',
                'delivery_update', 'delivery_confirmed',
                'new_offer', 'price_alert', 'weather_alert',
                'scheme_notification', 'message', 'system',
            ],
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        data: {
            orderId: String,
            cropId: String,
            fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            link: String,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ user: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
