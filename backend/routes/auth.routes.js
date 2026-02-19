const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/helpers');
const { authenticate } = require('../middleware/auth');

// ─── Register ─────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password, role, location, language } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Phone number already registered.' });
        }

        const user = await User.create({
            name, phone, password, role: role || 'farmer',
            location, language: language || 'en',
        });

        // Generate OTP (simulated - in production use SMS gateway)
        const otp = user.generateOTP();
        await user.save();

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.status(201).json({
            success: true,
            message: 'Registration successful. OTP sent for verification.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                token,
                refreshToken,
                otp: process.env.NODE_ENV === 'development' ? otp : undefined,
            },
        });
    } catch (error) {
        console.error('❌ Registration Error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.toString() : undefined,
        });
    }
});

// ─── Login ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { phone, password } = req.body;

        const user = await User.findOne({ phone }).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account deactivated.' });
        }

        // If password is set, verify it
        if (user.password) {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: 'Login successful.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    avatar: user.avatar,
                    isVerified: user.isVerified,
                    location: user.location,
                    language: user.language,
                },
                token,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── OTP Login ────────────────────────────────────────────
router.post('/otp/send', async (req, res) => {
    try {
        const { phone } = req.body;
        let user = await User.findOne({ phone });

        if (!user) {
            // Auto-register with OTP
            user = await User.create({ name: 'User', phone, role: 'farmer' });
        }

        const otp = user.generateOTP();
        await user.save();

        // In production, send OTP via SMS gateway
        res.json({
            success: true,
            message: 'OTP sent successfully.',
            data: {
                phone,
                otp: process.env.NODE_ENV === 'development' ? otp : undefined,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/otp/verify', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await User.findOne({ phone });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();

        res.json({
            success: true,
            message: 'OTP verified. Login successful.',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    phone: user.phone,
                    role: user.role,
                    isVerified: user.isVerified,
                },
                token,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Refresh Token ────────────────────────────────────────
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ success: false, message: 'Refresh token required.' });
        }

        const decoded = verifyRefreshToken(refreshToken);
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid refresh token.' });
        }

        const newToken = generateToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            success: true,
            data: { token: newToken, refreshToken: newRefreshToken },
        });
    } catch (error) {
        res.status(403).json({ success: false, message: 'Invalid refresh token.' });
    }
});

// ─── Get Profile ──────────────────────────────────────────
router.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Update Profile ───────────────────────────────────────
router.put('/profile', authenticate, async (req, res) => {
    try {
        const updates = req.body;
        // Prevent changing role or phone
        delete updates.role;
        delete updates.phone;
        delete updates.password;

        const user = await User.findByIdAndUpdate(req.user._id, updates, {
            new: true,
            runValidators: true,
        });

        res.json({ success: true, message: 'Profile updated.', data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Logout ───────────────────────────────────────────────
router.post('/logout', authenticate, async (req, res) => {
    try {
        if (req.user) {
            req.user.refreshToken = undefined;
            await req.user.save();
        }
        res.json({ success: true, message: 'Logged out successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
