import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FaChartLine, FaSearch } from 'react-icons/fa';
import api from '../../services/api';
import './PriceForecastWidget.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PriceForecastWidget = () => {
    const [crop, setCrop] = useState('');
    const [location, setLocation] = useState('');
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handlePredict = async () => {
        if (!crop || !location) return;
        setLoading(true);
        try {
            const res = await api.post('/ai/predict-price', { cropName: crop, location, variety: 'generic' });
            setForecastData(res.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = {
        labels: ['Today', '7 Days', '15 Days', '30 Days'],
        datasets: [
            {
                label: `Price Forecast for ${crop}`,
                data: forecastData ? [
                    forecastData.current,
                    forecastData.forecast[0].price,
                    forecastData.forecast[1].price,
                    forecastData.forecast[2].price
                ] : [],
                borderColor: '#16a34a',
                backgroundColor: 'rgba(22, 163, 74, 0.2)',
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: false },
        },
    };

    return (
        <div className="price-forecast-widget">
            <div className="widget-header">
                <h3><FaChartLine /> AI Price Predictor</h3>
            </div>
            <div className="widget-controls">
                <input
                    type="text"
                    placeholder="Crop (e.g. Wheat)"
                    value={crop}
                    onChange={e => setCrop(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="District"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                />
                <button onClick={handlePredict} disabled={loading}>
                    {loading ? 'Analyzing...' : <FaSearch />}
                </button>
            </div>

            {forecastData && (
                <div className="forecast-result">
                    <div className="current-price">
                        <span>Current Price:</span>
                        <strong>₹{forecastData.current}/q</strong>
                    </div>
                    <div className="advisory-box">
                        <p>💡 {forecastData.advisory}</p>
                    </div>
                    <div className="chart-container">
                        <Line data={chartData} options={options} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriceForecastWidget;
