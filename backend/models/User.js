const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: 100,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            unique: true,
            match: [/^[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'],
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['farmer', 'buyer', 'logistics', 'admin', 'expert'],
            required: true,
            default: 'farmer',
        },
        avatar: {
            type: String,
            default: '',
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        otp: {
            code: String,
            expiresAt: Date,
        },
        refreshToken: String,
        location: {
            state: String,
            district: String,
            village: String,
            pincode: String,
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        language: {
            type: String,
            enum: ['en', 'hi', 'ta', 'te', 'kn', 'mr', 'bn', 'gu', 'pa', 'ml'],
            default: 'en',
        },
        rating: {
            average: { type: Number, default: 0 },
            count: { type: Number, default: 0 },
        },
        // Farmer-specific fields
        farmerProfile: {
            farmSize: String, // in acres
            crops: [String],
            farmingType: {
                type: String,
                enum: ['organic', 'traditional', 'mixed', ''],
            },
            experience: Number, // years
            bankDetails: {
                accountNumber: String,
                ifscCode: String,
                bankName: String,
                upiId: String,
            },
            documents: {
                aadhar: String,
                landRecord: String,
            },
        },
        // Buyer-specific fields
        buyerProfile: {
            businessName: String,
            businessType: {
                type: String,
                enum: ['retailer', 'wholesaler', 'exporter', 'consumer', 'processor', ''],
            },
            gstNumber: String,
            kycVerified: {
                type: Boolean,
                default: false,
            },
            kycDocuments: {
                pan: String,
                gst: String,
                tradeLicense: String,
            },
        },
        // Logistics partner fields
        logisticsProfile: {
            vehicleType: String,
            vehicleNumber: String,
            licenseNumber: String,
            serviceArea: [String],
            isAvailable: {
                type: Boolean,
                default: true,
            },
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP
userSchema.methods.generateOTP = function () {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.otp = {
        code: otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    };
    return otp;
};

// Verify OTP
userSchema.methods.verifyOTP = function (inputOTP) {
    if (!this.otp || !this.otp.code) return false;
    if (new Date() > this.otp.expiresAt) return false;
    return this.otp.code === inputOTP;
};

module.exports = mongoose.model('User', userSchema);
