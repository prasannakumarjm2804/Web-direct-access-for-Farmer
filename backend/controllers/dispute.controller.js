const Dispute = require('../models/Dispute');
const Order = require('../models/Order');

exports.createDispute = async (req, res) => {
    try {
        const { orderId, issueType, description, evidence } = req.body;
        const userId = req.user._id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Verify user is part of the order
        if (order.farmer.toString() !== userId.toString() && order.buyer.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const dispute = new Dispute({
            order: orderId,
            raisedBy: userId,
            issueType,
            description,
            evidence
        });

        await dispute.save();

        // Update order status
        order.status = 'disputed';
        await order.save();

        res.status(201).json({ success: true, data: dispute });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getDisputes = async (req, res) => {
    try {
        // user can see disputes they raised or are involved in (needs complex query for involved)
        // For simplicity, showing raised by user or if admin
        const filter = {};
        if (req.user.role !== 'admin') {
            filter.raisedBy = req.user._id;
        }

        const disputes = await Dispute.find(filter)
            .populate('order')
            .populate('raisedBy', 'name role');

        res.status(200).json({ success: true, data: disputes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resolveDispute = async (req, res) => {
    try {
        const { disputeId, outcome, refundAmount, status, adminNotes } = req.body;

        const dispute = await Dispute.findById(disputeId);
        if (!dispute) return res.status(404).json({ success: false, message: 'Dispute not found' });

        dispute.resolution = {
            outcome,
            refundAmount,
            resolvedBy: req.user._id,
            resolvedAt: new Date()
        };
        dispute.status = status || 'resolved';
        dispute.adminNotes = adminNotes;

        await dispute.save();

        res.status(200).json({ success: true, data: dispute });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
