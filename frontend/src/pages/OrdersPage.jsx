import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFarmerOrders, fetchBuyerOrders, respondToOrder } from '../store/slices/orderSlice';
import { motion } from 'framer-motion';
import { FiPackage, FiCheck, FiX, FiClock, FiTruck, FiDollarSign } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './OrdersPage.css';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const { items: orders, loading } = useSelector(state => state.orders);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user?.role === 'farmer') {
            dispatch(fetchFarmerOrders());
        } else {
            dispatch(fetchBuyerOrders());
        }
    }, [dispatch, user]);

    const getStatusIcon = (status) => {
        const map = {
            pending: <FiClock />, accepted: <FiCheck />, rejected: <FiX />,
            in_transit: <FiTruck />, delivered: <FiPackage />, completed: <FiCheck />, cancelled: <FiX />,
        };
        return map[status] || <FiClock />;
    };

    const getStatusColor = (status) => {
        const map = {
            pending: 'badge-warning', accepted: 'badge-primary', rejected: 'badge-error',
            in_transit: 'badge-info', delivered: 'badge-success', completed: 'badge-success', cancelled: 'badge-error',
        };
        return map[status] || 'badge-primary';
    };

    const handleRespond = async (orderId, action, counterPrice = null) => {
        const result = await dispatch(respondToOrder({ orderId, action, counterPrice }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success(`Order ${action}ed!`);
            user?.role === 'farmer' ? dispatch(fetchFarmerOrders()) : dispatch(fetchBuyerOrders());
        } else {
            toast.error('Action failed');
        }
    };

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    return (
        <div className="orders-page page-wrapper">
            <div className="container">
                <div className="orders-header">
                    <div>
                        <h1><FiPackage /> My Orders</h1>
                        <p>{orders.length} total orders</p>
                    </div>
                </div>

                <div className="order-filters">
                    {['all', 'pending', 'accepted', 'in_transit', 'completed', 'cancelled'].map(f => (
                        <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                            {f === 'all' ? 'All' : f.replace('_', ' ')}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-page"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📦</div>
                        <h3>No orders found</h3>
                        <p>{filter === 'all' ? 'You haven\'t placed any orders yet' : `No ${filter.replace('_', ' ')} orders`}</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {filtered.map((order, i) => (
                            <motion.div
                                key={order._id}
                                className="order-card card"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className="order-top">
                                    <div className="order-id">
                                        <strong>{order.orderId}</strong>
                                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
                                    </div>
                                    <span className={`badge ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)} {order.status?.replace('_', ' ')}
                                    </span>
                                </div>

                                <div className="order-body">
                                    <div className="order-crop">
                                        <span className="crop-emoji">
                                            {order.crop?.category === 'grains' ? '🌾' :
                                                order.crop?.category === 'fruits' ? '🍇' : '🥕'}
                                        </span>
                                        <div>
                                            <h3>{order.crop?.name || 'Crop'}</h3>
                                            <p>{order.quantity?.value} {order.quantity?.unit}</p>
                                        </div>
                                    </div>

                                    <div className="order-parties">
                                        {user?.role === 'buyer' && order.farmer && (
                                            <div className="party">
                                                <span className="party-label">Farmer</span>
                                                <strong>{order.farmer.name}</strong>
                                            </div>
                                        )}
                                        {user?.role === 'farmer' && order.buyer && (
                                            <div className="party">
                                                <span className="party-label">Buyer</span>
                                                <strong>{order.buyer.name}</strong>
                                            </div>
                                        )}
                                    </div>

                                    <div className="order-pricing">
                                        <div className="price-item">
                                            <span>Offered</span>
                                            <strong>₹{order.pricing?.offeredPrice || 0}</strong>
                                        </div>
                                        {order.pricing?.finalAmount && (
                                            <div className="price-item total">
                                                <span>Total</span>
                                                <strong>₹{order.pricing.finalAmount.toLocaleString('en-IN')}</strong>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user?.role === 'farmer' && order.status === 'pending' && (
                                    <div className="order-actions">
                                        <button className="btn btn-primary btn-sm" onClick={() => handleRespond(order._id, 'accept')}>
                                            <FiCheck /> Accept
                                        </button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleRespond(order._id, 'reject')}>
                                            <FiX /> Reject
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersPage;
