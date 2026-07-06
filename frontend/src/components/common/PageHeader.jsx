import React from 'react';
import { motion } from 'framer-motion';
import './PageHeader.css';

const PageHeader = ({ badge, title, subtitle, children, variant = 'default', icon }) => {
    return (
        <motion.header
            className={`page-header page-header--${variant}`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
        >
            <div className="page-header-inner">
                <div className="page-header-text">
                    {badge && <span className="page-header-badge">{badge}</span>}
                    <h1 className="page-header-title">
                        {icon && <span className="page-header-icon">{icon}</span>}
                        {title}
                    </h1>
                    {subtitle && <p className="page-header-subtitle">{subtitle}</p>}
                </div>
                {children && <div className="page-header-actions">{children}</div>}
            </div>
        </motion.header>
    );
};

export default PageHeader;
