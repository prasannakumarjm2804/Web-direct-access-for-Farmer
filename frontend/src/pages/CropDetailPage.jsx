import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCropById } from '../store/slices/cropSlice';
import { createOrder } from '../store/slices/orderSlice';
import { FiMapPin, FiStar, FiEye, FiCalendar, FiShield, FiMessageCircle, FiCheck, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import './CropDetailPage.css';

const CropDetailPage = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentCrop: crop, loading } = useSelector((state) => state.crops);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [showOrder, setShowOrder] = useState(false);
    const [orderData, setOrderData] = useState({
        quantity: '', offeredPrice: '', notes: '',
        deliveryAddress: { street: '', city: '', state: '', pincode: '' },
    });

    useEffect(() => {
        dispatch(fetchCropById(id));
    }, [dispatch, id]);

    const handleOrder = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to place an order');
            return;
        }
        const result = await dispatch(createOrder({
            cropId: crop._id,
            quantity: { value: parseFloat(orderData.quantity), unit: crop.quantity.unit },
            offeredPrice: parseFloat(orderData.offeredPrice) || crop.price.expected,
            deliveryAddress: orderData.deliveryAddress,
            notes: orderData.notes,
        }));
        if (result.meta.requestStatus === 'fulfilled') {
            toast.success('Order placed successfully! 🎉');
            setShowOrder(false);
        } else {
            toast.error(result.payload || 'Failed to place order');
        }
    };

    if (loading || !crop) {
        return <div className="loading-page"><div className="spinner" /><p>Loading crop details...</p></div>;
    }

    return (
        <div className="crop-detail-page page-wrapper">
            <div className="container">
                <div className="detail-layout">
                    {/* Left - Crop Info */}
                    <div className="detail-main">
                        <div className="detail-image-section card">
                            <div className="detail-image">
                                <span className="detail-emoji">
                                    {crop.category === 'grains' ? '🌾' :
                                        crop.category === 'fruits' ? '🍇' :
                                            crop.category === 'vegetables' ? '🥕' :
                                                crop.category === 'spices' ? '🌶️' : '🌿'}
                                </span>
                            </div>
                            <div className="detail-badges">
                                <span className="badge badge-success">{crop.qualityGrade} Grade</span>
                                {crop.isOrganic && <span className="badge badge-primary">🌿 Organic</span>}
                                <span className="badge badge-info">{crop.category}</span>
                            </div>
                        </div>

                        <div className="detail-info card">
                            <h1>{crop.name}</h1>
                            {crop.variety && <p className="crop-variety">Variety: {crop.variety}</p>}
                            <p className="crop-description">{crop.description}</p>

                            <div className="detail-stats">
                                <div className="d-stat">
                                    <FiMapPin />
                                    <span>{crop.location?.village && `${crop.location.village}, `}{crop.location?.district}, {crop.location?.state}</span>
                                </div>
                                <div className="d-stat">
                                    <FiEye />
                                    <span>{crop.views} views</span>
                                </div>
                                {crop.harvestDate && (
                                    <div className="d-stat">
                                        <FiCalendar />
                                        <span>Harvested: {new Date(crop.harvestDate).toLocaleDateString('en-IN')}</span>
                                    </div>
                                )}
                            </div>

                            {crop.certifications?.length > 0 && (
                                <div className="certifications">
                                    <h3><FiShield /> Certifications</h3>
                                    <div className="cert-list">
                                        {crop.certifications.map((c, i) => (
                                            <span key={i} className="badge badge-success"><FiCheck /> {c}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {crop.tags?.length > 0 && (
                                <div className="crop-tags">
                                    {crop.tags.map((tag, i) => (
                                        <span key={i} className="tag">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Pricing & Order */}
                    <div className="detail-sidebar">
                        <div className="pricing-card card">
                            <div className="price-header">
                                <div>
                                    <p className="price-label">Expected Price</p>
                                    <div className="price-main">
                                        <span className="price-amount">₹{crop.price?.expected}</span>
                                        <span className="price-per">/{crop.price?.unit?.replace('per_', '')}</span>
                                    </div>
                                </div>
                                {crop.price?.minimum && (
                                    <p className="price-min">Min: ₹{crop.price.minimum}/{crop.price?.unit?.replace('per_', '')}</p>
                                )}
                            </div>

                            {crop.mandiPrice?.current && (
                                <div className="mandi-compare">
                                    <div className="mandi-info">
                                        <FiTrendingUp />
                                        <span>Mandi Price: <strong>₹{crop.mandiPrice.current}</strong></span>
                                    </div>
                                    <span className={`price-diff ${crop.price.expected > crop.mandiPrice.current ? 'higher' : 'lower'}`}>
                                        {crop.price.expected > crop.mandiPrice.current ? '+' : ''}
                                        {Math.round(((crop.price.expected - crop.mandiPrice.current) / crop.mandiPrice.current) * 100)}%
                                    </span>
                                </div>
                            )}

                            {crop.aiSuggestedPrice?.price && (
                                <div className="ai-price">
                                    <span>🤖 AI Suggested: <strong>₹{crop.aiSuggestedPrice.price}</strong></span>
                                    <span className="confidence">{Math.round(crop.aiSuggestedPrice.confidence * 100)}% confidence</span>
                                </div>
                            )}

                            <div className="quantity-info">
                                <span>Available Quantity</span>
                                <strong>{crop.quantity?.value?.toLocaleString('en-IN')} {crop.quantity?.unit}</strong>
                            </div>

                            {isAuthenticated && user?.role === 'buyer' ? (
                                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => setShowOrder(!showOrder)}>
                                    🛒 Place Order
                                </button>
                            ) : !isAuthenticated ? (
                                <Link to="/login" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                                    Login to Buy
                                </Link>
                            ) : null}
                        </div>

                        {/* Farmer Card */}
                        {crop.farmer && (
                            <div className="farmer-card card">
                                <h3>Farmer Details</h3>
                                <div className="farmer-info-row">
                                    <div className="farmer-avatar-lg">
                                        {crop.farmer.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="farmer-name">{crop.farmer.name}</p>
                                        <p className="farmer-loc">
                                            <FiMapPin /> {crop.farmer.location?.district}, {crop.farmer.location?.state}
                                        </p>
                                        {crop.farmer.rating?.average > 0 && (
                                            <p className="farmer-rat"><FiStar /> {crop.farmer.rating.average} ({crop.farmer.rating.count} reviews)</p>
                                        )}
                                    </div>
                                </div>
                                {crop.farmer.farmerProfile && (
                                    <div className="farmer-details">
                                        {crop.farmer.farmerProfile.experience && (
                                            <div className="fd-item">
                                                <span>Experience</span>
                                                <strong>{crop.farmer.farmerProfile.experience} years</strong>
                                            </div>
                                        )}
                                        {crop.farmer.farmerProfile.farmSize && (
                                            <div className="fd-item">
                                                <span>Farm Size</span>
                                                <strong>{crop.farmer.farmerProfile.farmSize}</strong>
                                            </div>
                                        )}
                                        {crop.farmer.farmerProfile.farmingType && (
                                            <div className="fd-item">
                                                <span>Type</span>
                                                <strong className="capitalize">{crop.farmer.farmerProfile.farmingType}</strong>
                                            </div>
                                        )}
                                    </div>
                                )}
                                <button className="btn btn-outline" style={{ width: '100%' }}>
                                    <FiMessageCircle /> Contact Farmer
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Modal */}
                {showOrder && (
                    <div className="modal-overlay" onClick={() => setShowOrder(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-header">
                                <h2>Place Order</h2>
                                <button className="btn-icon" onClick={() => setShowOrder(false)}>✕</button>
                            </div>
                            <form onSubmit={handleOrder}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label className="form-label">Quantity ({crop.quantity.unit})</label>
                                        <input type="number" className="form-input" placeholder={`Max: ${crop.quantity.value}`}
                                            value={orderData.quantity} onChange={(e) => setOrderData({ ...orderData, quantity: e.target.value })}
                                            max={crop.quantity.value} required />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Your Offer Price (₹/{crop.price?.unit?.replace('per_', '')})</label>
                                        <input type="number" className="form-input" placeholder={`Asking: ₹${crop.price.expected}`}
                                            value={orderData.offeredPrice} onChange={(e) => setOrderData({ ...orderData, offeredPrice: e.target.value })} />
                                        <small style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Leave blank to accept asking price</small>
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input type="text" className="form-input" placeholder="Delivery city"
                                                value={orderData.deliveryAddress.city}
                                                onChange={(e) => setOrderData({ ...orderData, deliveryAddress: { ...orderData.deliveryAddress, city: e.target.value } })} required />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">State</label>
                                            <input type="text" className="form-input" placeholder="State"
                                                value={orderData.deliveryAddress.state}
                                                onChange={(e) => setOrderData({ ...orderData, deliveryAddress: { ...orderData.deliveryAddress, state: e.target.value } })} required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Notes (optional)</label>
                                        <textarea className="form-textarea" placeholder="Any special requirements..."
                                            value={orderData.notes} onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })} />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowOrder(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary">Place Order</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropDetailPage;
