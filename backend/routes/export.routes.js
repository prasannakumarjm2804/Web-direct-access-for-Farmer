const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const exportController = require('../controllers/export.controller');

router.post('/', authenticate, authorize('farmer', 'exporter'), exportController.createListing);
router.get('/', authenticate, exportController.getListings);

module.exports = router;
