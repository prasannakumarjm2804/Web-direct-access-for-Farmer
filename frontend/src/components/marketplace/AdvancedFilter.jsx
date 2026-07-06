import React, { useState } from 'react';
import { FiFilter, FiX, FiChevronDown, FiChevronUp, FiSliders, FiMapPin, FiDollarSign, FiCalendar } from 'react-icons/fi';
import './AdvancedFilter.css';

const AdvancedFilter = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedSections, setExpandedSections] = useState({});

    const [filters, setFilters] = useState({
        category: '',
        priceRange: [0, 100],
        location: '',
        dateRange: '',
        quality: '',
        organic: false,
        inStock: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const clearFilters = () => {
        const clearedFilters = {
            category: '',
            priceRange: [0, 100],
            location: '',
            dateRange: '',
            quality: '',
            organic: false,
            inStock: true
        };
        setFilters(clearedFilters);
        if (onFilterChange) {
            onFilterChange(clearedFilters);
        }
    };

    const categories = [
        { id: 'grains', name: 'Grains & Cereals', icon: '🌾' },
        { id: 'vegetables', name: 'Vegetables', icon: '🥕' },
        { id: 'fruits', name: 'Fruits', icon: '🍎' },
        { id: 'spices', name: 'Spices', icon: '🌶️' },
        { id: 'pulses', name: 'Pulses & Lentils', icon: '🫘' },
        { id: 'oilseeds', name: 'Oilseeds', icon: '🌻' }
    ];

    const locations = [
        'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh',
        'Rajasthan', 'Gujarat', 'Maharashtra', 'Karnataka',
        'Tamil Nadu', 'Andhra Pradesh', 'West Bengal', 'Bihar'
    ];

    const qualityLevels = ['Premium', 'Grade A', 'Grade B', 'Standard'];

    const activeFilterCount = Object.values(filters).filter(
        value => {
            if (Array.isArray(value)) {
                return value[0] !== 0 || value[1] !== 100;
            }
            return value !== '' && value !== false;
        }
    ).length;

    return (
        <div className="advanced-filter">
            <button
                className={`filter-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <FiSliders />
                <span>Filters</span>
                {activeFilterCount > 0 && (
                    <span className="filter-count">{activeFilterCount}</span>
                )}
                {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </button>

            {isOpen && (
                <div className="filter-panel">
                    <div className="filter-header">
                        <h3>Filter Results</h3>
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            <FiX /> Clear All
                        </button>
                    </div>

                    <div className="filter-sections">
                        {/* Category Filter */}
                        <div className="filter-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection('category')}
                            >
                                <span>Category</span>
                                {expandedSections.category ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {expandedSections.category && (
                                <div className="section-content">
                                    <div className="category-grid">
                                        {categories.map(cat => (
                                            <button
                                                key={cat.id}
                                                className={`category-chip ${filters.category === cat.id ? 'active' : ''}`}
                                                onClick={() => handleFilterChange('category', filters.category === cat.id ? '' : cat.id)}
                                            >
                                                <span className="cat-icon">{cat.icon}</span>
                                                <span className="cat-name">{cat.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price Range Filter */}
                        <div className="filter-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection('price')}
                            >
                                <span>Price Range (₹/kg)</span>
                                {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {expandedSections.price && (
                                <div className="section-content">
                                    <div className="price-range-inputs">
                                        <div className="price-input">
                                            <label>Min</label>
                                            <input
                                                type="number"
                                                value={filters.priceRange[0]}
                                                onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value), filters.priceRange[1]])}
                                            />
                                        </div>
                                        <div className="price-input">
                                            <label>Max</label>
                                            <input
                                                type="number"
                                                value={filters.priceRange[1]}
                                                onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                                        className="price-slider"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Location Filter */}
                        <div className="filter-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection('location')}
                            >
                                <span><FiMapPin /> Location</span>
                                {expandedSections.location ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {expandedSections.location && (
                                <div className="section-content">
                                    <select
                                        className="location-select"
                                        value={filters.location}
                                        onChange={(e) => handleFilterChange('location', e.target.value)}
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map(loc => (
                                            <option key={loc} value={loc}>{loc}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Quality Filter */}
                        <div className="filter-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection('quality')}
                            >
                                <span>Quality</span>
                                {expandedSections.quality ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {expandedSections.quality && (
                                <div className="section-content">
                                    <div className="quality-options">
                                        {qualityLevels.map(quality => (
                                            <label key={quality} className="quality-option">
                                                <input
                                                    type="radio"
                                                    name="quality"
                                                    value={quality}
                                                    checked={filters.quality === quality}
                                                    onChange={(e) => handleFilterChange('quality', e.target.value)}
                                                />
                                                <span>{quality}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Additional Filters */}
                        <div className="filter-section">
                            <button
                                className="section-header"
                                onClick={() => toggleSection('additional')}
                            >
                                <span>Additional Filters</span>
                                {expandedSections.additional ? <FiChevronUp /> : <FiChevronDown />}
                            </button>
                            {expandedSections.additional && (
                                <div className="section-content">
                                    <label className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.organic}
                                            onChange={(e) => handleFilterChange('organic', e.target.checked)}
                                        />
                                        <span>Organic Only</span>
                                    </label>
                                    <label className="checkbox-option">
                                        <input
                                            type="checkbox"
                                            checked={filters.inStock}
                                            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                                        />
                                        <span>In Stock Only</span>
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="filter-footer">
                        <button className="apply-filters-btn" onClick={() => setIsOpen(false)}>
                            Apply Filters ({activeFilterCount})
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvancedFilter;
