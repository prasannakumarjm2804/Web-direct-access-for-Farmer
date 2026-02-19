const jwt = require('jsonwebtoken');

// Generate access token
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'defaultSecret123';
    return jwt.sign({ id: userId }, secret, {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    const secret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret456';
    return jwt.sign({ id: userId }, secret, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
    });
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    const secret = process.env.JWT_REFRESH_SECRET || 'defaultRefreshSecret456';
    return jwt.verify(token, secret);
};

// Generate OTP (6 digits)
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Format price in INR
const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

// Calculate platform commission
const calculateCommission = (amount, ratePercent = 2) => {
    return Math.round(amount * (ratePercent / 100) * 100) / 100;
};

// Paginate query results
const paginate = (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return query.skip(skip).limit(limit);
};

// Build filter object from query params
const buildFilter = (queryParams, allowedFields) => {
    const filter = {};
    for (const field of allowedFields) {
        if (queryParams[field]) {
            filter[field] = queryParams[field];
        }
    }
    return filter;
};

module.exports = {
    generateToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateOTP,
    formatINR,
    calculateCommission,
    paginate,
    buildFilter,
};
