const mongoose = require('mongoose');

const exportListingSchema = new mongoose.Schema(
    {
        crop: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Crop',
            required: true,
        },
        exporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        destinationCountries: [
            {
                type: String, // Country codes or names
            },
        ],
        contractType: {
            type: String,
            enum: ['fob', 'cif', 'exw'], // Incoterms
            default: 'fob',
        },
        quantityAvailable: {
            value: Number,
            unit: { type: String, default: 'ton' },
        },
        pricePerUnit: {
            value: Number,
            currency: { type: String, default: 'USD' },
        },
        qualityCertifications: [
            {
                name: String, // e.g., 'Phytosanitary', 'Organic', 'GlobalGAP'
                issuingAuthority: String,
                certificateUrl: String,
                validUntil: Date,
            },
        ],
        complianceStatus: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        documentation: [
            {
                type: String, // e.g., 'Invoice', 'Packing List', 'Certificate of Origin'
                url: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('ExportListing', exportListingSchema);
