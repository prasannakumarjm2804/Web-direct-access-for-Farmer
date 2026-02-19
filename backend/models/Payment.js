const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            unique: true,
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        payer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        payee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        commission: {
            platform: { type: Number, default: 0 },
            logistics: { type: Number, default: 0 },
        },
        netAmount: {
            type: Number,
            required: true,
        },
        method: {
            type: String,
            enum: ['upi', 'bank_transfer', 'escrow', 'cash', 'wallet'],
            required: true,
        },
        upiDetails: {
            upiId: String,
            transactionRef: String,
        },
        bankDetails: {
            accountNumber: String,
            ifscCode: String,
            transferRef: String,
        },
        status: {
            type: String,
            enum: ['initiated', 'escrow_held', 'processing', 'completed', 'failed', 'refunded'],
            default: 'initiated',
        },
        escrow: {
            isEscrow: { type: Boolean, default: true },
            heldAt: Date,
            releasedAt: Date,
            releaseCondition: {
                type: String,
                enum: ['delivery_confirmed', 'auto_release', 'admin_release', ''],
                default: 'delivery_confirmed',
            },
        },
        gstDetails: {
            gstAmount: Number,
            gstPercentage: Number,
            gstInvoiceNumber: String,
        },
        notes: String,
    },
    {
        timestamps: true,
    }
);

paymentSchema.pre('save', function (next) {
    if (!this.transactionId) {
        this.transactionId = 'TXN-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }
    next();
});

paymentSchema.index({ order: 1 });
paymentSchema.index({ payer: 1, status: 1 });
paymentSchema.index({ payee: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
