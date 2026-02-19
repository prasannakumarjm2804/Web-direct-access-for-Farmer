const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema(
    {
        trackingId: {
            type: String,
            unique: true,
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        partner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        pickup: {
            address: {
                street: String,
                village: String,
                district: String,
                state: String,
                pincode: String,
                coordinates: { lat: Number, lng: Number },
            },
            scheduledDate: Date,
            actualDate: Date,
            contactPerson: String,
            contactPhone: String,
        },
        delivery: {
            address: {
                street: String,
                city: String,
                district: String,
                state: String,
                pincode: String,
                coordinates: { lat: Number, lng: Number },
            },
            scheduledDate: Date,
            actualDate: Date,
            contactPerson: String,
            contactPhone: String,
        },
        route: {
            distance: Number, // in km
            estimatedTime: Number, // in hours
            waypoints: [
                {
                    location: String,
                    timestamp: Date,
                },
            ],
        },
        vehicle: {
            type: { type: String, enum: ['truck', 'mini_truck', 'tempo', 'van', 'bike', 'other'] },
            number: String,
            driverName: String,
            driverPhone: String,
        },
        status: {
            type: String,
            enum: [
                'scheduled', 'picked_up', 'in_transit',
                'out_for_delivery', 'delivered', 'cancelled', 'returned',
            ],
            default: 'scheduled',
        },
        statusUpdates: [
            {
                status: String,
                location: String,
                timestamp: { type: Date, default: Date.now },
                note: String,
            },
        ],
        charges: {
            base: Number,
            perKm: Number,
            total: Number,
            paidBy: { type: String, enum: ['buyer', 'farmer', 'split'] },
        },
        requiresColdStorage: {
            type: Boolean,
            default: false,
        },
        packageDetails: {
            weight: Number,
            units: Number,
            packagingType: String,
        },
        proofOfDelivery: {
            signature: String,
            photo: String,
            receiverName: String,
            receivedAt: Date,
        },
    },
    {
        timestamps: true,
    }
);

logisticsSchema.pre('save', function (next) {
    if (!this.trackingId) {
        this.trackingId = 'SHIP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    next();
});

logisticsSchema.index({ order: 1 });
logisticsSchema.index({ partner: 1, status: 1 });

module.exports = mongoose.model('Logistics', logisticsSchema);
