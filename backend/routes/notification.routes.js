const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { authenticate } = require('../middleware/auth');

// ─── Get Notifications ───────────────────────────────────
router.get('/', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 20, unread } = req.query;
        const filter = { user: req.user._id };
        if (unread === 'true') filter.isRead = false;

        const notifications = await Notification.find(filter)
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

        res.json({
            success: true,
            data: {
                notifications,
                unreadCount,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Mark as Read ────────────────────────────────────────
// ─── Mark All as Read ────────────────────────────────────
router.put('/read-all', authenticate, async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true }
        );
        res.json({ success: true, message: 'All notifications marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mark individual notification as read
router.put('/:id/read', authenticate, async (req, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },
            { isRead: true }
        );
        res.json({ success: true, message: 'Notification marked as read.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
