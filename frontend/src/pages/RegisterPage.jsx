import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../store/slices/authSlice';
import { FiPhone, FiLock, FiUser, FiArrowRight, FiMapPin } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import toast from 'react-hot-toast';
import './AuthPages.css';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '', phone: '', password: '', confirmPassword: '',
        role: 'farmer', state: '', district: '', language: 'en',
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        if (formData.phone.length !== 10) {
            toast.error('Enter a valid 10-digit phone number');
            return;
        }

        const result = await dispatch(registerUser({
            name: formData.name,
            phone: formData.phone,
            password: formData.password,
            role: formData.role,
            location: { state: formData.state, district: formData.district },
            language: formData.language,
        }));

        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Registration successful! 🎉');
            const role = result.payload.user.role;
            navigate(role === 'farmer' ? '/farmer/dashboard' : role === 'buyer' ? '/buyer/dashboard' : '/');
        } else {
            toast.error(result.payload || 'Registration failed');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-left register-left">
                    <div className="auth-left-content">
                        <div className="auth-brand">
                            <div className="logo-icon"><GiWheat /></div>
                            <span className="logo-name">AgriConnect</span>
                        </div>
                        <h1>Join India's<br />Farmer-First<br />Marketplace</h1>
                        <p>Register today and start selling your produce directly to buyers across India. No middlemen, no unfair cuts.</p>
                        <div className="auth-stats-row">
                            <div className="auth-stat">
                                <h3>50K+</h3>
                                <p>Farmers</p>
                            </div>
                            <div className="auth-stat">
                                <h3>28</h3>
                                <p>States</p>
                            </div>
                            <div className="auth-stat">
                                <h3>₹120Cr</h3>
                                <p>Trade</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="auth-right">
                    <div className="auth-form-wrapper">
                        <h2>Create Your Account</h2>
                        <p className="auth-subtitle">Fill in the details to get started</p>

                        <form onSubmit={handleSubmit}>
                            {/* Role Selection */}
                            <div className="role-selector">
                                {[
                                    { value: 'farmer', label: '🌾 Farmer', desc: 'Sell your crops' },
                                    { value: 'buyer', label: '🏪 Buyer', desc: 'Buy from farmers' },
                                ].map((r) => (
                                    <label key={r.value} className={`role-option ${formData.role === r.value ? 'active' : ''}`}>
                                        <input
                                            type="radio"
                                            name="role"
                                            value={r.value}
                                            checked={formData.role === r.value}
                                            onChange={handleChange}
                                        />
                                        <span className="role-label">{r.label}</span>
                                        <span className="role-desc">{r.desc}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-with-icon">
                                        <FiUser className="input-icon" />
                                        <input type="text" className="form-input" name="name" placeholder="Enter your name"
                                            value={formData.name} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div className="input-with-icon">
                                        <FiPhone className="input-icon" />
                                        <input type="tel" className="form-input" name="phone" placeholder="10-digit mobile"
                                            value={formData.phone} onChange={handleChange} maxLength={10} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Password</label>
                                    <div className="input-with-icon">
                                        <FiLock className="input-icon" />
                                        <input type="password" className="form-input" name="password" placeholder="Min 6 characters"
                                            value={formData.password} onChange={handleChange} required minLength={6} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <div className="input-with-icon">
                                        <FiLock className="input-icon" />
                                        <input type="password" className="form-input" name="confirmPassword" placeholder="Confirm password"
                                            value={formData.confirmPassword} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">State</label>
                                    <select className="form-select" name="state" value={formData.state} onChange={handleChange} required>
                                        <option value="">Select State</option>
                                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">District</label>
                                    <div className="input-with-icon">
                                        <FiMapPin className="input-icon" />
                                        <input type="text" className="form-input" name="district" placeholder="Enter district"
                                            value={formData.district} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Preferred Language</label>
                                <select className="form-select" name="language" value={formData.language} onChange={handleChange}>
                                    <option value="en">English</option>
                                    <option value="hi">हिन्दी (Hindi)</option>
                                    <option value="ta">தமிழ் (Tamil)</option>
                                    <option value="te">తెలుగు (Telugu)</option>
                                    <option value="kn">ಕನ್ನಡ (Kannada)</option>
                                    <option value="mr">मराठी (Marathi)</option>
                                    <option value="bn">বাংলা (Bengali)</option>
                                    <option value="gu">ગુજરાતી (Gujarati)</option>
                                    <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                                    <option value="ml">മലയാളം (Malayalam)</option>
                                </select>
                            </div>

                            {error && <p className="auth-error">{error}</p>}

                            <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'} <FiArrowRight />
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
