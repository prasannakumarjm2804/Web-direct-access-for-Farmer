const aiService = require('../services/ai.service');
const Crop = require('../models/Crop');

/**
 * Predict Crop Price
 */
exports.predictPrice = async (req, res) => {
    try {
        const { cropName, variety, location } = req.body;

        if (!cropName || !location) {
            return res.status(400).json({ success: false, message: 'Crop name and location are required' });
        }

        const prediction = await aiService.predictPrice(cropName, variety, location);

        res.status(200).json({
            success: true,
            data: prediction
        });
    } catch (error) {
        console.error('Price Prediction Error:', error);
        res.status(500).json({ success: false, message: 'Failed to predict price' });
    }
};

/**
 * Verify Quality from Image
 */
exports.verifyQuality = async (req, res) => {
    try {
        const { imageUrl, cropId } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ success: false, message: 'Image URL is required' });
        }

        const verification = await aiService.verifyCropQuality(imageUrl);

        // formatting result
        const result = {
            verified: verification.verified,
            grade: verification.grade,
            verifiedBy: 'AI',
            date: new Date(),
            confidenceScore: verification.confidence,
            defects: verification.defects
        };

        if (cropId) {
            // Update crop if ID provided
            await Crop.findByIdAndUpdate(cropId, {
                qualityVerification: result
            });
        }

        res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Quality Verification Error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify quality' });
    }
};

/**
 * Smart Farmer Assistant Chat
 */
exports.askAssistant = async (req, res) => {
    try {
        const { query, language } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, message: 'Query is required' });
        }

        const response = await aiService.askAssistant(query, language);

        res.status(200).json({
            success: true,
            data: response
        });
    } catch (error) {
        console.error('Assistant Error:', error);
        res.status(500).json({ success: false, message: 'Assistant service unavailable' });
    }
};
