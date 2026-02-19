const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Get Farmer Dashboard ────────────────────────────────
router.get('/dashboard', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const farmerId = req.user._id;

        const [activeCrops, totalOrders, completedOrders, pendingOrders] = await Promise.all([
            Crop.countDocuments({ farmer: farmerId, status: 'active' }),
            Order.countDocuments({ farmer: farmerId }),
            Order.countDocuments({ farmer: farmerId, status: 'completed' }),
            Order.countDocuments({ farmer: farmerId, status: { $in: ['pending', 'negotiating', 'accepted'] } }),
        ]);

        // Revenue calculation
        const revenue = await Order.aggregate([
            { $match: { farmer: farmerId, status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$pricing.finalAmount' } } },
        ]);

        res.json({
            success: true,
            data: {
                activeCrops,
                totalOrders,
                completedOrders,
                pendingOrders,
                totalRevenue: revenue[0]?.total || 0,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Farmer Profile ──────────────────────────────────
router.get('/profile/:id', async (req, res) => {
    try {
        const farmer = await User.findOne({ _id: req.params.id, role: 'farmer' })
            .select('-password -otp -refreshToken');

        if (!farmer) {
            return res.status(404).json({ success: false, message: 'Farmer not found.' });
        }

        const crops = await Crop.find({ farmer: farmer._id, status: 'active' }).limit(10);
        const orderCount = await Order.countDocuments({ farmer: farmer._id, status: 'completed' });

        res.json({
            success: true,
            data: { farmer, crops, completedOrders: orderCount },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Farmer Profile ───────────────────────────────
router.put('/profile', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const { farmerProfile, location, name } = req.body;
        const update = {};
        if (farmerProfile) update.farmerProfile = farmerProfile;
        if (location) update.location = location;
        if (name) update.name = name;

        const user = await User.findByIdAndUpdate(req.user._id, update, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, message: 'Farmer profile updated.', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get All Farmers (for buyers) ────────────────────────
router.get('/', async (req, res) => {
    try {
        const { state, district, crop, page = 1, limit = 12 } = req.query;
        const filter = { role: 'farmer', isActive: true };

        if (state) filter['location.state'] = state;
        if (district) filter['location.district'] = district;

        let farmers = await User.find(filter)
            .select('name phone location rating avatar farmerProfile')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                farmers,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
