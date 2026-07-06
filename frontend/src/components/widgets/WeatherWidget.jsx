import React, { useState, useEffect } from 'react';
import { FiCloud, FiSun, FiCloudRain, FiWind, FiDroplet, FiThermometer } from 'react-icons/fi';
import './WeatherWidget.css';

const WeatherWidget = ({ location = 'Delhi' }) => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Simulated weather data (in production, use a real weather API)
        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Mock weather data
                const mockWeather = {
                    location: location,
                    temperature: 32,
                    condition: 'Sunny',
                    humidity: 65,
                    windSpeed: 12,
                    feelsLike: 35,
                    forecast: [
                        { day: 'Today', temp: 32, condition: 'Sunny' },
                        { day: 'Tomorrow', temp: 30, condition: 'Cloudy' },
                        { day: 'Wed', temp: 28, condition: 'Rain' },
                    ]
                };
                
                setWeather(mockWeather);
            } catch (err) {
                setError('Failed to fetch weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    const getWeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
            case 'sunny':
                return <FiSun />;
            case 'cloudy':
                return <FiCloud />;
            case 'rain':
                return <FiCloudRain />;
            default:
                return <FiSun />;
        }
    };

    const getFarmingTip = (weather) => {
        if (weather.condition === 'Rain') {
            return 'Good day for planting! Ensure proper drainage.';
        } else if (weather.temperature > 35) {
            return 'High temperature - increase irrigation frequency.';
        } else if (weather.humidity > 80) {
            return 'High humidity - watch for fungal diseases.';
        } else {
            return 'Ideal conditions for most crops.';
        }
    };

    if (loading) {
        return (
            <div className="weather-widget weather-loading">
                <div className="weather-skeleton">
                    <div className="skeleton-icon" />
                    <div className="skeleton-temp" />
                    <div className="skeleton-details" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="weather-widget weather-error">
                <FiCloud />
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="weather-widget">
            <div className="weather-header">
                <div className="weather-location">
                    <FiCloud />
                    <span>{weather.location}</span>
                </div>
                <div className="weather-condition">
                    {getWeatherIcon(weather.condition)}
                    <span>{weather.condition}</span>
                </div>
            </div>

            <div className="weather-main">
                <div className="weather-temp">
                    <FiThermometer />
                    <span className="temp-value">{weather.temperature}°C</span>
                </div>
                <div className="weather-details">
                    <div className="weather-detail">
                        <FiDroplet />
                        <span>{weather.humidity}%</span>
                    </div>
                    <div className="weather-detail">
                        <FiWind />
                        <span>{weather.windSpeed} km/h</span>
                    </div>
                </div>
            </div>

            <div className="weather-tip">
                <span className="tip-label">💡 Farming Tip:</span>
                <span className="tip-text">{getFarmingTip(weather)}</span>
            </div>

            <div className="weather-forecast">
                {weather.forecast.map((day, index) => (
                    <div key={index} className="forecast-item">
                        <span className="forecast-day">{day.day}</span>
                        <span className="forecast-icon">{getWeatherIcon(day.condition)}</span>
                        <span className="forecast-temp">{day.temp}°</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherWidget;
