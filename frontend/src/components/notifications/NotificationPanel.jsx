import React, { useState, useEffect } from 'react';
import { FiBell, FiX, FiCheck, FiShoppingBag, FiDollarSign, FiTruck, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationPanel.css';

const NotificationPanel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'order',
            title: 'New Order Received',
            message: 'Rajesh Kumar placed an order for 500kg Wheat',
            time: '2 minutes ago',
            read: false,
            icon: <FiShoppingBag />
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Received',
            message: '₹25,000 received for order #12345',
            time: '15 minutes ago',
            read: false,
            icon: <FiDollarSign />
        },
        {
            id: 3,
            type: 'shipping',
            title: 'Shipment Dispatched',
            message: 'Your order #12344 has been dispatched',
            time: '1 hour ago',
            read: true,
            icon: <FiTruck />
        },
        {
            id: 4,
            type: 'message',
            title: 'New Message',
            message: 'Priya Sharma sent you a message',
            time: '3 hours ago',
            read: true,
            icon: <FiMessageSquare />
        },
        {
            id: 5,
            type: 'alert',
            title: 'Price Alert',
            message: 'Wheat prices increased by 5% in your region',
            time: '5 hours ago',
            read: true,
            icon: <FiAlertCircle />
        }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'order': return 'var(--primary)';
            case 'payment': return 'var(--success)';
            case 'shipping': return 'var(--info)';
            case 'message': return 'var(--accent)';
            case 'alert': return 'var(--error)';
            default: return 'var(--text-secondary)';
        }
    };

    const getNotificationBg = (type) => {
        switch (type) {
            case 'order': return 'var(--primary-50)';
            case 'payment': return '#d1fae5';
            case 'shipping': return '#dbeafe';
            case 'message': return 'var(--accent-50)';
            case 'alert': return '#fee2e2';
            default: return 'var(--bg-secondary)';
        }
    };

    return (
        <div className="notification-panel">
            <button
                className="notification-trigger"
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
            >
                <FiBell />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="notification-dropdown"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="notification-header">
                            <h3>Notifications</h3>
                            {unreadCount > 0 && (
                                <button 
                                    className="mark-all-read"
                                    onClick={markAllAsRead}
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="notification-list">
                            {notifications.length === 0 ? (
                                <div className="no-notifications">
                                    <FiBell />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map(notification => (
                                    <motion.div
                                        key={notification.id}
                                        className={`notification-item ${!notification.read ? 'unread' : ''}`}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: notification.id * 0.05 }}
                                    >
                                        <div 
                                            className="notification-icon"
                                            style={{ 
                                                background: getNotificationBg(notification.type),
                                                color: getNotificationColor(notification.type)
                                            }}
                                        >
                                            {notification.icon}
                                        </div>
                                        <div className="notification-content">
                                            <div className="notification-title-row">
                                                <h4>{notification.title}</h4>
                                                <span className="notification-time">{notification.time}</span>
                                            </div>
                                            <p className="notification-message">{notification.message}</p>
                                        </div>
                                        <div className="notification-actions">
                                            {!notification.read && (
                                                <button
                                                    className="action-btn"
                                                    onClick={() => markAsRead(notification.id)}
                                                    title="Mark as read"
                                                >
                                                    <FiCheck />
                                                </button>
                                            )}
                                            <button
                                                className="action-btn delete"
                                                onClick={() => deleteNotification(notification.id)}
                                                title="Delete"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="notification-footer">
                                <button className="view-all-btn">View All Notifications</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationPanel;
