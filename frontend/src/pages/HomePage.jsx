import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowRight, FiShield, FiDollarSign, FiTruck,
    FiUsers, FiTrendingUp, FiGlobe, FiSmartphone,
    FiCheckCircle, FiStar
} from 'react-icons/fi';
import { GiWheat, GiFarmer, GiFruitBowl, GiCorn } from 'react-icons/gi';
import './HomePage.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
    }),
};

const HomePage = () => {
    const stats = [
        { icon: <GiFarmer />, value: '50,000+', label: 'Farmers Connected', color: 'gradient-green' },
        { icon: <FiUsers />, value: '12,000+', label: 'Active Buyers', color: 'gradient-amber' },
        { icon: <FiTrendingUp />, value: '₹120Cr+', label: 'Trade Volume', color: 'gradient-blue' },
        { icon: <FiGlobe />, value: '28', label: 'States Covered', color: 'gradient-purple' },
    ];

    const features = [
        {
            icon: <FiDollarSign />,
            title: 'Fair Pricing',
            desc: 'AI-powered price suggestions and live mandi rates ensure farmers get the best market price for their produce.',
            color: '#16a34a',
        },
        {
            icon: <FiShield />,
            title: 'Secure Payments',
            desc: 'Escrow-based UPI payments protect both parties. Money is released only after delivery confirmation.',
            color: '#3b82f6',
        },
        {
            icon: <FiTruck />,
            title: 'Integrated Logistics',
            desc: 'Book logistics partners, track shipments in real-time, and manage cold-storage requirements.',
            color: '#f59e0b',
        },
        {
            icon: <FiSmartphone />,
            title: 'Mobile First',
            desc: 'Works on low-bandwidth networks. Voice instructions and regional language support for rural users.',
            color: '#8b5cf6',
        },
    ];

    const crops = [
        { name: 'Rice & Grains', icon: <GiWheat />, count: '2,400+' },
        { name: 'Fruits', icon: <GiFruitBowl />, count: '1,800+' },
        { name: 'Vegetables', icon: <GiCorn />, count: '3,200+' },
        { name: 'Spices', icon: <GiWheat />, count: '900+' },
    ];

    const testimonials = [
        {
            name: 'Rajesh Kumar',
            role: 'Farmer, Punjab',
            text: 'AgriConnect helped me sell my wheat at 20% higher than mandi price. Direct buyers mean no middlemen cutting my profits!',
            rating: 5,
        },
        {
            name: 'Priya Sharma',
            role: 'Wholesaler, Delhi',
            text: 'I source fresh produce directly from verified farmers. The quality is amazing and the escrow payments give me peace of mind.',
            rating: 5,
        },
        {
            name: 'Anitha Devi',
            role: 'Farmer, Tamil Nadu',
            text: 'The app works even on my basic phone. Voice support in Tamil makes it so easy. My organic rice now reaches buyers across India!',
            rating: 5,
        },
    ];

    return (
        <div className="home-page">
            {/* ─── Hero Section ──────────────────────────────── */}
            <section className="hero-section">
                <div className="hero-bg-pattern" />
                <div className="hero-gradient-orb hero-orb-1" />
                <div className="hero-gradient-orb hero-orb-2" />

                <div className="container">
                    <div className="hero-content">
                        <motion.div className="hero-text" initial="hidden" animate="visible" variants={fadeUp}>
                            <motion.div className="hero-badge" variants={fadeUp} custom={0}>
                                <GiWheat /> India's #1 Farmer Direct Marketplace
                            </motion.div>

                            <motion.h1 className="hero-title" variants={fadeUp} custom={1}>
                                Connecting <span className="text-gradient">Farmers</span> Directly
                                with <span className="text-gradient">Buyers</span>
                            </motion.h1>

                            <motion.p className="hero-subtitle" variants={fadeUp} custom={2}>
                                Eliminate middlemen. Get fair prices. Sell directly to wholesalers,
                                exporters, and retailers across India with secure digital payments
                                and integrated logistics.
                            </motion.p>

                            <motion.div className="hero-ctas" variants={fadeUp} custom={3}>
                                <Link to="/register" className="btn btn-primary btn-lg">
                                    Start Selling <FiArrowRight />
                                </Link>
                                <Link to="/marketplace" className="btn btn-secondary btn-lg">
                                    Browse Marketplace
                                </Link>
                            </motion.div>

                            <motion.div className="hero-trust" variants={fadeUp} custom={4}>
                                <div className="trust-avatars">
                                    {['R', 'A', 'S', 'P', 'M'].map((letter, i) => (
                                        <div key={i} className="trust-avatar" style={{ zIndex: 5 - i }}>
                                            {letter}
                                        </div>
                                    ))}
                                </div>
                                <div className="trust-text">
                                    <div className="trust-stars">
                                        {[1, 2, 3, 4, 5].map(i => <FiStar key={i} />)}
                                    </div>
                                    <span>Trusted by 50,000+ farmers across India</span>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="hero-visual"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <div className="hero-card-stack">
                                <div className="hero-float-card card-1">
                                    <div className="float-icon gradient-green">🌾</div>
                                    <div>
                                        <p className="float-label">Wheat Listed</p>
                                        <p className="float-value">₹32/kg • 8,000 kg</p>
                                    </div>
                                </div>
                                <div className="hero-float-card card-2">
                                    <div className="float-icon gradient-amber">💰</div>
                                    <div>
                                        <p className="float-label">Payment Received</p>
                                        <p className="float-value">₹2,56,000 via UPI</p>
                                    </div>
                                </div>
                                <div className="hero-float-card card-3">
                                    <div className="float-icon gradient-blue">🚚</div>
                                    <div>
                                        <p className="float-label">In Transit</p>
                                        <p className="float-value">Ludhiana → Delhi</p>
                                    </div>
                                </div>
                                <div className="hero-illustration">
                                    <div className="illustration-circle">
                                        <span className="illustration-emoji">🌾</span>
                                        <span className="illustration-emoji emoji-2">🥕</span>
                                        <span className="illustration-emoji emoji-3">🍇</span>
                                        <span className="illustration-emoji emoji-4">🌶️</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── Stats Bar ─────────────────────────────────── */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                className="stat-item"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className={`stat-icon-box ${stat.color}`}>{stat.icon}</div>
                                <div>
                                    <h3>{stat.value}</h3>
                                    <p>{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ──────────────────────────────── */}
            <section className="how-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Simple Process</span>
                        <h2>How AgriConnect Works</h2>
                        <p>From farm to buyer in just 4 easy steps</p>
                    </div>

                    <div className="steps-grid">
                        {[
                            { step: '01', title: 'List Your Crop', desc: 'Add crop details, photos, quantity, and expected price. Get AI price suggestions.', emoji: '📝' },
                            { step: '02', title: 'Connect with Buyers', desc: 'Buyers browse, search & negotiate directly. Accept or counter offers in real-time.', emoji: '🤝' },
                            { step: '03', title: 'Secure Payment', desc: 'Buyer pays via UPI. Money held in escrow until delivery is confirmed.', emoji: '🔒' },
                            { step: '04', title: 'Deliver & Earn', desc: 'Book logistics or arrange pickup. Payment released automatically on delivery.', emoji: '🚀' },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                className="step-card"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15 }}
                            >
                                <div className="step-number">{item.step}</div>
                                <div className="step-emoji">{item.emoji}</div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features ──────────────────────────────────── */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Why AgriConnect</span>
                        <h2>Built for Indian Farmers</h2>
                        <p>Technology that understands rural India's needs</p>
                    </div>

                    <div className="features-grid">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="feature-card card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="feature-icon" style={{ background: `${feature.color}15`, color: feature.color }}>
                                    {feature.icon}
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Categories ────────────────────────────────── */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Browse</span>
                        <h2>Popular Categories</h2>
                        <p>Thousands of listings across India</p>
                    </div>

                    <div className="categories-grid">
                        {crops.map((crop, i) => (
                            <motion.div
                                key={i}
                                className="category-card"
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -4 }}
                            >
                                <Link to="/marketplace">
                                    <div className="category-icon">{crop.icon}</div>
                                    <h3>{crop.name}</h3>
                                    <p>{crop.count} listings</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Testimonials ──────────────────────────────── */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2>Farmers & Buyers Love Us</h2>
                        <p>Real stories from real people</p>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="testimonial-card card"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <FiStar key={j} className="star-filled" />
                                    ))}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <p className="testimonial-name">{t.name}</p>
                                        <p className="testimonial-role">{t.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ───────────────────────────────── */}
            <section className="cta-section">
                <div className="container">
                    <motion.div
                        className="cta-card"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2>Ready to Transform Your Farm Business?</h2>
                        <p>Join 50,000+ farmers who are earning more with AgriConnect. Free registration, zero listing fee.</p>
                        <div className="cta-btns">
                            <Link to="/register" className="btn btn-primary btn-lg">
                                Register as Farmer <FiArrowRight />
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
                                Register as Buyer
                            </Link>
                        </div>
                        <div className="cta-features">
                            {['No Middlemen', 'Free Listing', 'Secure Payments', 'Pan India Delivery'].map((f, i) => (
                                <span key={i}><FiCheckCircle /> {f}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
