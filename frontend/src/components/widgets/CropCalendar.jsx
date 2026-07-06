import React, { useState } from 'react';
import { FiCalendar, FiSun, FiCloudRain, FiThermometer, FiDroplet } from 'react-icons/fi';
import { GiWheat, GiCorn, GiFruitBowl, GiPlantSeed } from 'react-icons/gi';
import './CropCalendar.css';

const CropCalendar = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedCrop, setSelectedCrop] = useState(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const crops = [
        {
            id: 1,
            name: 'Wheat',
            icon: <GiWheat />,
            seasons: ['Rabi'],
            plantingMonths: [9, 10, 11], // Oct, Nov, Dec
            harvestMonths: [3, 4, 5], // Apr, May, Jun
            waterNeeds: 'Moderate',
            temperature: '15-25°C',
            soilType: 'Loamy',
            description: 'Major winter crop, requires cool climate'
        },
        {
            id: 2,
            name: 'Rice',
            icon: <GiPlantSeed />,
            seasons: ['Kharif'],
            plantingMonths: [5, 6, 7], // Jun, Jul, Aug
            harvestMonths: [9, 10, 11], // Oct, Nov, Dec
            waterNeeds: 'High',
            temperature: '20-35°C',
            soilType: 'Clay',
            description: 'Major monsoon crop, requires abundant water'
        },
        {
            id: 3,
            name: 'Maize',
            icon: <GiCorn />,
            seasons: ['Kharif', 'Rabi'],
            plantingMonths: [5, 6, 7, 9, 10], // Jun, Jul, Aug, Oct, Nov
            harvestMonths: [8, 9, 10, 2, 3, 4], // Sep, Oct, Nov, Mar, Apr, May
            waterNeeds: 'Moderate',
            temperature: '20-30°C',
            soilType: 'Well-drained',
            description: 'Versatile crop, grows in both seasons'
        },
        {
            id: 4,
            name: 'Vegetables',
            icon: <GiFruitBowl />,
            seasons: ['All Year'],
            plantingMonths: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
            waterNeeds: 'Varies',
            temperature: '15-30°C',
            soilType: 'Rich organic',
            description: 'Multiple varieties available year-round'
        }
    ];

    const getCropsForMonth = (month) => {
        return crops.filter(crop => 
            crop.plantingMonths.includes(month) || 
            crop.harvestMonths.includes(month)
        );
    };

    const getCropStatus = (crop, month) => {
        if (crop.plantingMonths.includes(month)) return 'planting';
        if (crop.harvestMonths.includes(month)) return 'harvest';
        return 'growing';
    };

    const currentMonthCrops = getCropsForMonth(selectedMonth);

    return (
        <div className="crop-calendar">
            <div className="calendar-header">
                <div className="calendar-title">
                    <FiCalendar />
                    <h3>Crop Calendar</h3>
                </div>
                <select 
                    className="month-selector"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                    {months.map((month, index) => (
                        <option key={index} value={index}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>

            <div className="calendar-content">
                <div className="crops-grid">
                    {currentMonthCrops.map(crop => {
                        const status = getCropStatus(crop, selectedMonth);
                        return (
                            <div 
                                key={crop.id}
                                className={`crop-card ${status}`}
                                onClick={() => setSelectedCrop(crop)}
                            >
                                <div className="crop-icon">{crop.icon}</div>
                                <h4>{crop.name}</h4>
                                <span className={`crop-status status-${status}`}>
                                    {status === 'planting' ? '🌱 Planting Time' : 
                                     status === 'harvest' ? '🌾 Harvest Time' : '🌿 Growing'}
                                </span>
                                <div className="crop-seasons">
                                    {crop.seasons.map(season => (
                                        <span key={season} className="season-badge">
                                            {season}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {selectedCrop && (
                    <div className="crop-details card">
                        <div className="detail-header">
                            <div className="detail-icon">{selectedCrop.icon}</div>
                            <div>
                                <h3>{selectedCrop.name}</h3>
                                <p>{selectedCrop.description}</p>
                            </div>
                        </div>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <FiThermometer />
                                <div>
                                    <span className="detail-label">Temperature</span>
                                    <span className="detail-value">{selectedCrop.temperature}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FiDroplet />
                                <div>
                                    <span className="detail-label">Water Needs</span>
                                    <span className="detail-value">{selectedCrop.waterNeeds}</span>
                                </div>
                            </div>
                            <div className="detail-item">
                                <FiSun />
                                <div>
                                    <span className="detail-label">Soil Type</span>
                                    <span className="detail-value">{selectedCrop.soilType}</span>
                                </div>
                            </div>
                        </div>
                        <div className="detail-timeline">
                            <h4>Timeline</h4>
                            <div className="timeline-months">
                                {months.map((month, index) => {
                                    const status = getCropStatus(selectedCrop, index);
                                    return (
                                        <div 
                                            key={index} 
                                            className={`timeline-month ${status} ${index === selectedMonth ? 'current' : ''}`}
                                        >
                                            <span className="month-abbr">{month.slice(0, 3)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="timeline-legend">
                                <span className="legend-item">
                                    <span className="legend-dot planting" />
                                    Planting
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot growing" />
                                    Growing
                                </span>
                                <span className="legend-item">
                                    <span className="legend-dot harvest" />
                                    Harvest
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CropCalendar;
