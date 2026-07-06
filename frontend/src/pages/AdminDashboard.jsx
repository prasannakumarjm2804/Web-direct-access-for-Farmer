import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { motion } from 'framer-motion';
import { FiUsers, FiPackage, FiDollarSign, FiActivity, FiList, FiCheck, FiX } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import PageHeader from '../components/common/PageHeader';
import './DashboardPages.css';

const AdminDashboard = () => {
    const { user } = useSelector(state => state.auth);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('overview');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: result } = await api.get('/admin/dashboard');
                setData(result.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="loading-page"><div className="spinner" /><p>Loading admin dashboard...</p></div>;
    }

    const overview = data?.overview || {};
    const charts = data?.charts || {};

    const adminStats = [
        { icon: <FiUsers />, label: 'Total Farmers', value: overview.totalFarmers, color: 'gradient-green' },
        { icon: <FiUsers />, label: 'Total Buyers', value: overview.totalBuyers, color: 'gradient-blue' },
        { icon: <GiWheat />, label: 'Active Crops', value: overview.totalCrops, color: 'gradient-amber' },
        { icon: <FiPackage />, label: 'Total Orders', value: overview.totalOrders, color: 'gradient-purple' },
        { icon: <FiActivity />, label: 'Active Orders', value: overview.activeOrders, color: 'gradient-teal' },
        { icon: <FiDollarSign />, label: 'Platform Revenue', value: `₹${(overview.platformCommission || 0).toLocaleString('en-IN')}`, color: 'gradient-rose' },
    ];

    return (
        <div className="dashboard-page page-wrapper">
            <div className="container">
                <PageHeader
                    badge="Admin Panel"
                    title="Platform Overview"
                    subtitle="Monitor users, orders, and marketplace activity across AgriConnect."
                />

                {/* Admin Tabs */}
                <div className="admin-tabs">
                    {['overview', 'users', 'orders'].map(t => (
                        <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                            {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                    ))}
                </div>

                {tab === 'overview' && (
                    <>
                        <div className="admin-stats-grid">
                            {adminStats.map((s, i) => (
                                <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                    <div className={`stat-icon ${s.color}`} style={{ color: 'white' }}>{s.icon}</div>
                                    <div className="stat-info">
                                        <h3>{s.value || 0}</h3>
                                        <p>{s.label}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="dash-two-col">
                            {/* Top Crops */}
                            <div className="dash-section">
                                <h2>📊 Top Crop Categories</h2>
                                <div className="chart-placeholder card">
                                    {charts.topCrops?.map((c, i) => (
                                        <div key={i} className="chart-bar-item">
                                            <span className="chart-label">{c._id}</span>
                                            <div className="chart-bar">
                                                <div className="chart-bar-fill" style={{ width: `${Math.min(100, (c.count / (charts.topCrops[0]?.count || 1)) * 100)}%` }} />
                                            </div>
                                            <span className="chart-value">{c.count}</span>
                                        </div>
                                    ))}
                                    {(!charts.topCrops || charts.topCrops.length === 0) && (
                                        <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '24px' }}>No data yet</p>
                                    )}
                                </div>
                            </div>

                            {/* State-wise */}
                            <div className="dash-section">
                                <h2>🗺️ State-wise Farmers</h2>
                                <div className="chart-placeholder card">
                                    {charts.stateWise?.map((s, i) => (
                                        <div key={i} className="chart-bar-item">
                                            <span className="chart-label">{s._id || 'Unknown'}</span>
                                            <div className="chart-bar">
                                                <div className="chart-bar-fill gradient-blue" style={{ width: `${Math.min(100, (s.count / (charts.stateWise[0]?.count || 1)) * 100)}%` }} />
                                            </div>
                                            <span className="chart-value">{s.count}</span>
                                        </div>
                                    ))}
                                    {(!charts.stateWise || charts.stateWise.length === 0) && (
                                        <p style={{ color: 'var(--text-tertiary)', textAlign: 'center', padding: '24px' }}>No data yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {tab === 'users' && <AdminUsersTab />}
                {tab === 'orders' && <AdminOrdersTab />}
            </div>
        </div>
    );
};

// Users Tab
const AdminUsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get(`/admin/users?role=${filter}`);
                setUsers(data.data.users);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchUsers();
    }, [filter]);

    const toggleUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/toggle`);
            setUsers(users.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
        } catch (err) { console.error(err); }
    };

    return (
        <div className="dash-section">
            <div className="section-actions">
                <h2>User Management</h2>
                <div className="tab-filters">
                    {['', 'farmer', 'buyer', 'admin'].map(r => (
                        <button key={r} className={`filter-chip ${filter === r ? 'active' : ''}`} onClick={() => setFilter(r)}>
                            {r || 'All'}
                        </button>
                    ))}
                </div>
            </div>
            {loading ? <div className="loading-page"><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th><th>Phone</th><th>Role</th><th>Location</th><th>Status</th><th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id}>
                                    <td><strong>{u.name}</strong></td>
                                    <td>{u.phone}</td>
                                    <td><span className="badge badge-primary">{u.role}</span></td>
                                    <td>{u.location?.state || '—'}</td>
                                    <td><span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                                    <td>
                                        <button className={`btn btn-sm ${u.isActive ? 'btn-danger' : 'btn-primary'}`} onClick={() => toggleUser(u._id)}>
                                            {u.isActive ? <><FiX /> Deactivate</> : <><FiCheck /> Activate</>}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// Orders Tab
const AdminOrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/admin/orders');
                setOrders(data.data.orders);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        const map = { completed: 'badge-success', cancelled: 'badge-error', pending: 'badge-warning', in_transit: 'badge-info' };
        return map[status] || 'badge-primary';
    };

    return (
        <div className="dash-section">
            <h2>Order Management</h2>
            {loading ? <div className="loading-page"><div className="spinner" /></div> : (
                <div className="table-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th><th>Farmer</th><th>Buyer</th><th>Crop</th><th>Amount</th><th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o._id}>
                                    <td><strong>{o.orderId}</strong></td>
                                    <td>{o.farmer?.name || '—'}</td>
                                    <td>{o.buyer?.name || '—'}</td>
                                    <td>{o.crop?.name || '—'}</td>
                                    <td>₹{(o.pricing?.finalAmount || 0).toLocaleString('en-IN')}</td>
                                    <td><span className={`badge ${getStatusColor(o.status)}`}>{o.status}</span></td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>No orders yet</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
