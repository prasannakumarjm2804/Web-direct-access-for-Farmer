import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { FiTrendingUp, FiTrendingDown, FiActivity } from 'react-icons/fi';
import './PriceChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const PriceChart = ({ cropName = 'Wheat', priceHistory = [] }) => {
    const [timeRange, setTimeRange] = useState('7d');
    const [chartType, setChartType] = useState('line');

    // Mock data - in production, this would come from API
    const mockData = {
        '7d': {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            prices: [28, 29, 28.5, 30, 31, 30.5, 32],
            volumes: [120, 150, 130, 180, 200, 170, 190]
        },
        '30d': {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            prices: [26, 28, 30, 32],
            volumes: [450, 520, 580, 620]
        },
        '90d': {
            labels: ['Month 1', 'Month 2', 'Month 3'],
            prices: [24, 28, 32],
            volumes: [1800, 2100, 2400]
        }
    };

    const currentData = mockData[timeRange];

    const chartData = {
        labels: currentData.labels,
        datasets: [
            {
                label: 'Price (₹/kg)',
                data: currentData.prices,
                borderColor: '#16a34a',
                backgroundColor: (context) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(22, 163, 74, 0.3)');
                    gradient.addColorStop(1, 'rgba(22, 163, 74, 0)');
                    return gradient;
                },
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointHoverRadius: 8,
                pointBackgroundColor: '#16a34a',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverBackgroundColor: '#15803d',
                pointHoverBorderColor: '#fff'
            }
        ]
    };

    const barChartData = {
        labels: currentData.labels,
        datasets: [
            {
                label: 'Trading Volume (tons)',
                data: currentData.volumes,
                backgroundColor: 'rgba(22, 163, 74, 0.6)',
                borderColor: '#16a34a',
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: 'rgba(22, 163, 74, 0.8)'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: (context) => `₹${context.raw.toFixed(2)}/kg`
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#a8a29e',
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    color: '#a8a29e',
                    font: {
                        size: 12
                    },
                    callback: (value) => `₹${value}`
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    const barOptions = {
        ...options,
        scales: {
            ...options.scales,
            y: {
                ...options.scales.y,
                ticks: {
                    ...options.scales.y.ticks,
                    callback: (value) => `${value}t`
                }
            }
        },
        plugins: {
            ...options.plugins,
            tooltip: {
                ...options.plugins.tooltip,
                callbacks: {
                    label: (context) => `${context.raw} tons`
                }
            }
        }
    };

    const currentPrice = currentData.prices[currentData.prices.length - 1];
    const previousPrice = currentData.prices[currentData.prices.length - 2];
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);
    const isPositive = priceChange >= 0;

    const stats = [
        { label: 'Current Price', value: `₹${currentPrice.toFixed(2)}`, icon: <FiActivity /> },
        { label: 'Change', value: `${isPositive ? '+' : ''}${priceChangePercent}%`, icon: isPositive ? <FiTrendingUp /> : <FiTrendingDown /> },
        { label: 'Volume', value: `${currentData.volumes[currentData.volumes.length - 1]}t`, icon: <FiActivity /> }
    ];

    return (
        <div className="price-chart">
            <div className="chart-header">
                <div className="chart-title">
                    <h3>{cropName} Price Trends</h3>
                    <span className="chart-subtitle">Real-time market data</span>
                </div>
                <div className="chart-controls">
                    <div className="time-range-selector">
                        {['7d', '30d', '90d'].map(range => (
                            <button
                                key={range}
                                className={`range-btn ${timeRange === range ? 'active' : ''}`}
                                onClick={() => setTimeRange(range)}
                            >
                                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                            </button>
                        ))}
                    </div>
                    <div className="chart-type-selector">
                        <button
                            className={`type-btn ${chartType === 'line' ? 'active' : ''}`}
                            onClick={() => setChartType('line')}
                            title="Line Chart"
                        >
                            📈
                        </button>
                        <button
                            className={`type-btn ${chartType === 'bar' ? 'active' : ''}`}
                            onClick={() => setChartType('bar')}
                            title="Bar Chart"
                        >
                            📊
                        </button>
                    </div>
                </div>
            </div>

            <div className="chart-stats">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.label}</span>
                            <span className={`stat-value ${isPositive ? 'positive' : 'negative'}`}>
                                {stat.value}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chart-container">
                {chartType === 'line' ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <Bar data={barChartData} options={barOptions} />
                )}
            </div>

            <div className="chart-footer">
                <div className="chart-insights">
                    <span className="insight-label">💡 Market Insight:</span>
                    <span className="insight-text">
                        {isPositive 
                            ? `Prices trending upward. Good time for farmers to sell.`
                            : `Prices trending downward. Consider holding for better rates.`
                        }
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PriceChart;
