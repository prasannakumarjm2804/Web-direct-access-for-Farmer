import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCrops, setFilters } from '../store/slices/cropSlice';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiMapPin, FiStar, FiEye, FiShoppingCart, FiX } from 'react-icons/fi';
import './MarketplacePage.css';

const CATEGORIES = [
    { value: '', label: 'All Categories' },
    { value: 'grains', label: '🌾 Grains' },
    { value: 'pulses', label: '🫘 Pulses' },
    { value: 'vegetables', label: '🥕 Vegetables' },
    { value: 'fruits', label: '🍇 Fruits' },
    { value: 'spices', label: '🌶️ Spices' },
    { value: 'oilseeds', label: '🥜 Oilseeds' },
];

const STATES = [
    '', 'Punjab', 'Uttar Pradesh', 'Tamil Nadu', 'Maharashtra',
    'Andhra Pradesh', 'Karnataka', 'Gujarat', 'Madhya Pradesh',
    'Rajasthan', 'West Bengal', 'Bihar', 'Haryana',
];

const MarketplacePage = () => {
    const dispatch = useDispatch();
    const { items: crops, loading, pagination, filters } = useSelector((state) => state.crops);
    const [showFilters, setShowFilters] = useState(false);
    const [searchInput, setSearchInput] = useState(filters.search || '');

    useEffect(() => {
        dispatch(fetchCrops(filters));
    }, [dispatch, filters]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(setFilters({ search: searchInput }));
    };

    const handleFilterChange = (key, value) => {
        dispatch(setFilters({ [key]: value }));
    };

    const getQualityColor = (grade) => {
        switch (grade) {
            case 'A+': return 'badge-success';
            case 'A': return 'badge-primary';
            case 'B': return 'badge-warning';
            default: return 'badge-info';
        }
    };

    return (
        <div className="marketplace-page page-wrapper">
            <div className="container">
                {/* Header */}
                <div className="marketplace-header">
                    <div>
                        <h1>🌾 Farm Fresh Marketplace</h1>
                        <p>Browse {pagination?.total || 0} crop listings from verified farmers across India</p>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="marketplace-controls">
                    <form className="search-bar" onSubmit={handleSearch}>
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search crops, farmers, locations..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-primary btn-sm">Search</button>
                    </form>
                    <button className="btn btn-secondary" onClick={() => setShowFilters(!showFilters)}>
                        <FiFilter /> Filters
                    </button>
                </div>

                {/* Category Pills */}
                <div className="category-pills">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            className={`category-pill ${filters.category === cat.value ? 'active' : ''}`}
                            onClick={() => handleFilterChange('category', cat.value)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <motion.div
                        className="filters-panel card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                    >
                        <div className="filters-grid">
                            <div className="form-group">
                                <label className="form-label">State</label>
                                <select className="form-select" value={filters.state} onChange={(e) => handleFilterChange('state', e.target.value)}>
                                    <option value="">All States</option>
                                    {STATES.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Quality Grade</label>
                                <select className="form-select" value={filters.quality} onChange={(e) => handleFilterChange('quality', e.target.value)}>
                                    <option value="">Any Quality</option>
                                    <option value="A+">A+ Premium</option>
                                    <option value="A">A Standard</option>
                                    <option value="B">B Economy</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Min Price (₹)</label>
                                <input type="number" className="form-input" placeholder="0" value={filters.minPrice}
                                    onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Max Price (₹)</label>
                                <input type="number" className="form-input" placeholder="999" value={filters.maxPrice}
                                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Organic Only</label>
                                <select className="form-select" value={filters.organic} onChange={(e) => handleFilterChange('organic', e.target.value)}>
                                    <option value="">All</option>
                                    <option value="true">Organic Only</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Crop Grid */}
                {loading ? (
                    <div className="loading-page">
                        <div className="spinner" />
                        <p>Loading crops...</p>
                    </div>
                ) : crops.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">🌱</div>
                        <h3>No crops found</h3>
                        <p>Try adjusting your search or filters</p>
                    </div>
                ) : (
                    <div className="crops-grid">
                        {crops.map((crop, i) => (
                            <motion.div
                                key={crop._id}
                                className="crop-card card"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link to={`/crops/${crop._id}`}>
                                    <div className="crop-image">
                                        <div className="crop-image-placeholder">
                                            {crop.category === 'grains' ? '🌾' :
                                                crop.category === 'fruits' ? '🍇' :
                                                    crop.category === 'vegetables' ? '🥕' :
                                                        crop.category === 'spices' ? '🌶️' :
                                                            crop.category === 'pulses' ? '🫘' : '🌿'}
                                        </div>
                                        <div className="crop-badges">
                                            <span className={`badge ${getQualityColor(crop.qualityGrade)}`}>
                                                {crop.qualityGrade}
                                            </span>
                                            {crop.isOrganic && (
                                                <span className="badge badge-success">🌿 Organic</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="crop-info">
                                        <div className="crop-category-tag">{crop.category}</div>
                                        <h3 className="crop-name">{crop.name}</h3>
                                        <div className="crop-meta">
                                            <span className="crop-location">
                                                <FiMapPin /> {crop.location?.district || crop.location?.state}
                                            </span>
                                            <span className="crop-views">
                                                <FiEye /> {crop.views}
                                            </span>
                                        </div>
                                        <div className="crop-details-row">
                                            <span className="crop-qty">{crop.quantity?.value} {crop.quantity?.unit}</span>
                                        </div>
                                        <div className="crop-price-row">
                                            <div className="crop-price">
                                                <span className="price-value">₹{crop.price?.expected}</span>
                                                <span className="price-unit">/{crop.price?.unit?.replace('per_', '')}</span>
                                            </div>
                                            {crop.mandiPrice?.current && (
                                                <div className="mandi-price">
                                                    Mandi: ₹{crop.mandiPrice.current}
                                                </div>
                                            )}
                                        </div>
                                        {crop.farmer && (
                                            <div className="crop-farmer">
                                                <div className="farmer-avatar">{crop.farmer.name?.charAt(0)}</div>
                                                <span>{crop.farmer.name}</span>
                                                {crop.farmer.rating?.average > 0 && (
                                                    <span className="farmer-rating"><FiStar /> {crop.farmer.rating.average}</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: pagination.pages }, (_, i) => (
                            <button
                                key={i}
                                className={`page-btn ${pagination.page === i + 1 ? 'active' : ''}`}
                                onClick={() => dispatch(fetchCrops({ ...filters, page: i + 1 }))}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MarketplacePage;
