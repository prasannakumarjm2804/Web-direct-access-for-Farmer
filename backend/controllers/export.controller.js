const ExportListing = require('../models/ExportListing'); // Check if this file exists from previous steps

exports.createListing = async (req, res) => {
    try {
        const data = req.body;
        data.exporter = req.user._id;

        const listing = new ExportListing(data);
        await listing.save();

        res.status(201).json({ success: true, data: listing });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getListings = async (req, res) => {
    try {
        const listings = await ExportListing.find({ exporter: req.user._id })
            .populate('crop');
        res.status(200).json({ success: true, data: listings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
