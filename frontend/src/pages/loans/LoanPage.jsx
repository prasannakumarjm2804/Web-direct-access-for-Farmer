import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiFileText, FiCheckCircle, FiClock, FiTrendingUp } from 'react-icons/fi';
import PageHeader from '../../components/common/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import api from '../../services/api';
import './LoanPage.css';

const LoanPage = () => {
    const { user } = useSelector((state) => state.auth);
    const [activeTab, setActiveTab] = useState('apply');
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        tenureMonths: 12,
        purpose: 'seeds_fertilizers',
        providerName: 'AgriBank',
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (activeTab === 'history') {
            fetchLoans();
        }
    }, [activeTab]);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await api.get('/loans');
            setLoans(response.data.data);
        } catch (error) {
            console.error('Failed to fetch loans:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/loans/apply', formData);
            setSuccess(true);
            setFormData({ amount: '', tenureMonths: 12, purpose: 'seeds_fertilizers', providerName: 'AgriBank' });
            setTimeout(() => setSuccess(false), 5000);
        } catch (error) {
            console.error('Loan application failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="loan-page page-wrapper">
            <div className="container loan-container">
                <PageHeader
                    variant="gradient"
                    badge="Farmer Credit"
                    title="Loans & Credit"
                    subtitle="Get pre-approved loans based on your sales history and AgriConnect credit score."
                    icon="💸"
                />

                <motion.div
                    className="credit-score-card card card-glass-gradient"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="score-circle">
                        <span className="score-val">720</span>
                        <span className="score-label">Credit Score</span>
                    </div>
                    <div className="score-details">
                        <h3><FiTrendingUp /> Excellent Standing</h3>
                        <p>You are eligible for low-interest loans up to ₹5,00,000 based on your marketplace activity.</p>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: '85%' }} />
                        </div>
                    </div>
                </motion.div>

                <div className="loan-tabs admin-tabs">
                    <button
                        type="button"
                        className={`admin-tab ${activeTab === 'apply' ? 'active' : ''}`}
                        onClick={() => setActiveTab('apply')}
                    >
                        <FiFileText /> Apply for Loan
                    </button>
                    <button
                        type="button"
                        className={`admin-tab ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        <FiClock /> Loan History
                    </button>
                </div>

                {activeTab === 'apply' && (
                    <div className="loan-form-card card">
                        {success ? (
                            <div className="loan-success empty-state empty-state-success">
                                <div className="empty-state-icon"><FiCheckCircle /></div>
                                <h3>Application Submitted!</h3>
                                <p>Your loan application is under review. You will be notified shortly.</p>
                                <button type="button" className="btn btn-primary" onClick={() => setSuccess(false)}>
                                    Apply Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Loan Amount (₹)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        className="form-input"
                                        value={formData.amount}
                                        onChange={handleChange}
                                        placeholder="e.g. 50000"
                                        min="1000"
                                        required
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Tenure (Months)</label>
                                        <select name="tenureMonths" className="form-select" value={formData.tenureMonths} onChange={handleChange}>
                                            <option value="6">6 Months</option>
                                            <option value="12">12 Months (1 Year)</option>
                                            <option value="24">24 Months (2 Years)</option>
                                            <option value="36">36 Months (3 Years)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Purpose</label>
                                        <select name="purpose" className="form-select" value={formData.purpose} onChange={handleChange}>
                                            <option value="seeds_fertilizers">Seeds & Fertilizers</option>
                                            <option value="equipment">Farm Equipment</option>
                                            <option value="irrigation">Irrigation Setup</option>
                                            <option value="labor_costs">Labor Costs</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Verified Lender</label>
                                    <select name="providerName" className="form-select" value={formData.providerName} onChange={handleChange}>
                                        <option value="AgriBank">AgriBank (Partner)</option>
                                        <option value="Gramin Bank">Gramin Vikas Bank</option>
                                        <option value="Cooperative Society">Local Cooperative Society</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {activeTab === 'history' && (
                    <div className="loan-history-list">
                        {loading ? (
                            <SkeletonLoader type="list" count={3} />
                        ) : loans.length > 0 ? (
                            loans.map((loan) => (
                                <div key={loan._id} className="loan-card card">
                                    <div className="loan-header">
                                        <h4>{loan.purpose.replace(/_/g, ' ')}</h4>
                                        <span className={`badge badge-${loan.status === 'approved' ? 'success' : loan.status === 'rejected' ? 'error' : 'warning'}`}>
                                            {loan.status}
                                        </span>
                                    </div>
                                    <div className="loan-body">
                                        <p><strong>Amount:</strong> ₹{loan.amount?.toLocaleString('en-IN')}</p>
                                        <p><strong>Provider:</strong> {loan.provider?.name}</p>
                                        <p><strong>Date:</strong> {new Date(loan.createdAt).toLocaleDateString('en-IN')}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h3>No loan history</h3>
                                <p>Your past loan applications will appear here.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoanPage;
