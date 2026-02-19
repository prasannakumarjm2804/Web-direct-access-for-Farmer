const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const loanController = require('../controllers/loan.controller');

router.post('/apply', authenticate, authorize('farmer'), loanController.applyForLoan);
router.get('/', authenticate, loanController.getLoans);

module.exports = router;
