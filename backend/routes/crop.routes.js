const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');

// ─── Create Crop Listing ─────────────────────────────────
router.post('/', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const cropData = {
            ...req.body,
            farmer: req.user._id,
            location: req.body.location || req.user.location,
        };

        // Simple AI price suggestion (based on category averages)
        const categoryPrices = {
            grains: { min: 20, max: 45 },
            pulses: { min: 60, max: 120 },
            vegetables: { min: 15, max: 80 },
            fruits: { min: 30, max: 150 },
            spices: { min: 100, max: 800 },
            oilseeds: { min: 50, max: 120 },
        };

        const priceRange = categoryPrices[cropData.category] || { min: 20, max: 100 };
        cropData.aiSuggestedPrice = {
            price: Math.round((priceRange.min + priceRange.max) / 2),
            confidence: 0.75,
            lastUpdated: new Date(),
        };

        const crop = await Crop.create(cropData);

        res.status(201).json({
            success: true,
            message: 'Crop listing created successfully.',
            data: crop,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Upload Crop Images ──────────────────────────────────
router.post('/:id/images', authenticate, authorize('farmer'), upload.array('images', 5), async (req, res) => {
    try {
        const crop = await Crop.findOne({ _id: req.params.id, farmer: req.user._id });
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found.' });
        }

        const images = req.files.map(file => ({
            url: `/uploads/${file.filename}`,
            caption: '',
        }));

        crop.images.push(...images);
        await crop.save();

        res.json({ success: true, message: 'Images uploaded.', data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get All Crops (Public) ──────────────────────────────
router.get('/', optionalAuth, async (req, res) => {
    try {
        const {
            category, state, district, minPrice, maxPrice,
            quality, organic, search, sort = '-createdAt',
            page = 1, limit = 12,
        } = req.query;

        const filter = { status: 'active' };

        if (category) filter.category = category;
        if (state) filter['location.state'] = state;
        if (district) filter['location.district'] = district;
        if (quality) filter.qualityGrade = quality;
        if (organic === 'true') filter.isOrganic = true;

        if (minPrice || maxPrice) {
            filter['price.expected'] = {};
            if (minPrice) filter['price.expected'].$gte = parseFloat(minPrice);
            if (maxPrice) filter['price.expected'].$lte = parseFloat(maxPrice);
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const crops = await Crop.find(filter)
            .populate('farmer', 'name phone location rating avatar')
            .sort(sort)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const total = await Crop.countDocuments(filter);

        res.json({
            success: true,
            data: {
                crops,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get Single Crop ─────────────────────────────────────
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const crop = await Crop.findById(req.params.id)
            .populate('farmer', 'name phone location rating avatar farmerProfile');

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found.' });
        }

        // Increment views
        crop.views += 1;
        await crop.save();

        res.json({ success: true, data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Crop ─────────────────────────────────────────
router.put('/:id', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const crop = await Crop.findOneAndUpdate(
            { _id: req.params.id, farmer: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found.' });
        }

        res.json({ success: true, message: 'Crop updated.', data: crop });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Delete Crop ─────────────────────────────────────────
router.delete('/:id', authenticate, authorize('farmer', 'admin'), async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        if (req.user.role === 'farmer') filter.farmer = req.user._id;

        const crop = await Crop.findOneAndDelete(filter);
        if (!crop) {
            return res.status(404).json({ success: false, message: 'Crop not found.' });
        }

        res.json({ success: true, message: 'Crop listing deleted.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Get My Crops (Farmer) ───────────────────────────────
router.get('/my/listings', authenticate, authorize('farmer'), async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = { farmer: req.user._id };
        if (status) filter.status = status;

        const crops = await Crop.find(filter)
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Crop.countDocuments(filter);

        res.json({
            success: true,
            data: {
                crops,
                pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
