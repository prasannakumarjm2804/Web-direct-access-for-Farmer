import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiPlus, FiTrendingUp, FiPackage, FiDollarSign, FiList, FiStar, FiCloud, FiInfo, FiUsers, FiCreditCard } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import PriceForecastWidget from '../components/ai/PriceForecastWidget';
import './DashboardPages.css';

const FarmerDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/farmers/dashboard');
                setStats(data.data);
            } catch (err) {
                console.error('Dashboard error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const dashStats = [
        { icon: <GiWheat />, label: 'Active Crops', value: stats?.activeCrops || 0, color: 'gradient-green', bg: '#dcfce7' },
        { icon: <FiPackage />, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'gradient-blue', bg: '#dbeafe' },
        { icon: <FiTrendingUp />, label: 'Completed', value: stats?.completedOrders || 0, color: 'gradient-purple', bg: '#ede9fe' },
        { icon: <FiDollarSign />, label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, color: 'gradient-amber', bg: '#fef3c7' },
    ];

    const quickActions = [
        { icon: <FiPlus />, label: 'List New Crop', link: '/farmer/add-crop', color: 'var(--primary)' },
        { icon: <FiPackage />, label: 'View Orders', link: '/orders', color: 'var(--info)' },
        { icon: <FiList />, label: 'My Listings', link: '/marketplace', color: 'var(--accent)' },
        { icon: <FiCreditCard />, label: 'Loans', link: '/loans', color: '#8b5cf6' },
        { icon: <FiUsers />, label: 'Community', link: '/community', color: '#f59e0b' },
        { icon: <FiStar />, label: 'My Profile', link: '/profile', color: 'var(--error)' },
    ];

    const weatherAlerts = [
        { type: '🌤️', msg: 'Sunny weather expected in your area for the next 3 days', severity: 'info' },
        { type: '🌧️', msg: 'Light rain forecast next week - plan harvest accordingly', severity: 'warning' },
    ];

    const schemes = [
        { name: 'PM-KISAN', desc: '₹6,000/year income support. Apply before March 30.', url: '#' },
        { name: 'Soil Health Card', desc: 'Free soil testing for your farm. Register now.', url: '#' },
        { name: 'Kisan Credit Card', desc: 'Low interest crop loan up to ₹3 lakhs.', url: '#' },
    ];

    if (loading) {
        return <div className="loading-page"><div className="spinner" /><p>Loading dashboard...</p></div>;
    }

    return (
        <div className="dashboard-page page-wrapper">
            <div className="container">
                {/* Welcome */}
                <div className="dash-welcome">
                    <div>
                        <h1>🌾 Welcome, {user?.name?.split(' ')[0]}!</h1>
                        <p>Here's your farm business overview</p>
                    </div>
                    <Link to="/farmer/add-crop" className="btn btn-primary">
                        <FiPlus /> List New Crop
                    </Link>
                </div>

                {/* Stats */}
                <div className="dash-stats-grid">
                    {dashStats.map((s, i) => (
                        <motion.div
                            key={i}
                            className="stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`stat-icon ${s.color}`} style={{ color: 'white' }}>
                                {s.icon}
                            </div>
                            <div className="stat-info">
                                <h3>{s.value}</h3>
                                <p>{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <PriceForecastWidget />

                {/* Quick Actions */}
                <div className="dash-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        {quickActions.map((a, i) => (
                            <Link key={i} to={a.link} className="quick-action-card card">
                                <div className="qa-icon" style={{ color: a.color, background: `${a.color}15` }}>
                                    {a.icon}
                                </div>
                                <span>{a.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="dash-two-col">
                    {/* Weather Alerts */}
                    <div className="dash-section">
                        <h2><FiCloud /> Weather Alerts</h2>
                        <div className="alerts-list">
                            {weatherAlerts.map((a, i) => (
                                <div key={i} className={`alert-item alert-${a.severity}`}>
                                    <span className="alert-emoji">{a.type}</span>
                                    <p>{a.msg}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Government Schemes */}
                    <div className="dash-section">
                        <h2><FiInfo /> Government Schemes</h2>
                        <div className="schemes-list">
                            {schemes.map((s, i) => (
                                <div key={i} className="scheme-item card">
                                    <h4>{s.name}</h4>
                                    <p>{s.desc}</p>
                                    <a href={s.url} className="btn btn-sm btn-outline">Learn More</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerDashboard;
