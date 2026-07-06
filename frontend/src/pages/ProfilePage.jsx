import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { FiUser, FiPhone, FiMapPin, FiSave, FiShield, FiStar, FiCalendar } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import FarmerProfileStats from '../components/profile/FarmerProfileStats';
import toast from 'react-hot-toast';
import './ProfilePage.css';

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { user, loading } = useSelector(state => state.auth);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        location: {
            state: user?.location?.state || '',
            district: user?.location?.district || '',
        },
    });

    const handleSave = async (e) => {
        e.preventDefault();
        const result = await dispatch(updateProfile(form));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Profile updated!');
        } else {
            toast.error('Update failed');
        }
    };

    return (
        <div className="profile-page page-wrapper">
            <div className="container">
                <PageHeader
                    badge="Account"
                    title="My Profile"
                    subtitle="Manage your personal information and account settings"
                />

                <div className="profile-layout">
                    {/* Left - Info Card */}
                    <div className="profile-sidebar">
                        <div className="profile-header-card card">
                            <div className="profile-avatar-lg">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2>{user?.name}</h2>
                            <span className="profile-role-badge">{user?.role}</span>
                            <div className="profile-stats-row">
                                <div>
                                    <FiCalendar />
                                    <span>Joined {new Date(user?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}</span>
                                </div>
                                {user?.rating?.average > 0 && (
                                    <div>
                                        <FiStar style={{ color: 'var(--accent)' }} />
                                        <span>{user.rating.average} ({user.rating.count} reviews)</span>
                                    </div>
                                )}
                            </div>
                            <div className="profile-details-list">
                                <div className="pd-item">
                                    <FiPhone />
                                    <span>{user?.phone}</span>
                                </div>
                                <div className="pd-item">
                                    <FiMapPin />
                                    <span>{user?.location?.district}, {user?.location?.state}</span>
                                </div>
                                {user?.isVerified && (
                                    <div className="pd-item verified">
                                        <FiShield />
                                        <span>Verified Account</span>
                                    </div>
                                )}
                            </div>

                            {user?.role === 'farmer' && user?.farmerProfile && (
                                <div className="farmer-profile-info">
                                    <h3>Farm Details</h3>
                                    <div className="fpi-grid">
                                        {user.farmerProfile.farmSize && (
                                            <div><span>Farm Size</span><strong>{user.farmerProfile.farmSize}</strong></div>
                                        )}
                                        {user.farmerProfile.experience && (
                                            <div><span>Experience</span><strong>{user.farmerProfile.experience} years</strong></div>
                                        )}
                                        {user.farmerProfile.farmingType && (
                                            <div><span>Type</span><strong className="capitalize">{user.farmerProfile.farmingType}</strong></div>
                                        )}
                                        {user.farmerProfile.crops?.length > 0 && (
                                            <div><span>Main Crops</span><strong>{user.farmerProfile.crops.join(', ')}</strong></div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Edit Form */}
                    <div className="profile-form-section">
                        <div className="card">
                            <h2 style={{ marginBottom: '24px' }}>✏️ Edit Profile</h2>
                            <form onSubmit={handleSave}>
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <div className="input-with-icon">
                                        <FiUser className="input-icon" />
                                        <input type="text" className="form-input" value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email (optional)</label>
                                    <input type="email" className="form-input" placeholder="your@email.com"
                                        value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">State</label>
                                        <input type="text" className="form-input" value={form.location.state}
                                            onChange={(e) => setForm({ ...form, location: { ...form.location, state: e.target.value } })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">District</label>
                                        <input type="text" className="form-input" value={form.location.district}
                                            onChange={(e) => setForm({ ...form, location: { ...form.location, district: e.target.value } })} />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </div>

                        <div className="card" style={{ marginTop: '24px' }}>
                            <h2 style={{ marginBottom: '16px' }}>🔐 Account Security</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px' }}>
                                Your phone number is used for authentication. Enable 2-factor authentication for extra security.
                            </p>
                            <div className="security-item">
                                <div>
                                    <strong>Phone Verified</strong>
                                    <p>{user?.phone}</p>
                                </div>
                                <span className="badge badge-success"><FiShield /> Verified</span>
                            </div>
                        </div>
                    </div>
                </div>

                {user?.role === 'farmer' && (
                    <div className="profile-stats-section">
                        <FarmerProfileStats farmer={user} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
