const Loan = require('../models/Loan');

exports.applyForLoan = async (req, res) => {
    try {
        const { amount, tenureMonths, purpose, providerName, providerType } = req.body;

        // Simple mock credit score calculation
        // In real app, fetch from credit bureau or calculate based on transaction history
        const creditScore = Math.floor(Math.random() * (850 - 300 + 1)) + 300;

        const loan = new Loan({
            farmer: req.user._id,
            amount,
            interestRate: 10.5, // Mock rate
            tenureMonths,
            purpose,
            provider: {
                name: providerName || 'AgriBank',
                type: providerType || 'bank'
            },
            creditScoreSnapshot: creditScore,
            status: 'applied'
        });

        await loan.save();
        res.status(201).json({ success: true, data: loan });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ farmer: req.user._id });
        res.status(200).json({ success: true, data: loans });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
