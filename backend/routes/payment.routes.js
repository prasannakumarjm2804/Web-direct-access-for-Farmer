const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Initiate Payment ────────────────────────────────────
router.post('/initiate', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const { orderId, method, upiId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (order.buyer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        const payment = await Payment.create({
            transactionId: undefined,
            order: orderId,
            payer: req.user._id,
            payee: order.farmer,
            amount: order.pricing.finalAmount,
            commission: {
                platform: order.pricing.commission + order.pricing.platformFee,
            },
            netAmount: order.pricing.totalAmount,
            method: method || 'upi',
            upiDetails: method === 'upi' ? { upiId } : undefined,
            status: 'escrow_held',
            escrow: {
                isEscrow: true,
                heldAt: new Date(),
                releaseCondition: 'delivery_confirmed',
            },
        });

        // Update order
        order.payment = payment._id;
        order.status = 'paid';
        order.statusHistory.push({ status: 'paid', note: 'Payment held in escrow' });
        await order.save();

        res.status(201).json({
            success: true,
            message: 'Payment initiated. Amount held in escrow until delivery.',
            data: payment,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Release Escrow ──────────────────────────────────────
router.post('/:id/release', authenticate, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id);
        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }

        // Only buyer or admin can release
        if (payment.payer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized.' });
        }

        payment.status = 'completed';
        payment.escrow.releasedAt = new Date();
        payment.escrow.releaseCondition = req.user.role === 'admin' ? 'admin_release' : 'delivery_confirmed';
        await payment.save();

        // Update order to completed
        const order = await Order.findById(payment.order);
        if (order) {
            order.status = 'completed';
            order.statusHistory.push({ status: 'completed', note: 'Payment released to farmer' });
            await order.save();
        }

        res.json({ success: true, message: 'Payment released to farmer.', data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Payment History ─────────────────────────────────
router.get('/history', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 10, type } = req.query;
        const userId = req.user._id;

        const filter = type === 'sent'
            ? { payer: userId }
            : type === 'received'
                ? { payee: userId }
                : { $or: [{ payer: userId }, { payee: userId }] };

        const payments = await Payment.find(filter)
            .populate('order', 'orderId')
            .populate('payer', 'name phone')
            .populate('payee', 'name phone')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Payment.countDocuments(filter);

        res.json({
            success: true,
            data: {
                payments,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Payment Details ─────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('order')
            .populate('payer', 'name phone')
            .populate('payee', 'name phone');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found.' });
        }

        res.json({ success: true, data: payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
