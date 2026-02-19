const express = require('express');
const router = express.Router();
const Logistics = require('../models/Logistics');
const Order = require('../models/Order');
const { authenticate, authorize } = require('../middleware/auth');

// ─── Create Shipment ─────────────────────────────────────
router.post('/', authenticate, async (req, res) => {
    try {
        const { orderId, pickup, delivery, vehicle, charges } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        const shipment = await Logistics.create({
            trackingId: undefined,
            order: orderId,
            partner: req.user.role === 'logistics' ? req.user._id : undefined,
            pickup,
            delivery,
            vehicle,
            charges,
            status: 'scheduled',
            statusUpdates: [{ status: 'scheduled', location: pickup?.address?.village || 'Origin', note: 'Shipment scheduled' }],
        });

        order.delivery.logistics = shipment._id;
        order.status = 'in_transit';
        order.statusHistory.push({ status: 'in_transit', note: `Tracking: ${shipment.trackingId}` });
        await order.save();

        res.status(201).json({ success: true, message: 'Shipment created.', data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Shipment Status ──────────────────────────────
router.put('/:id/status', authenticate, async (req, res) => {
    try {
        const { status, location, note } = req.body;
        const shipment = await Logistics.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found.' });
        }

        shipment.status = status;
        shipment.statusUpdates.push({ status, location, note });

        if (status === 'picked_up') shipment.pickup.actualDate = new Date();
        if (status === 'delivered') shipment.delivery.actualDate = new Date();

        await shipment.save();

        // Update order status
        if (status === 'delivered') {
            const order = await Order.findById(shipment.order);
            if (order) {
                order.status = 'delivered';
                order.delivery.actualDate = new Date();
                order.statusHistory.push({ status: 'delivered', note: 'Delivery confirmed' });
                await order.save();
            }
        }

        res.json({ success: true, message: 'Shipment status updated.', data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Track Shipment ──────────────────────────────────────
router.get('/track/:trackingId', async (req, res) => {
    try {
        const shipment = await Logistics.findOne({ trackingId: req.params.trackingId })
            .populate('order', 'orderId status')
            .populate('partner', 'name phone');

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found.' });
        }

        res.json({ success: true, data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get My Shipments (Logistics Partner) ────────────────
router.get('/my', authenticate, authorize('logistics'), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = { partner: req.user._id };
        if (status) filter.status = status;

        const shipments = await Logistics.find(filter)
            .populate('order', 'orderId farmer buyer')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Logistics.countDocuments(filter);

        res.json({
            success: true,
            data: {
                shipments,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Confirm Delivery ────────────────────────────────────
router.post('/:id/confirm', authenticate, async (req, res) => {
    try {
        const { receiverName, signature } = req.body;
        const shipment = await Logistics.findById(req.params.id);

        if (!shipment) {
            return res.status(404).json({ success: false, message: 'Shipment not found.' });
        }

        shipment.status = 'delivered';
        shipment.proofOfDelivery = {
            receiverName,
            signature,
            receivedAt: new Date(),
        };
        shipment.delivery.actualDate = new Date();
        shipment.statusUpdates.push({ status: 'delivered', note: `Received by ${receiverName}` });
        await shipment.save();

        res.json({ success: true, message: 'Delivery confirmed.', data: shipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
