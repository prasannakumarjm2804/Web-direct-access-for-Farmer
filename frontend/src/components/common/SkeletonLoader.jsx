import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'card', count = 1 }) => {
    const renderSkeleton = () => {
        switch (type) {
            case 'card':
                return (
                    <div className="skeleton-card">
                        <div className="skeleton-image" />
                        <div className="skeleton-content">
                            <div className="skeleton-title" />
                            <div className="skeleton-text" />
                            <div className="skeleton-text short" />
                        </div>
                    </div>
                );
            case 'list':
                return (
                    <div className="skeleton-list">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-list-content">
                            <div className="skeleton-title" />
                            <div className="skeleton-text" />
                        </div>
                    </div>
                );
            case 'stat':
                return (
                    <div className="skeleton-stat">
                        <div className="skeleton-icon" />
                        <div className="skeleton-stat-content">
                            <div className="skeleton-value" />
                            <div className="skeleton-label" />
                        </div>
                    </div>
                );
            case 'table':
                return (
                    <div className="skeleton-table-row">
                        <div className="skeleton-cell" />
                        <div className="skeleton-cell" />
                        <div className="skeleton-cell" />
                        <div className="skeleton-cell" />
                    </div>
                );
            case 'text':
                return (
                    <div className="skeleton-text-block">
                        <div className="skeleton-title" />
                        <div className="skeleton-text" />
                        <div className="skeleton-text" />
                        <div className="skeleton-text short" />
                    </div>
                );
            default:
                return <div className="skeleton-default" />;
        }
    };

    return (
        <div className="skeleton-wrapper">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="skeleton-item">
                    {renderSkeleton()}
                </div>
            ))}
        </div>
    );
};

export default SkeletonLoader;
