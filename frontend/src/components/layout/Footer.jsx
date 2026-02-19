import React from 'react';
import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wave">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
                    <path d="M0,40 C360,100 720,0 1080,60 C1260,90 1380,40 1440,40 L1440,120 L0,120 Z" fill="currentColor" />
                </svg>
            </div>

            <div className="footer-content">
                <div className="container">
                    <div className="footer-grid">
                        {/* Brand */}
                        <div className="footer-brand">
                            <div className="footer-logo">
                                <div className="logo-icon"><GiWheat /></div>
                                <span className="logo-name">AgriConnect</span>
                            </div>
                            <p className="footer-desc">
                                India's farmer-first digital marketplace connecting farmers directly
                                with buyers. Fair prices, transparent transactions, and empowering
                                rural India through technology.
                            </p>
                            <div className="footer-contact">
                                <span><FiPhone /> 1800-AGRI-CONNECT</span>
                                <span><FiMail /> support@agriconnect.in</span>
                                <span><FiMapPin /> New Delhi, India</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-links-group">
                            <h4>Platform</h4>
                            <Link to="/marketplace">Marketplace</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/register">Farmer Registration</Link>
                            <Link to="/register">Buyer Registration</Link>
                        </div>

                        <div className="footer-links-group">
                            <h4>Resources</h4>
                            <a href="#">Mandi Prices</a>
                            <a href="#">Weather Forecast</a>
                            <a href="#">Government Schemes</a>
                            <a href="#">Farming Tips</a>
                        </div>

                        <div className="footer-links-group">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">FAQs</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <p>© 2026 AgriConnect. Made with ❤️ for Indian Farmers. Supporting Digital India & AtmaNirbhar Bharat.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
