const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const disputeController = require('../controllers/dispute.controller');

router.post('/', authenticate, disputeController.createDispute);
router.get('/', authenticate, disputeController.getDisputes);
router.put('/:id/resolve', authenticate, authorize('admin'), disputeController.resolveDispute);

module.exports = router;
