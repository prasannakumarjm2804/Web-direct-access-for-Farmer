import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, sendOTP, verifyOTP, clearError } from '../store/slices/authSlice';
import { FiPhone, FiLock, FiArrowRight, FiSmartphone } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import toast from 'react-hot-toast';
import './AuthPages.css';

const LoginPage = () => {
    const [mode, setMode] = useState('password'); // password | otp
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, otpSent } = useSelector((state) => state.auth);

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({ phone, password }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Welcome back! 🌾');
            const role = result.payload.user.role;
            navigate(role === 'farmer' ? '/farmer/dashboard' : role === 'buyer' ? '/buyer/dashboard' : role === 'admin' ? '/admin/dashboard' : '/');
        } else {
            toast.error(result.payload || 'Login failed');
        }
    };

    const handleSendOTP = async () => {
        if (!phone || phone.length !== 10) {
            toast.error('Enter a valid 10-digit phone number');
            return;
        }
        const result = await dispatch(sendOTP(phone));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('OTP sent! Check your phone.');
            if (result.payload?.data?.otp) {
                toast(`Dev OTP: ${result.payload.data.otp}`, { icon: '🔑', duration: 10000 });
            }
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        const result = await dispatch(verifyOTP({ phone, otp }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Login successful! 🌾');
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left">
                    <div className="auth-left-content">
                        <div className="auth-brand">
                            <div className="logo-icon"><GiWheat /></div>
                            <span className="logo-name">AgriConnect</span>
                        </div>
                        <h1>Welcome Back,<br />Farmer!</h1>
                        <p>Continue your journey towards fair pricing and direct market access.</p>
                        <div className="auth-features-list">
                            {['Direct buyer connections', 'Secure escrow payments', 'Real-time price updates', 'Pan India logistics'].map((f, i) => (
                                <div key={i} className="auth-feature">
                                    <FiArrowRight /> {f}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <h2>Log In to Your Account</h2>
                        <p className="auth-subtitle">Enter your phone number and password</p>

                        {/* Mode Toggle */}
                        <div className="auth-mode-toggle">
                            <button
                                className={`mode-btn ${mode === 'password' ? 'active' : ''}`}
                                onClick={() => setMode('password')}
                            >
                                <FiLock /> Password
                            </button>
                            <button
                                className={`mode-btn ${mode === 'otp' ? 'active' : ''}`}
                                onClick={() => setMode('otp')}
                            >
                                <FiSmartphone /> OTP
                            </button>
                        </div>

                        {mode === 'password' ? (
                            <form onSubmit={handlePasswordLogin}>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-with-icon">
                                        <FiPhone className="input-icon" />
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="Enter 10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            maxLength={10}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-with-icon">
                                        <FiLock className="input-icon" />
                                        <input
                                            type="password"
                                            className="form-input"
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {error && <p className="auth-error">{error}</p>}

                                <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Log In'} <FiArrowRight />
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleOTPLogin}>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-with-icon">
                                        <FiPhone className="input-icon" />
                                        <input
                                            type="tel"
                                            className="form-input"
                                            placeholder="Enter 10-digit mobile number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            maxLength={10}
                                            required
                                        />
                                    </div>
                                </div>

                                {otpSent && (
                                    <div className="form-group">
                                        <label className="form-label">Enter OTP</label>
                                        <div className="otp-input-group">
                                            <input
                                                type="text"
                                                className="form-input"
                                                placeholder="6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                maxLength={6}
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {error && <p className="auth-error">{error}</p>}

                                {!otpSent ? (
                                    <button type="button" className="btn btn-primary btn-lg auth-submit" onClick={handleSendOTP} disabled={loading}>
                                        {loading ? 'Sending...' : 'Send OTP'} <FiSmartphone />
                                    </button>
                                ) : (
                                    <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                                        {loading ? 'Verifying...' : 'Verify & Login'} <FiArrowRight />
                                    </button>
                                )}
                            </form>
                        )}

                        <p className="auth-switch">
                            Don't have an account? <Link to="/register">Register Now</Link>
                        </p>

                        <div className="auth-demo-creds">
                            <p><strong>Demo Credentials:</strong></p>
                            <p>Farmer: 9876543210 / password123</p>
                            <p>Buyer: 9988776655 / password123</p>
                            <p>Admin: 9999999999 / password123</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
