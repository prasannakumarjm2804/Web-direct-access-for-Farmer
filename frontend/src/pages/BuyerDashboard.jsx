import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiDollarSign, FiTrendingUp, FiShoppingCart, FiCheckCircle } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import './DashboardPages.css';

const BuyerDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const { data } = await api.get('/buyers/dashboard');
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
        { icon: <FiPackage />, label: 'Total Orders', value: stats?.totalOrders || 0, color: 'gradient-blue' },
        { icon: <FiShoppingCart />, label: 'Active Orders', value: stats?.activeOrders || 0, color: 'gradient-amber' },
        { icon: <FiCheckCircle />, label: 'Completed', value: stats?.completedOrders || 0, color: 'gradient-green' },
        { icon: <FiDollarSign />, label: 'Total Spent', value: `₹${(stats?.totalSpent || 0).toLocaleString('en-IN')}`, color: 'gradient-purple' },
    ];

    if (loading) {
        return <div className="loading-page"><div className="spinner" /><p>Loading dashboard...</p></div>;
    }

    return (
        <div className="dashboard-page page-wrapper">
            <div className="container">
                <PageHeader
                    badge="Buyer Dashboard"
                    title={`Welcome, ${user?.name?.split(' ')[0]}!`}
                    subtitle="Find the best produce directly from verified farmers across India."
                >
                    <Link to="/marketplace" className="btn btn-primary">
                        <FiSearch /> Browse Marketplace
                    </Link>
                </PageHeader>

                <div className="dash-stats-grid">
                    {dashStats.map((s, i) => (
                        <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                            <div className={`stat-icon ${s.color}`} style={{ color: 'white' }}>{s.icon}</div>
                            <div className="stat-info">
                                <h3>{s.value}</h3>
                                <p>{s.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="dash-section">
                    <h2>Quick Actions</h2>
                    <div className="quick-actions-grid">
                        <Link to="/marketplace" className="quick-action-card card">
                            <div className="qa-icon" style={{ color: 'var(--primary)', background: 'var(--primary-50)' }}><FiSearch /></div>
                            <span>Search Crops</span>
                        </Link>
                        <Link to="/orders" className="quick-action-card card">
                            <div className="qa-icon" style={{ color: 'var(--info)', background: '#dbeafe' }}><FiPackage /></div>
                            <span>My Orders</span>
                        </Link>
                        <Link to="/profile" className="quick-action-card card">
                            <div className="qa-icon" style={{ color: 'var(--accent)', background: 'var(--accent-50)' }}><FiTrendingUp /></div>
                            <span>KYC Verification</span>
                        </Link>
                    </div>
                </div>

                <div className="dash-section">
                    <h2>💡 Buyer Tips</h2>
                    <div className="tips-grid">
                        {[
                            { title: 'Negotiate Directly', desc: 'Chat with farmers and make offers. Better prices with no middlemen.' },
                            { title: 'Verify Quality', desc: 'Check quality grades and certifications before ordering.' },
                            { title: 'Escrow Protection', desc: 'Your payment is held safely until delivery is confirmed.' },
                            { title: 'Bulk Discounts', desc: 'Order in bulk and negotiate better rates with farmers.' },
                        ].map((tip, i) => (
                            <div key={i} className="tip-card card">
                                <h4>{tip.title}</h4>
                                <p>{tip.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyerDashboard;
