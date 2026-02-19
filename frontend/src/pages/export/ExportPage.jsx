import React, { useState, useEffect } from 'react';
import { FaGlobeAmericas, FaShip, FaPlus, FaBoxOpen } from 'react-icons/fa';
import api from '../../services/api';
import './ExportPage.css';

const ExportPage = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // fetch export listings
        const fetchListings = async () => {
            try {
                const res = await api.get('/exports');
                setListings(res.data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, []);

    return (
        <div className="export-page-container">
            <header className="export-header">
                <h1>Global Export Hub 🌍</h1>
                <p>Connect with international buyers and expand your market reach.</p>
                <button className="create-listing-btn">
                    <FaPlus /> create new listing
                </button>
            </header>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Exports</h3>
                    <p className="value">120 Tons</p>
                </div>
                <div className="stat-card">
                    <h3>Active Orders</h3>
                    <p className="value">5</p>
                </div>
                <div className="stat-card">
                    <h3>Compliance Score</h3>
                    <p className="value high">98%</p>
                </div>
            </div>

            <div className="listings-section">
                <h2>Your Export Listings</h2>
                {loading ? <p>Loading...</p> : listings.length > 0 ? (
                    <div className="listings-grid">
                        {listings.map(item => (
                            <div key={item._id} className="listing-card">
                                <div className="listing-icon"><FaBoxOpen /></div>
                                <div className="listing-details">
                                    <h4>{item.crop?.name || 'Unknown Crop'}</h4>
                                    <p>{item.quantityAvailable?.value} {item.quantityAvailable?.unit}</p>
                                    <span className="destination-tag">
                                        <FaGlobeAmericas /> {item.destinationCountries?.join(', ') || 'Global'}
                                    </span>
                                </div>
                                <div className={`status ${item.complianceStatus}`}>
                                    {item.complianceStatus}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaShip className="text-6xl text-gray-300 mb-4" />
                        <p>No export listings found. Start exporting today!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportPage;
