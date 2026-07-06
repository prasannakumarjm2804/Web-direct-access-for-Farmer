import React from 'react';
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers, FiClock, FiCheckCircle, FiArrowUpRight, FiArrowDownRight } from 'react-icons/fi';
import { motion } from 'framer-motion';
import './DashboardWidgets.css';

const StatCard = ({ title, value, change, icon, color, trend }) => {
    const isPositive = trend === 'up';
    
    return (
        <motion.div 
            className="dashboard-stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="stat-icon-wrapper" style={{ background: `${color}15`, color }}>
                {icon}
            </div>
            <div className="stat-content">
                <span className="stat-title">{title}</span>
                <span className="stat-value">{value}</span>
                <div className="stat-change">
                    {isPositive ? <FiArrowUpRight /> : <FiArrowDownRight />}
                    <span className={isPositive ? 'positive' : 'negative'}>{change}</span>
                    <span className="stat-period">vs last month</span>
                </div>
            </div>
        </motion.div>
    );
};

const ActivityItem = ({ icon, title, description, time, color }) => (
    <div className="activity-item">
        <div className="activity-icon" style={{ background: `${color}15`, color }}>
            {icon}
        </div>
        <div className="activity-content">
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
        <span className="activity-time">{time}</span>
    </div>
);

const DashboardWidgets = () => {
    const stats = [
        {
            title: 'Total Revenue',
            value: '₹2,45,000',
            change: '+23.5%',
            icon: <FiDollarSign />,
            color: '#16a34a',
            trend: 'up'
        },
        {
            title: 'Active Orders',
            value: '24',
            change: '+12%',
            icon: <FiPackage />,
            color: '#3b82f6',
            trend: 'up'
        },
        {
            title: 'Total Sales',
            value: '156',
            change: '+18.2%',
            icon: <FiTrendingUp />,
            color: '#f59e0b',
            trend: 'up'
        },
        {
            title: 'New Buyers',
            value: '32',
            change: '-5.4%',
            icon: <FiUsers />,
            color: '#ef4444',
            trend: 'down'
        }
    ];

    const recentActivities = [
        {
            icon: <FiPackage />,
            title: 'New Order Received',
            description: 'Order #12345 - 500kg Wheat',
            time: '2 min ago',
            color: '#16a34a'
        },
        {
            icon: <FiDollarSign />,
            title: 'Payment Received',
            description: '₹25,000 from Rajesh Kumar',
            time: '15 min ago',
            color: '#3b82f6'
        },
        {
            icon: <FiCheckCircle />,
            title: 'Order Completed',
            description: 'Order #12344 delivered successfully',
            time: '1 hour ago',
            color: '#10b981'
        },
        {
            icon: <FiClock />,
            title: 'Pending Approval',
            description: 'Buyer verification request',
            time: '3 hours ago',
            color: '#f59e0b'
        }
    ];

    const quickActions = [
        { icon: <FiPackage />, label: 'Add Crop', color: '#16a34a' },
        { icon: <FiDollarSign />, label: 'View Orders', color: '#3b82f6' },
        { icon: <FiUsers />, label: 'Buyers', color: '#f59e0b' },
        { icon: <FiTrendingUp />, label: 'Analytics', color: '#8b5cf6' }
    ];

    return (
        <div className="dashboard-widgets">
            {/* Stats Grid */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Recent Activity */}
                <div className="dashboard-card activity-card">
                    <div className="card-header">
                        <h3>Recent Activity</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="activity-list">
                        {recentActivities.map((activity, index) => (
                            <ActivityItem key={index} {...activity} />
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="dashboard-card quick-actions-card">
                    <div className="card-header">
                        <h3>Quick Actions</h3>
                    </div>
                    <div className="quick-actions-grid">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                className="quick-action-btn"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ '--action-color': action.color }}
                            >
                                <span className="action-icon" style={{ color: action.color }}>
                                    {action.icon}
                                </span>
                                <span className="action-label">{action.label}</span>
                            </motion.button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardWidgets;
