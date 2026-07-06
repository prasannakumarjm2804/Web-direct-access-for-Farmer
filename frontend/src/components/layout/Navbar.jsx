import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { setLanguage } from '../../store/slices/uiSlice';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiPlus, FiPackage, FiSearch, FiGlobe } from 'react-icons/fi';
import { GiWheat } from 'react-icons/gi';
import ThemeToggle from '../common/ThemeToggle';
import NotificationPanel from '../notifications/NotificationPanel';
import './Navbar.css';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [languageOpen, setLanguageOpen] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { language } = useSelector((state) => state.ui);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const languages = [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
        { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
        { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
        { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
            setSearchQuery('');
            setSearchOpen(false);
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
        setProfileOpen(false);
    };

    const getDashboardLink = () => {
        if (!user) return '/';
        switch (user.role) {
            case 'farmer': return '/farmer/dashboard';
            case 'buyer': return '/buyer/dashboard';
            case 'admin': return '/admin/dashboard';
            default: return '/';
        }
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                {/* Logo */}
                <Link to="/" className="nav-logo">
                    <div className="logo-icon">
                        <GiWheat />
                    </div>
                    <div className="logo-text">
                        <span className="logo-name">AgriConnect</span>
                        <span className="logo-tagline">Direct Market Access</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="nav-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/marketplace" className="nav-link">Marketplace</Link>
                    <Link to="/community" className="nav-link">Community</Link>
                    <Link to="/loans" className="nav-link">Loans</Link>
                    <Link to="/export" className="nav-link">Export</Link>
                    <Link to="/about" className="nav-link">About</Link>
                </div>

                {/* Right Section */}
                <div className="nav-actions">
                    {/* Search */}
                    <div className="nav-search-wrapper">
                        {searchOpen && (
                            <form className="nav-search-form" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    placeholder="Search crops, farmers..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button type="submit" className="search-submit">
                                    <FiSearch />
                                </button>
                            </form>
                        )}
                        <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)} title="Search">
                            <FiSearch />
                        </button>
                    </div>

                    {/* Language Selector */}
                    <div className="nav-language-wrapper">
                        <button
                            className="nav-icon-btn"
                            onClick={() => setLanguageOpen(!languageOpen)}
                            title="Change Language"
                        >
                            <FiGlobe />
                            <span className="language-code">{language.toUpperCase()}</span>
                        </button>

                        {languageOpen && (
                            <div className="nav-dropdown language-dropdown">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="dropdown-item"
                                        onClick={() => {
                                            dispatch(setLanguage(lang.code));
                                            setLanguageOpen(false);
                                        }}
                                    >
                                        <span className="lang-flag">{lang.flag}</span>
                                        <span className="lang-name">{lang.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {isAuthenticated ? (
                        <>
                            {user?.role === 'farmer' && (
                                <Link to="/farmer/add-crop" className="btn btn-accent btn-sm nav-cta">
                                    <FiPlus /> List Crop
                                </Link>
                            )}

                            <NotificationPanel />

                            <div className="nav-profile-wrapper">
                                <button
                                    className="nav-profile-btn"
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    <div className="nav-avatar">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="nav-username">{user?.name?.split(' ')[0]}</span>
                                </button>

                                {profileOpen && (
                                    <div className="nav-dropdown">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {user?.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="dropdown-name">{user?.name}</p>
                                                <p className="dropdown-role">{user?.role}</p>
                                            </div>
                                        </div>
                                        <div className="dropdown-divider" />
                                        <Link to={getDashboardLink()} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                            <FiGrid /> Dashboard
                                        </Link>
                                        <Link to="/orders" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                            <FiPackage /> Orders
                                        </Link>
                                        <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                                            <FiUser /> Profile
                                        </Link>
                                        <div className="dropdown-divider" />
                                        <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="nav-auth-btns">
                            <Link to="/login" className="btn btn-secondary btn-sm">Log In</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                        </div>
                    )}

                    {/* Mobile Toggle */}
                    <button className="nav-mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="nav-mobile-menu">
                    <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Home</Link>
                    <Link to="/marketplace" className="mobile-link" onClick={() => setMobileOpen(false)}>Marketplace</Link>
                    <Link to="/about" className="mobile-link" onClick={() => setMobileOpen(false)}>About</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to={getDashboardLink()} className="mobile-link" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                            <Link to="/orders" className="mobile-link" onClick={() => setMobileOpen(false)}>Orders</Link>
                            <Link to="/profile" className="mobile-link" onClick={() => setMobileOpen(false)}>Profile</Link>
                            <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <div className="mobile-auth">
                            <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>Log In</Link>
                            <Link to="/register" className="btn btn-primary" onClick={() => setMobileOpen(false)}>Get Started</Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
