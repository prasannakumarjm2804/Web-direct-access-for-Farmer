import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTarget, FiUsers, FiHeart, FiGlobe, FiArrowRight, FiShield, FiSmartphone, FiTrendingUp } from 'react-icons/fi';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page page-wrapper">
            {/* Hero */}
            <section className="about-hero">
                <div className="container">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <span className="section-badge">Our Mission</span>
                        <h1>Empowering India's Farmers<br />Through <span className="text-gradient">Technology</span></h1>
                        <p>AgriConnect is India's farmer-first digital marketplace that eliminates middlemen and connects farmers directly with buyers nationwide.</p>
                    </motion.div>
                </div>
            </section>

            {/* Problem-Solution */}
            <section className="about-section">
                <div className="container">
                    <div className="ps-grid">
                        <div className="ps-card problem">
                            <h2>❌ The Problem</h2>
                            <ul>
                                <li>Farmers earn only 15-25% of the final consumer price</li>
                                <li>Multiple middlemen (arthiyas) extract most of the profit</li>
                                <li>No access to fair market pricing or quality buyers</li>
                                <li>Delayed payments, sometimes weeks or months</li>
                                <li>Limited logistics options and post-harvest losses</li>
                            </ul>
                        </div>
                        <div className="ps-card solution">
                            <h2>✅ Our Solution</h2>
                            <ul>
                                <li>Direct farmer-to-buyer connections, no middlemen</li>
                                <li>AI-powered fair price suggestions using market data</li>
                                <li>Escrow-based secure digital payments via UPI</li>
                                <li>Integrated logistics with real-time tracking</li>
                                <li>Mobile-first design for rural India</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="about-section values-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Our Values</span>
                        <h2>What Drives Us</h2>
                    </div>
                    <div className="values-grid">
                        {[
                            { icon: <FiHeart />, title: 'Farmer First', desc: 'Every decision we make puts the farmer\'s interest first.' },
                            { icon: <FiShield />, title: 'Trust & Transparency', desc: 'Verified profiles, escrow payments, and quality grades.' },
                            { icon: <FiSmartphone />, title: 'Accessible Technology', desc: 'Works on basic phones, regional languages, low bandwidth.' },
                            { icon: <FiTrendingUp />, title: 'Fair Economics', desc: 'Farmers earn 20-40% more than traditional mandi selling.' },
                            { icon: <FiGlobe />, title: 'Pan India Reach', desc: 'Connecting farmers from 28 states with buyers nationwide.' },
                            { icon: <FiUsers />, title: 'Community Driven', desc: 'Building a community that supports and empowers farmers.' },
                        ].map((v, i) => (
                            <motion.div key={i} className="value-card card" initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <div className="value-icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Numbers */}
            <section className="impact-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Impact</span>
                        <h2>Our Impact in Numbers</h2>
                    </div>
                    <div className="impact-grid">
                        {[
                            { value: '50,000+', label: 'Farmers Onboarded' },
                            { value: '₹120Cr+', label: 'Trade Volume' },
                            { value: '28', label: 'States Covered' },
                            { value: '25%', label: 'Avg Income Increase' },
                        ].map((item, i) => (
                            <motion.div key={i} className="impact-item" initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                                <h3>{item.value}</h3>
                                <p>{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="about-cta">
                <div className="container">
                    <h2>Join the Movement</h2>
                    <p>Be part of India's agricultural revolution. Together, we can ensure every farmer gets a fair deal.</p>
                    <div className="about-cta-btns">
                        <Link to="/register" className="btn btn-primary btn-lg">Join as Farmer <FiArrowRight /></Link>
                        <Link to="/register" className="btn btn-secondary btn-lg">Join as Buyer</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default AboutPage;
