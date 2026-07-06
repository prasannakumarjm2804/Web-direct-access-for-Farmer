import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { FiPlus, FiX, FiPackage, FiDollarSign, FiMessageSquare, FiBell, FiSettings, FiLogOut, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import './QuickActionsButton.css';

const QuickActionsButton = ({ userRole = 'farmer' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const go = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setIsOpen(false);
    };

    const farmerActions = [
        { icon: <FiPackage />, label: 'Add Crop', path: '/farmer/add-crop', color: '#16a34a' },
        { icon: <FiDollarSign />, label: 'View Orders', path: '/orders', color: '#3b82f6' },
        { icon: <FiSearch />, label: 'Marketplace', path: '/marketplace', color: '#f59e0b' },
        { icon: <FiBell />, label: 'Community', path: '/community', color: '#8b5cf6' },
    ];

    const buyerActions = [
        { icon: <FiSearch />, label: 'Browse Crops', path: '/marketplace', color: '#16a34a' },
        { icon: <FiDollarSign />, label: 'My Orders', path: '/orders', color: '#3b82f6' },
        { icon: <FiMessageSquare />, label: 'Community', path: '/community', color: '#f59e0b' },
        { icon: <FiBell />, label: 'Export Hub', path: '/export', color: '#8b5cf6' },
    ];

    const commonActions = [
        { icon: <FiSettings />, label: 'Profile', path: '/profile', color: '#6b7280' },
        { icon: <FiLogOut />, label: 'Logout', action: handleLogout, color: '#ef4444' },
    ];

    const roleActions = userRole === 'buyer' ? buyerActions : farmerActions;
    const allActions = [...roleActions, ...commonActions];

    return (
        <div className="quick-actions-container">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="quick-actions-menu"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {allActions.map((action, index) => (
                            <motion.button
                                key={index}
                                className="quick-action-item"
                                onClick={() => action.action ? action.action() : go(action.path)}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{ '--action-color': action.color }}
                            >
                                <span className="action-icon" style={{ color: action.color }}>
                                    {action.icon}
                                </span>
                                <span className="action-label">{action.label}</span>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                className={`quick-actions-toggle ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Quick actions"
            >
                {isOpen ? <FiX /> : <FiPlus />}
            </motion.button>
        </div>
    );
};

export default QuickActionsButton;
