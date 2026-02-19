const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const AdminLog = require('../models/AdminLog');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Admin Dashboard Stats ───────────────────────────────
router.get('/dashboard', authenticate, authorize('admin'), async (req, res) => {
    try {
        const [
            totalFarmers, totalBuyers, totalCrops, totalOrders,
            activeOrders, completedOrders,
        ] = await Promise.all([
            User.countDocuments({ role: 'farmer' }),
            User.countDocuments({ role: 'buyer' }),
            Crop.countDocuments({ status: 'active' }),
            Order.countDocuments(),
            Order.countDocuments({ status: { $in: ['pending', 'accepted', 'in_transit'] } }),
            Order.countDocuments({ status: 'completed' }),
        ]);

        const revenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                    commission: { $sum: '$commission.platform' },
                },
            },
        ]);

        // Monthly orders trend
        const monthlyOrders = await Order.aggregate([
            {
                $group: {
                    _id: { $month: '$createdAt' },
                    count: { $sum: 1 },
                    revenue: { $sum: '$pricing.finalAmount' },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Top crops
        const topCrops = await Crop.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]);

        // State-wise distribution
        const stateWise = await User.aggregate([
            { $match: { role: 'farmer' } },
            { $group: { _id: '$location.state', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]);

        res.json({
            success: true,
            data: {
                overview: {
                    totalFarmers,
                    totalBuyers,
                    totalCrops,
                    totalOrders,
                    activeOrders,
                    completedOrders,
                    totalRevenue: revenue[0]?.total || 0,
                    platformCommission: revenue[0]?.commission || 0,
                },
                charts: {
                    monthlyOrders,
                    topCrops,
                    stateWise,
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Manage Users ────────────────────────────────────────
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { role, search, isActive, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (role) filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search } },
            ];
        }

        const users = await User.find(filter)
            .select('-otp -refreshToken')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await User.countDocuments(filter);

        res.json({
            success: true,
            data: {
                users,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Toggle User Status ──────────────────────────────────
router.put('/users/:id/toggle', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        user.isActive = !user.isActive;
        await user.save();

        await AdminLog.create({
            admin: req.user._id,
            action: user.isActive ? 'activate_user' : 'deactivate_user',
            entity: { type: 'user', id: user._id.toString() },
            details: { userName: user.name, userRole: user.role },
        });

        res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Verify Buyer KYC ────────────────────────────────────
router.put('/users/:id/verify-kyc', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { 'buyerProfile.kycVerified': true },
            { new: true }
        );

        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        await AdminLog.create({
            admin: req.user._id,
            action: 'verify_kyc',
            entity: { type: 'user', id: user._id.toString() },
        });

        res.json({ success: true, message: 'KYC verified.', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Moderate Crop Listing ───────────────────────────────
router.put('/crops/:id/moderate', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { action, reason } = req.body;
        const crop = await Crop.findById(req.params.id);

        if (!crop) return res.status(404).json({ success: false, message: 'Crop not found.' });

        crop.status = action === 'approve' ? 'active' : 'suspended';
        await crop.save();

        await AdminLog.create({
            admin: req.user._id,
            action: `${action}_crop`,
            entity: { type: 'crop', id: crop._id.toString() },
            details: { reason },
        });

        res.json({ success: true, message: `Crop ${action}d.`, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get All Orders (Admin) ──────────────────────────────
router.get('/orders', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate('farmer', 'name phone')
            .populate('buyer', 'name phone')
            .populate('crop', 'name category')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            data: {
                orders,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Admin Logs ──────────────────────────────────────
router.get('/logs', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const logs = await AdminLog.find()
            .populate('admin', 'name')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await AdminLog.countDocuments();

        res.json({
            success: true,
            data: {
                logs,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
