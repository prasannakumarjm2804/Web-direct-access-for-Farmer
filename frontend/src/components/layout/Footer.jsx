import React from 'react';
import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiLinkedin, FiArrowUp } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const socialLinks = [
        { icon: <FiFacebook />, name: 'Facebook', href: '#' },
        { icon: <FiTwitter />, name: 'Twitter', href: '#' },
        { icon: <FiInstagram />, name: 'Instagram', href: '#' },
        { icon: <FiYoutube />, name: 'YouTube', href: '#' },
        { icon: <FiLinkedin />, name: 'LinkedIn', href: '#' }
    ];

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
                            <div className="footer-social">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="social-link"
                                        title={social.name}
                                        aria-label={social.name}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="footer-links-group">
                            <h4>Platform</h4>
                            <Link to="/marketplace">Marketplace</Link>
                            <Link to="/about">About Us</Link>
                            <Link to="/register">Farmer Registration</Link>
                            <Link to="/register">Buyer Registration</Link>
                            <Link to="/community">Community</Link>
                        </div>

                        <div className="footer-links-group">
                            <h4>Resources</h4>
                            <a href="#">Mandi Prices</a>
                            <a href="#">Weather Forecast</a>
                            <a href="#">Government Schemes</a>
                            <a href="#">Farming Tips</a>
                            <a href="#">Crop Calendar</a>
                        </div>

                        <div className="footer-links-group">
                            <h4>Support</h4>
                            <a href="#">Help Center</a>
                            <a href="#">FAQs</a>
                            <a href="#">Terms of Service</a>
                            <a href="#">Privacy Policy</a>
                            <a href="#">Contact Us</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container">
                    <div className="footer-bottom-content">
                        <p>© 2026 AgriConnect. Made with ❤️ for Indian Farmers. Supporting Digital India & AtmaNirbhar Bharat.</p>
                        <button className="scroll-top-btn" onClick={scrollToTop} title="Back to top">
                            <FiArrowUp />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
