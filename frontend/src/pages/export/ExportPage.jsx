import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiGlobe, FiPlus, FiPackage, FiTrendingUp, FiShield } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import api from '../../services/api';
import './ExportPage.css';

const ExportPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const res = await api.get('/exports');
                setListings(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchListings();
    }, []);

    const exportStats = [
        { icon: <FiPackage />, label: 'Total Exports', value: '120 Tons', color: 'gradient-green' },
        { icon: <FiTrendingUp />, label: 'Active Orders', value: '5', color: 'gradient-blue' },
        { icon: <FiShield />, label: 'Compliance Score', value: '98%', color: 'gradient-purple' },
    ];

    return (
        <div className="export-page page-wrapper">
            <div className="container">
                <PageHeader
                    variant="accent"
                    badge="Global Trade"
                    title="Export Hub"
                    subtitle="Connect with international buyers and expand your market reach beyond India."
                    icon={<FiGlobe />}
                >
                    <button type="button" className="btn btn-secondary" style={{ background: 'white', color: '#1e3a8a' }}>
                        <FiPlus /> New Listing
                    </button>
                </PageHeader>

                <div className="export-stats-grid">
                    {exportStats.map((stat, i) => (
                        <motion.div
                            key={i}
                            className="stat-card export-stat-card"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className={`stat-icon ${stat.color}`} style={{ color: 'white' }}>{stat.icon}</div>
                            <div className="stat-info">
                                <h3>{stat.value}</h3>
                                <p>{stat.label}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="export-listings-section dash-section">
                    <h2>Your Export Listings</h2>
                    {loading ? (
                        <div className="listings-grid">
                            <SkeletonLoader type="card" count={3} />
                        </div>
                    ) : listings.length > 0 ? (
                        <div className="listings-grid">
                            {listings.map((item, i) => (
                                <motion.div
                                    key={item._id}
                                    className="listing-card card"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <div className="listing-icon"><FiPackage /></div>
                                    <div className="listing-details">
                                        <h4>{item.crop?.name || 'Unknown Crop'}</h4>
                                        <p>{item.quantityAvailable?.value} {item.quantityAvailable?.unit}</p>
                                        <span className="destination-tag">
                                            <FiGlobe /> {item.destinationCountries?.join(', ') || 'Global'}
                                        </span>
                                    </div>
                                    <span className={`badge badge-${item.complianceStatus === 'verified' ? 'success' : 'warning'}`}>
                                        {item.complianceStatus}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">🚢</div>
                            <h3>No export listings yet</h3>
                            <p>Start exporting your produce to international markets today!</p>
                            <button type="button" className="btn btn-primary">
                                <FiPlus /> Create First Listing
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportPage;
