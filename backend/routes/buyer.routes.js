const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Order = require('../models/Order');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Get Buyer Dashboard ─────────────────────────────────
router.get('/dashboard', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const buyerId = req.user._id;

        const [totalOrders, activeOrders, completedOrders] = await Promise.all([
            Order.countDocuments({ buyer: buyerId }),
            Order.countDocuments({ buyer: buyerId, status: { $in: ['pending', 'negotiating', 'accepted', 'confirmed', 'in_transit'] } }),
            Order.countDocuments({ buyer: buyerId, status: 'completed' }),
        ]);

        const totalSpent = await Order.aggregate([
            { $match: { buyer: buyerId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$pricing.finalAmount' } } },
        ]);

        res.json({
            success: true,
            data: {
                totalOrders,
                activeOrders,
                completedOrders,
                totalSpent: totalSpent[0]?.total || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Buyer Profile ────────────────────────────────
router.put('/profile', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const { buyerProfile, location, name } = req.body;
        const update = {};
        if (buyerProfile) update.buyerProfile = buyerProfile;
        if (location) update.location = location;
        if (name) update.name = name;

        const user = await User.findByIdAndUpdate(req.user._id, update, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, message: 'Buyer profile updated.', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── KYC Verification ────────────────────────────────────
router.post('/kyc', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const { pan, gst, tradeLicense, gstNumber } = req.body;

        await User.findByIdAndUpdate(req.user._id, {
            'buyerProfile.kycDocuments': { pan, gst, tradeLicense },
            'buyerProfile.gstNumber': gstNumber,
            'buyerProfile.kycVerified': false, // Admin will verify
        });

        res.json({ success: true, message: 'KYC documents submitted for verification.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get All Buyers ──────────────────────────────────────
router.get('/', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 12, businessType } = req.query;
        const filter = { role: 'buyer' };
        if (businessType) filter['buyerProfile.businessType'] = businessType;

        const buyers = await User.find(filter)
            .select('name phone location rating buyerProfile')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                buyers,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
