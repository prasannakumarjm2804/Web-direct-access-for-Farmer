const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 1000,
        },
        interestRate: {
            type: Number,
            required: true, // Annual percentage
        },
        tenureMonths: {
            type: Number,
            required: true,
        },
        purpose: {
            type: String,
            enum: ['seeds_fertilizers', 'equipment', 'irrigation', 'labor_costs', 'land_lease', 'other'],
            required: true,
        },
        provider: {
            name: { type: String, required: true },
            type: { type: String, enum: ['bank', 'nbfc', 'cooperative', 'government'], default: 'bank' },
            contact: String,
        },
        status: {
            type: String,
            enum: ['applied', 'processing', 'approved', 'rejected', 'disbursed', 'repaid', 'defaulted'],
            default: 'applied',
        },
        creditScoreSnapshot: {
            type: Number,
            required: true,
        },
        documents: [
            {
                name: String,
                url: String, // URL to document
                verified: { type: Boolean, default: false },
            },
        ],
        repaymentSchedule: [
            {
                dueDate: Date,
                amount: Number,
                status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
                paidAt: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Loan', loanSchema);
