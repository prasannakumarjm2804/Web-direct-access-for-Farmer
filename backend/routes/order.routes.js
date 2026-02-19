const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Crop = require('../models/Crop');
const Notification = require('../models/Notification');
const { authenticate, authorize } = require('../middleware/auth');
const { calculateCommission } = require('../utils/helpers');

// ─── Create Order ────────────────────────────────────────
router.post('/', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const { cropId, quantity, offeredPrice, deliveryAddress, notes, isContractFarming } = req.body;

        const crop = await Crop.findById(cropId).populate('farmer');
        if (!crop || crop.status !== 'active') {
            return res.status(404).json({ success: false, message: 'Crop not available.' });
        }

        if (quantity.value > crop.quantity.value) {
            return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock.' });
        }

        const unitPrice = offeredPrice || crop.price.expected;
        const totalAmount = unitPrice * quantity.value;
        const commission = calculateCommission(totalAmount);
        const platformFee = Math.round(totalAmount * 0.01);
        const gst = Math.round((commission + platformFee) * 0.18);

        const order = await Order.create({
            orderId: undefined, // Auto-generated in pre-save
            crop: cropId,
            farmer: crop.farmer._id,
            buyer: req.user._id,
            quantity,
            pricing: {
                unitPrice,
                totalAmount,
                commission,
                platformFee,
                gst,
                finalAmount: totalAmount + platformFee + gst,
            },
            negotiation: offeredPrice !== crop.price.expected ? {
                buyerOffer: offeredPrice,
                rounds: [{
                    offeredBy: 'buyer',
                    amount: offeredPrice,
                    message: notes || 'Initial offer',
                    timestamp: new Date(),
                }],
            } : undefined,
            status: offeredPrice !== crop.price.expected ? 'negotiating' : 'pending',
            statusHistory: [{ status: 'pending', note: 'Order created' }],
            delivery: {
                type: 'delivery',
                address: deliveryAddress,
            },
            isContractFarming: isContractFarming || false,
            notes,
        });

        // Send notification to farmer
        await Notification.create({
            user: crop.farmer._id,
            type: 'new_offer',
            title: 'New Order Received!',
            message: `${req.user.name} wants to buy ${quantity.value} ${quantity.unit} of ${crop.name}`,
            data: { orderId: order._id.toString(), cropId: cropId.toString(), fromUser: req.user._id },
        });

        // Socket notification
        const io = req.app.get('io');
        io.to(crop.farmer._id.toString()).emit('order_notification', {
            type: 'new_order',
            order: order,
        });

        res.status(201).json({ success: true, message: 'Order placed successfully.', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Accept/Reject Order (Farmer) ────────────────────────
router.put('/:id/respond', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const { action, counterPrice, message } = req.body; // action: accept, reject, counter
        const order = await Order.findOne({ _id: req.params.id, farmer: req.user._id });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        if (action === 'accept') {
            order.status = 'accepted';
            order.statusHistory.push({ status: 'accepted', note: message || 'Order accepted by farmer' });

            if (order.negotiation?.buyerOffer) {
                order.negotiation.agreedPrice = order.negotiation.buyerOffer;
            }
        } else if (action === 'reject') {
            order.status = 'cancelled';
            order.cancellationReason = message || 'Rejected by farmer';
            order.statusHistory.push({ status: 'cancelled', note: order.cancellationReason });
        } else if (action === 'counter') {
            order.status = 'negotiating';
            order.negotiation.farmerCounter = counterPrice;
            order.negotiation.rounds.push({
                offeredBy: 'farmer',
                amount: counterPrice,
                message: message || 'Counter offer',
            });
            order.statusHistory.push({ status: 'negotiating', note: `Counter: ₹${counterPrice}` });
        }

        await order.save();

        // Notify buyer
        await Notification.create({
            user: order.buyer,
            type: action === 'accept' ? 'order_accepted' : 'order_rejected',
            title: action === 'accept' ? 'Order Accepted!' : action === 'counter' ? 'Counter Offer' : 'Order Rejected',
            message: message || `Farmer ${action}ed your order ${order.orderId}`,
            data: { orderId: order._id.toString() },
        });

        res.json({ success: true, message: `Order ${action}ed.`, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Farmer's Orders ─────────────────────────────────
router.get('/farmer', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = { farmer: req.user._id };
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate('crop', 'name category images quantity')
            .populate('buyer', 'name phone location buyerProfile')
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

// ─── Get Buyer's Orders ──────────────────────────────────
router.get('/buyer', authenticate, authorize('buyer'), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = { buyer: req.user._id };
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate('crop', 'name category images quantity price')
            .populate('farmer', 'name phone location rating')
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

// ─── Get Single Order ────────────────────────────────────
router.get('/:id', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('crop')
            .populate('farmer', 'name phone location rating avatar')
            .populate('buyer', 'name phone location buyerProfile');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        // Verify access
        const userId = req.user._id.toString();
        if (order.farmer._id.toString() !== userId && order.buyer._id.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Order Status ─────────────────────────────────
router.put('/:id/status', authenticate, async (req, res) => {
    try {
        const { status, note } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        order.status = status;
        order.statusHistory.push({ status, note, updatedBy: req.user._id });
        await order.save();

        res.json({ success: true, message: 'Order status updated.', data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
