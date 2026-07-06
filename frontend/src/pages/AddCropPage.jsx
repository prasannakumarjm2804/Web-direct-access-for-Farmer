import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createCrop } from '../store/slices/cropSlice';
import { FiUpload, FiCheck, FiArrowRight, FiMapPin, FiDollarSign } from 'react-icons/fi';
import PageHeader from '../components/common/PageHeader';
import toast from 'react-hot-toast';
import './AddCropPage.css';
const CATEGORIES = ['grains', 'pulses', 'vegetables', 'fruits', 'spices', 'oilseeds', 'cotton', 'sugarcane', 'other'];
const UNITS = ['kg', 'quintal', 'ton', 'pieces', 'dozen', 'bundle'];

const AddCropPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.crops);
    const { user } = useSelector(state => state.auth);
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', category: 'grains', variety: '', description: '',
        quantity: { value: '', unit: 'kg' },
        price: { expected: '', minimum: '', unit: 'per_kg' },
        qualityGrade: 'A', isOrganic: false, harvestDate: '',
        location: {
            state: user?.location?.state || '',
            district: user?.location?.district || '',
            village: '',
        },
        certifications: [],
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');

    const handleChange = (field, value) => {
        const fields = field.split('.');
        if (fields.length === 2) {
            setForm({ ...form, [fields[0]]: { ...form[fields[0]], [fields[1]]: value } });
        } else {
            setForm({ ...form, [field]: value });
        }
    };

    const addTag = () => {
        if (tagInput && !form.tags.includes(tagInput)) {
            setForm({ ...form, tags: [...form.tags, tagInput] });
            setTagInput('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createCrop({
            ...form,
            quantity: { ...form.quantity, value: parseFloat(form.quantity.value) },
            price: { ...form.price, expected: parseFloat(form.price.expected), minimum: parseFloat(form.price.minimum) || undefined },
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Crop listed successfully! 🌾');
            navigate('/farmer/dashboard');
        } else {
            toast.error(result.payload || 'Failed to list crop');
        }
    };

    return (
        <div className="add-crop-page page-wrapper">
            <div className="container">
                <div className="add-crop-header">
                    <h1>📝 List a New Crop</h1>
                    <p>Add your produce details and start receiving orders from buyers</p>
                </div>

                {/* Step Indicator */}
                <div className="step-indicator">
                    {['Crop Details', 'Pricing & Quality', 'Location & Submit'].map((s, i) => (
                        <div key={i} className={`step-item ${step > i + 1 ? 'completed' : step === i + 1 ? 'active' : ''}`}>
                            <div className="step-circle">{step > i + 1 ? <FiCheck /> : i + 1}</div>
                            <span>{s}</span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-card card">
                        {/* Step 1: Crop Details */}
                        {step === 1 && (
                            <div className="form-step">
                                <h2>Crop Information</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Crop Name *</label>
                                        <input type="text" className="form-input" placeholder="e.g., Basmati Rice, Alphonso Mango"
                                            value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category *</label>
                                        <select className="form-select" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Variety / Type</label>
                                    <input type="text" className="form-input" placeholder="e.g., 1121 Sella, Dasheri"
                                        value={form.variety} onChange={(e) => handleChange('variety', e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-textarea" rows={4} placeholder="Describe your crop quality, storage conditions, etc."
                                        value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Quantity *</label>
                                        <input type="number" className="form-input" placeholder="Enter quantity"
                                            value={form.quantity.value} onChange={(e) => handleChange('quantity.value', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Unit</label>
                                        <select className="form-select" value={form.quantity.unit} onChange={(e) => handleChange('quantity.unit', e.target.value)}>
                                            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Tags</label>
                                    <div className="tags-input">
                                        <input type="text" className="form-input" placeholder="Add tags and press enter"
                                            value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                                        <button type="button" className="btn btn-sm btn-secondary" onClick={addTag}>Add</button>
                                    </div>
                                    <div className="tags-list">
                                        {form.tags.map((t, i) => (
                                            <span key={i} className="tag-chip">
                                                #{t} <button type="button" onClick={() => setForm({ ...form, tags: form.tags.filter((_, j) => j !== i) })}>✕</button>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="step-actions">
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(2)}>
                                        Next: Pricing <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Pricing & Quality */}
                        {step === 2 && (
                            <div className="form-step">
                                <h2>Pricing & Quality</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Expected Price (₹) *</label>
                                        <div className="input-with-icon">
                                            <FiDollarSign className="input-icon" />
                                            <input type="number" className="form-input" placeholder="Your expected price"
                                                value={form.price.expected} onChange={(e) => handleChange('price.expected', e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Minimum Acceptable (₹)</label>
                                        <input type="number" className="form-input" placeholder="Minimum price"
                                            value={form.price.minimum} onChange={(e) => handleChange('price.minimum', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Price Unit</label>
                                    <select className="form-select" value={form.price.unit} onChange={(e) => handleChange('price.unit', e.target.value)}>
                                        <option value="per_kg">Per Kg</option>
                                        <option value="per_quintal">Per Quintal</option>
                                        <option value="per_ton">Per Ton</option>
                                        <option value="per_piece">Per Piece</option>
                                    </select>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Quality Grade</label>
                                        <select className="form-select" value={form.qualityGrade} onChange={(e) => handleChange('qualityGrade', e.target.value)}>
                                            <option value="A+">A+ (Premium)</option>
                                            <option value="A">A (Standard)</option>
                                            <option value="B">B (Economy)</option>
                                            <option value="C">C (Below Average)</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Harvest Date</label>
                                        <input type="date" className="form-input" value={form.harvestDate}
                                            onChange={(e) => handleChange('harvestDate', e.target.value)} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" checked={form.isOrganic}
                                            onChange={(e) => handleChange('isOrganic', e.target.checked)} />
                                        <span>🌿 This crop is organically grown</span>
                                    </label>
                                </div>
                                <div className="step-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                                    <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>
                                        Next: Location <FiArrowRight />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Location & Submit */}
                        {step === 3 && (
                            <div className="form-step">
                                <h2>Farm Location</h2>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">State *</label>
                                        <input type="text" className="form-input" placeholder="State"
                                            value={form.location.state} onChange={(e) => handleChange('location.state', e.target.value)} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">District *</label>
                                        <input type="text" className="form-input" placeholder="District"
                                            value={form.location.district} onChange={(e) => handleChange('location.district', e.target.value)} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Village / Area</label>
                                    <div className="input-with-icon">
                                        <FiMapPin className="input-icon" />
                                        <input type="text" className="form-input" placeholder="Enter village or area"
                                            value={form.location.village} onChange={(e) => handleChange('location.village', e.target.value)} />
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="listing-summary">
                                    <h3>📋 Listing Summary</h3>
                                    <div className="summary-grid">
                                        <div><span>Crop:</span><strong>{form.name} ({form.category})</strong></div>
                                        <div><span>Quantity:</span><strong>{form.quantity.value} {form.quantity.unit}</strong></div>
                                        <div><span>Price:</span><strong>₹{form.price.expected} / {form.price.unit.replace('per_', '')}</strong></div>
                                        <div><span>Quality:</span><strong>{form.qualityGrade} Grade</strong></div>
                                        <div><span>Type:</span><strong>{form.isOrganic ? '🌿 Organic' : 'Conventional'}</strong></div>
                                        <div><span>Location:</span><strong>{form.location.district}, {form.location.state}</strong></div>
                                    </div>
                                </div>

                                <div className="step-actions">
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? 'Listing...' : '🌾 List My Crop'} <FiCheck />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCropPage;
