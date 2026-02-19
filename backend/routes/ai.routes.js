const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const aiController = require('../controllers/ai.controller');

router.post('/predict-price', authenticate, aiController.predictPrice);
router.post('/verify-quality', authenticate, aiController.verifyQuality);
router.post('/ask-assistant', authenticate, aiController.askAssistant);

module.exports = router;
