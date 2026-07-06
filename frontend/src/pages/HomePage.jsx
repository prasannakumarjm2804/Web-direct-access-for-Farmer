import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    FiArrowRight, FiShield, FiDollarSign, FiTruck,
    FiUsers, FiTrendingUp, FiGlobe, FiSmartphone,
    FiCheckCircle, FiStar, FiBarChart2, FiLock
} from 'react-icons/fi';
import { GiWheat, GiFarmer, GiFruitBowl, GiCorn, GiChiliPepper, GiGrain } from 'react-icons/gi';
import './HomePage.css';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: (i = 0) => ({
        opacity: 1, scale: 1,
        transition: { delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    }),
};

const HomePage = () => {
    const stats = [
        { icon: <GiFarmer />, value: '50,000+', label: 'Farmers Connected', color: 'gradient-green' },
        { icon: <FiUsers />, value: '12,000+', label: 'Active Buyers', color: 'gradient-amber' },
        { icon: <FiBarChart2 />, value: '₹120Cr+', label: 'Trade Volume', color: 'gradient-blue' },
        { icon: <FiGlobe />, value: '28 States', label: 'Pan India Reach', color: 'gradient-purple' },
    ];

    const features = [
        {
            icon: <FiDollarSign />,
            title: 'Fair Pricing',
            desc: 'AI-powered price suggestions and live mandi rates ensure farmers get the best market price.',
            color: '#16a34a',
            gradient: 'linear-gradient(135deg,#16a34a,#15803d)',
        },
        {
            icon: <FiLock />,
            title: 'Secure Payments',
            desc: 'Escrow-based UPI payments protect both parties. Money releases only after delivery confirmation.',
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg,#3b82f6,#2563eb)',
        },
        {
            icon: <FiTruck />,
            title: 'Integrated Logistics',
            desc: 'Book logistics partners, track shipments in real-time, and manage cold-storage needs seamlessly.',
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg,#f59e0b,#d97706)',
        },
        {
            icon: <FiSmartphone />,
            title: 'Mobile First',
            desc: 'Works on low-bandwidth networks. Voice instructions and regional language support built-in.',
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg,#8b5cf6,#7c3aed)',
        },
    ];

    const crops = [
        { name: 'Grains & Rice', icon: <GiWheat />, count: '2,400+ listings', link: '/marketplace?category=grains' },
        { name: 'Fresh Fruits', icon: <GiFruitBowl />, count: '1,800+ listings', link: '/marketplace?category=fruits' },
        { name: 'Vegetables', icon: <GiCorn />, count: '3,200+ listings', link: '/marketplace?category=vegetables' },
        { name: 'Spices', icon: <GiChiliPepper />, count: '900+ listings', link: '/marketplace?category=spices' },
        { name: 'Pulses', icon: <GiGrain />, count: '1,400+ listings', link: '/marketplace?category=pulses' },
        { name: 'Oilseeds', icon: <GiWheat />, count: '700+ listings', link: '/marketplace?category=oilseeds' },
        { name: 'Cotton', icon: <GiWheat />, count: '450+ listings', link: '/marketplace?category=cotton' },
        { name: 'All Produce', icon: <GiWheat />, count: '10,000+', link: '/marketplace' },
    ];

    const testimonials = [
        {
            name: 'Rajesh Kumar', role: 'Wheat Farmer, Punjab',
            text: 'AgriConnect helped me sell my wheat at 20% higher than mandi price. Direct buyers mean no middlemen cutting my profits!',
            rating: 5,
        },
        {
            name: 'Priya Sharma', role: 'Wholesaler, Delhi',
            text: 'I source fresh produce directly from verified farmers. The quality is amazing and the escrow payments give me complete peace of mind.',
            rating: 5,
        },
        {
            name: 'Anitha Devi', role: 'Organic Farmer, Tamil Nadu',
            text: 'The app works even on my basic phone. Voice support in Tamil makes it so easy. My organic rice now reaches buyers across India!',
            rating: 5,
        },
    ];

    const trustBadges = [
        { icon: <FiShield />, label: 'Verified Farmers' },
        { icon: <FiLock />, label: 'Escrow Protected' },
        { icon: <FiCheckCircle />, label: 'Quality Assured' },
        { icon: <FiTrendingUp />, label: 'Best Prices' },
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
                                <GiWheat /> 🇮🇳 India's #1 Farmer Direct Marketplace
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
                                    Start Selling Free <FiArrowRight />
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
                            initial={{ opacity: 0, scale: 0.9, x: 40 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
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
                                        <p className="float-label">Order Received</p>
                                        <p className="float-value">₹2.56 Lakh</p>
                                    </div>
                                </div>
                                <div className="hero-float-card card-3">
                                    <div className="float-icon gradient-blue">📦</div>
                                    <div>
                                        <p className="float-label">Shipment</p>
                                        <p className="float-value">In Transit</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ─── Trust Badges ──────────────────────────────── */}
            <section style={{ padding: '28px 0', background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
                        {trustBadges.map((b, i) => (
                            <motion.div key={i}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600' }}
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 + 0.5 }}>
                                <span style={{ color: 'var(--primary)', fontSize: '18px' }}>{b.icon}</span>
                                {b.label}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Stats Section ─────────────────────────────── */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                className="stat-item"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleIn}
                                custom={i}
                            >
                                <div className={`stat-item-icon ${s.color}`} style={{ fontSize: '28px' }}>
                                    {s.icon}
                                </div>
                                <div className="stat-item-value">{s.value}</div>
                                <div className="stat-item-label">{s.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Features Section ──────────────────────────── */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Why AgriConnect</span>
                        <h2>Everything a Farmer Needs to Succeed</h2>
                        <p>Built specifically for India's agricultural ecosystem — from paddy fields to packaging houses.</p>
                    </div>
                    <div className="features-grid">
                        {features.map((f, i) => (
                            <motion.div
                                key={i}
                                className="feature-card"
                                style={{ '--feature-color': f.gradient }}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -8 }}
                            >
                                <div className="feature-icon" style={{ background: f.gradient }}>
                                    {f.icon}
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── Categories Section ─────────────────────────── */}
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Browse by Category</span>
                        <h2>Farm Fresh Produce, Every Kind</h2>
                        <p>From staple grains to exotic spices — find everything you need, direct from the source.</p>
                    </div>
                    <div className="categories-grid">
                        {crops.map((c, i) => (
                            <motion.div
                                key={i}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={scaleIn}
                                custom={i}
                            >
                                <Link to={c.link} className="category-card">
                                    <div className="category-icon-wrap">{c.icon}</div>
                                    <h3>{c.name}</h3>
                                    <span className="category-count">{c.count}</span>
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
                        <span className="section-badge">Success Stories</span>
                        <h2>Farmers & Buyers Love Us</h2>
                        <p>Real stories from real farmers and buyers across India who transformed their business.</p>
                    </div>
                    <div className="testimonials-grid">
                        {testimonials.map((t, i) => (
                            <motion.div
                                key={i}
                                className="testimonial-card"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeUp}
                                custom={i}
                                whileHover={{ y: -4 }}
                            >
                                <div className="testimonial-stars">
                                    {Array(t.rating).fill(0).map((_, j) => <FiStar key={j} />)}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-role">{t.role}</div>
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
                    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        Ready to Transform Your Farm Business?
                    </motion.h2>
                    <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
                        Join 50,000+ farmers already selling directly and earning 20-40% more than mandi prices.
                    </motion.p>
                    <motion.div className="cta-buttons" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
                        <Link to="/register" className="btn btn-white btn-lg">
                            Register as Farmer <FiArrowRight />
                        </Link>
                        <Link to="/marketplace" className="btn btn-outline-white btn-lg">
                            Explore Marketplace
                        </Link>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
