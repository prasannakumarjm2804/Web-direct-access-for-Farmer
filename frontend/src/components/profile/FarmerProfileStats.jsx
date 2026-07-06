import React from 'react';
import { FiAward, FiStar, FiTrendingUp, FiUsers, FiCheckCircle, FiMapPin, FiCalendar, FiPhone, FiMail, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './FarmerProfileStats.css';

const FarmerProfileStats = ({ farmer }) => {
    const stats = [
        { label: 'Total Sales', value: '₹4,52,000', icon: <FiTrendingUp />, color: '#16a34a', trend: '+23%' },
        { label: 'Crops Listed', value: '24', icon: <FiAward />, color: '#3b82f6', trend: '+5' },
        { label: 'Successful Orders', value: '156', icon: <FiCheckCircle />, color: '#10b981', trend: '+18' },
        { label: 'Buyer Rating', value: '4.8', icon: <FiStar />, color: '#f59e0b', trend: '+0.2' }
    ];

    const achievements = [
        { icon: '🏆', title: 'Top Seller', description: 'Top 10% sellers this month', unlocked: true },
        { icon: '⭐', title: '5-Star Rating', description: 'Maintained 5-star rating for 30 days', unlocked: true },
        { icon: '🌾', title: 'Crop Master', description: 'Listed 20+ different crops', unlocked: true },
        { icon: '🚀', title: 'Fast Shipper', description: '100+ on-time deliveries', unlocked: false },
        { icon: '💯', title: 'Perfect Score', description: '100% order completion rate', unlocked: false }
    ];

    const recentActivity = [
        { type: 'sale', title: 'Sold 500kg Wheat', amount: '₹16,000', time: '2 hours ago' },
        { type: 'listing', title: 'Listed Rice (Basmati)', amount: '₹85/kg', time: '1 day ago' },
        { type: 'review', title: 'Received 5-star review', amount: 'From Priya Sharma', time: '2 days ago' },
        { type: 'order', title: 'New order received', amount: '200kg Maize', time: '3 days ago' }
    ];

    const getActivityColor = (type) => {
        switch (type) {
            case 'sale': return '#16a34a';
            case 'listing': return '#3b82f6';
            case 'review': return '#f59e0b';
            case 'order': return '#8b5cf6';
            default: return '#6b7280';
        }
    };

    return (
        <div className="farmer-profile-stats">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        {farmer?.name?.charAt(0) || 'F'}
                    </div>
                    <div className="profile-verified">
                        <FiShield />
                        <span>Verified Farmer</span>
                    </div>
                </div>
                <div className="profile-info">
                    <h2>{farmer?.name || 'Farmer Name'}</h2>
                    <div className="profile-meta">
                        <span><FiMapPin /> {farmer?.location || 'Punjab, India'}</span>
                        <span><FiCalendar /> Member since {farmer?.joinedDate || 'Jan 2024'}</span>
                    </div>
                    <div className="profile-contact">
                        <span><FiPhone /> {farmer?.phone || '+91 98765 43210'}</span>
                        <span><FiMail /> {farmer?.email || 'farmer@example.com'}</span>
                    </div>
                </div>
                <div className="profile-rating">
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                            <FiStar key={star} className="star-filled" />
                        ))}
                    </div>
                    <span className="rating-value">4.8</span>
                    <span className="rating-count">(156 reviews)</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        className="stat-card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-trend" style={{ color: stat.color }}>
                                {stat.trend}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="profile-grid">
                {/* Achievements */}
                <div className="achievements-section card">
                    <h3>Achievements</h3>
                    <div className="achievements-grid">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-info">
                                    <h4>{achievement.title}</h4>
                                    <p>{achievement.description}</p>
                                </div>
                                {achievement.unlocked && (
                                    <div className="achievement-badge">
                                        <FiCheckCircle />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="activity-section card">
                    <h3>Recent Activity</h3>
                    <div className="activity-timeline">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div
                                    className="activity-dot"
                                    style={{ background: getActivityColor(activity.type) }}
                                />
                                <div className="activity-content">
                                    <h4>{activity.title}</h4>
                                    <p>{activity.amount}</p>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Chart Placeholder */}
            <div className="performance-section card">
                <h3>Performance Overview</h3>
                <div className="performance-chart-placeholder">
                    <div className="chart-bars">
                        {[65, 80, 72, 90, 85, 95].map((height, index) => (
                            <div
                                key={index}
                                className="chart-bar"
                                style={{ height: `${height}%` }}
                            >
                                <span className="bar-label">{['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfileStats;
