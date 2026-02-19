import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaRupeeSign, FaFileAlt, FaCheckCircle, FaSpinner, FaHistory } from 'react-icons/fa';
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
        providerName: 'AgriBank'
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
        <div className="loan-page-container">
            <header className="page-header">
                <h1>Farmer Credit & Loans 💸</h1>
                <p>Get pre-approved loans based on your sales history and credit score.</p>
            </header>

            <div className="credit-score-card">
                <div className="score-circle">
                    <span className="score-val">720</span>
                    <span className="score-label">Credit Score</span>
                </div>
                <div className="score-details">
                    <h3>Excellent Condition</h3>
                    <p>You are eligible for low-interest loans up to ₹5,00,000.</p>
                    <div className="progress-bar"><div className="progress-fill" style={{ width: '85%' }}></div></div>
                </div>
            </div>

            <div className="loan-tabs">
                <button className={`tab-btn ${activeTab === 'apply' ? 'active' : ''}`} onClick={() => setActiveTab('apply')}>
                    <FaFileAlt /> Apply for Loan
                </button>
                <button className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <FaHistory /> Loan History
                </button>
            </div>

            {activeTab === 'apply' && (
                <div className="loan-form-card">
                    {success ? (
                        <div className="success-message">
                            <FaCheckCircle className="text-green-500 text-5xl mb-4" />
                            <h3>Application Submitted Successfully!</h3>
                            <p>Your loan application is under review. You will be notified shortly.</p>
                            <button onClick={() => setSuccess(false)} className="btn-primary mt-4">Apply Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Loan Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    min="1000"
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Tenure (Months)</label>
                                    <select name="tenureMonths" value={formData.tenureMonths} onChange={handleChange}>
                                        <option value="6">6 Months</option>
                                        <option value="12">12 Months (1 Year)</option>
                                        <option value="24">24 Months (2 Years)</option>
                                        <option value="36">36 Months (3 Years)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Purpose</label>
                                    <select name="purpose" value={formData.purpose} onChange={handleChange}>
                                        <option value="seeds_fertilizers">Seeds & Fertilizers</option>
                                        <option value="equipment">Farm Equipment</option>
                                        <option value="irrigation">Irrigation Setup</option>
                                        <option value="labor_costs">Labor Costs</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Verified Lender</label>
                                <select name="providerName" value={formData.providerName} onChange={handleChange}>
                                    <option value="AgriBank">AgriBank (Partner)</option>
                                    <option value="Gramin Bank">Gramin Vikas Bank</option>
                                    <option value="Cooperative Society">Local Cooperative Society</option>
                                </select>
                            </div>

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? <FaSpinner className="animate-spin" /> : 'Submit Application'}
                            </button>
                        </form>
                    )}
                </div>
            )}

            {activeTab === 'history' && (
                <div className="loan-history-list">
                    {loading ? <p>Loading history...</p> : loans.length > 0 ? (
                        loans.map(loan => (
                            <div key={loan._id} className="loan-card">
                                <div className="loan-header">
                                    <h4>{loan.purpose.replace('_', ' ').toUpperCase()}</h4>
                                    <span className={`status-badge ${loan.status}`}>{loan.status}</span>
                                </div>
                                <div className="loan-body">
                                    <p><strong>Amount:</strong> ₹{loan.amount}</p>
                                    <p><strong>Provider:</strong> {loan.provider.name}</p>
                                    <p><strong>Date:</strong> {new Date(loan.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">No loan history found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LoanPage;
