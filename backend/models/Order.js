const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        crop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Crop',
            required: true,
        },
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        quantity: {
            value: { type: Number, required: true },
            unit: { type: String, default: 'kg' },
        },
        pricing: {
            unitPrice: { type: Number, required: true },
            totalAmount: { type: Number, required: true },
            commission: { type: Number, default: 0 },
            platformFee: { type: Number, default: 0 },
            gst: { type: Number, default: 0 },
            finalAmount: { type: Number, required: true },
        },
        negotiation: {
            buyerOffer: Number,
            farmerCounter: Number,
            agreedPrice: Number,
            rounds: [
                {
                    offeredBy: { type: String, enum: ['buyer', 'farmer'] },
                    amount: Number,
                    message: String,
                    timestamp: { type: Date, default: Date.now },
                },
            ],
        },
        status: {
            type: String,
            enum: [
                'pending', 'negotiating', 'accepted', 'confirmed',
                'payment_pending', 'paid', 'in_transit',
                'delivered', 'completed', 'cancelled', 'disputed',
            ],
            default: 'pending',
        },
        statusHistory: [
            {
                status: String,
                timestamp: { type: Date, default: Date.now },
                note: String,
                updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            },
        ],
        delivery: {
            type: {
                type: String,
                enum: ['pickup', 'delivery', 'logistics_partner'],
                default: 'delivery',
            },
            address: {
                street: String,
                city: String,
                state: String,
                pincode: String,
            },
            expectedDate: Date,
            actualDate: Date,
            logistics: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Logistics',
            },
        },
        payment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment',
        },
        isContractFarming: {
            type: Boolean,
            default: false,
        },
        contractDetails: {
            duration: String,
            terms: String,
            startDate: Date,
            endDate: Date,
        },
        invoice: {
            number: String,
            generatedAt: Date,
            gstInvoice: Boolean,
        },
        notes: String,
        cancellationReason: String,
    },
    {
        timestamps: true,
    }
);

// Generate orderId
orderSchema.pre('save', function (next) {
    if (!this.orderId) {
        this.orderId = 'AGR-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    }
    next();
});

orderSchema.index({ farmer: 1, status: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ orderId: 1 });

module.exports = mongoose.model('Order', orderSchema);
