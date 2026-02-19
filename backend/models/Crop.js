const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
    {
        farmer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: [true, 'Crop name is required'],
            trim: true,
        },
        category: {
            type: String,
            enum: [
                'grains', 'pulses', 'vegetables', 'fruits', 'spices',
                'oilseeds', 'fibers', 'sugarcane', 'tea_coffee', 'other',
            ],
            required: true,
        },
        variety: String,
        description: String,
        quantity: {
            value: {
                type: Number,
                required: [true, 'Quantity is required'],
                min: 0,
            },
            unit: {
                type: String,
                enum: ['kg', 'quintal', 'ton', 'dozen', 'piece', 'bundle'],
                default: 'kg',
            },
        },
        qualityGrade: {
            type: String,
            enum: ['A+', 'A', 'B', 'C'],
            default: 'A',
        },
        price: {
            expected: {
                type: Number,
                required: [true, 'Expected price is required'],
            },
            minimum: Number,
            currency: {
                type: String,
                default: 'INR',
            },
            unit: {
                type: String,
                enum: ['per_kg', 'per_quintal', 'per_ton', 'per_dozen', 'per_piece'],
                default: 'per_kg',
            },
        },
        mandiPrice: {
            current: Number,
            lastUpdated: Date,
            mandiName: String,
        },
        aiSuggestedPrice: {
            price: Number,
            confidence: Number,
            lastUpdated: Date,
        },
        harvestDate: {
            type: Date,
        },
        availableFrom: {
            type: Date,
            default: Date.now,
        },
        availableTill: Date,
        images: [
            {
                url: String,
                caption: String,
            },
        ],
        location: {
            state: String,
            district: String,
            village: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        isOrganic: {
            type: Boolean,
            default: false,
        },
        certifications: [String],
        status: {
            type: String,
            enum: ['active', 'sold', 'expired', 'draft', 'suspended'],
            default: 'active',
        },
        views: {
            type: Number,
            default: 0,
        },
        inquiries: {
            type: Number,
            default: 0,
        },
        tags: [String],
        qualityVerification: {
            verified: { type: Boolean, default: false },
            grade: { type: String, enum: ['A+', 'A', 'B', 'C', 'Pending'], default: 'Pending' },
            verifiedBy: { type: String, enum: ['AI', 'Admin', 'ThirdParty'], default: 'AI' },
            date: Date,
            certificateUrl: String,
            defects: [String], // e.g., 'discoloration', 'pest_damage'
            confidenceScore: Number, // AI confidence
        },
        traceability: {
            blockchainTxId: String,
            qrCodeUrl: String,
            steps: [
                {
                    stage: { type: String, enum: ['harvested', 'processed', 'packed', 'shipped', 'delivered'] },
                    location: String,
                    timestamp: { type: Date, default: Date.now },
                    handler: String, // Name of person/entity handling
                },
            ],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for search performance
cropSchema.index({ name: 'text', description: 'text', tags: 'text' });
cropSchema.index({ 'location.state': 1, 'location.district': 1 });
cropSchema.index({ category: 1, status: 1 });
cropSchema.index({ farmer: 1 });
cropSchema.index({ 'price.expected': 1 });

module.exports = mongoose.model('Crop', cropSchema);
