const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect';

const seedData = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Crop.deleteMany({});
        await Order.deleteMany({});
        await Notification.deleteMany({});

        const hashedPassword = await bcrypt.hash('password123', 12);

        // ─── Users ─────────────────────────────────────────
        const admin = await User.create({
            name: 'Admin AgriConnect',
            phone: '9999999999',
            password: hashedPassword,
            role: 'admin',
            isVerified: true,
            location: { state: 'Delhi', district: 'New Delhi' },
        });

        const farmers = await User.insertMany([
            {
                name: 'Rajesh Kumar',
                phone: '9876543210',
                password: hashedPassword,
                role: 'farmer',
                isVerified: true,
                avatar: '',
                location: { state: 'Punjab', district: 'Ludhiana', village: 'Mallian Kalan', pincode: '141001' },
                language: 'hi',
                rating: { average: 4.5, count: 23 },
                farmerProfile: {
                    farmSize: '15 acres',
                    crops: ['Wheat', 'Rice', 'Mustard'],
                    farmingType: 'traditional',
                    experience: 20,
                    bankDetails: { upiId: 'rajesh@upi' },
                },
            },
            {
                name: 'Anitha Devi',
                phone: '9876543211',
                password: hashedPassword,
                role: 'farmer',
                isVerified: true,
                location: { state: 'Tamil Nadu', district: 'Thanjavur', village: 'Kumbakonam', pincode: '612001' },
                language: 'ta',
                rating: { average: 4.8, count: 45 },
                farmerProfile: {
                    farmSize: '8 acres',
                    crops: ['Rice', 'Banana', 'Coconut'],
                    farmingType: 'organic',
                    experience: 15,
                },
            },
            {
                name: 'Balram Singh',
                phone: '9876543212',
                password: hashedPassword,
                role: 'farmer',
                isVerified: true,
                location: { state: 'Uttar Pradesh', district: 'Lucknow', village: 'Malihabad', pincode: '226001' },
                language: 'hi',
                rating: { average: 4.2, count: 12 },
                farmerProfile: {
                    farmSize: '25 acres',
                    crops: ['Mango', 'Guava', 'Sugarcane'],
                    farmingType: 'mixed',
                    experience: 30,
                },
            },
            {
                name: 'Lakshmi Bai',
                phone: '9876543213',
                password: hashedPassword,
                role: 'farmer',
                isVerified: true,
                location: { state: 'Maharashtra', district: 'Nashik', village: 'Niphad', pincode: '422303' },
                language: 'mr',
                rating: { average: 4.6, count: 34 },
                farmerProfile: {
                    farmSize: '12 acres',
                    crops: ['Grapes', 'Onion', 'Tomato'],
                    farmingType: 'organic',
                    experience: 18,
                },
            },
            {
                name: 'Surya Prakash',
                phone: '9876543214',
                password: hashedPassword,
                role: 'farmer',
                isVerified: true,
                location: { state: 'Andhra Pradesh', district: 'Guntur', village: 'Tenali', pincode: '522201' },
                language: 'te',
                rating: { average: 4.3, count: 19 },
                farmerProfile: {
                    farmSize: '10 acres',
                    crops: ['Chilli', 'Cotton', 'Turmeric'],
                    farmingType: 'traditional',
                    experience: 22,
                },
            },
        ]);

        const buyers = await User.insertMany([
            {
                name: 'FreshMart Wholesale',
                phone: '9988776655',
                password: hashedPassword,
                role: 'buyer',
                isVerified: true,
                location: { state: 'Delhi', district: 'New Delhi' },
                buyerProfile: {
                    businessName: 'FreshMart Wholesale Pvt Ltd',
                    businessType: 'wholesaler',
                    gstNumber: '07AAACN0749A1Z5',
                    kycVerified: true,
                },
            },
            {
                name: 'Global Exports India',
                phone: '9988776656',
                password: hashedPassword,
                role: 'buyer',
                isVerified: true,
                location: { state: 'Mumbai', district: 'Mumbai' },
                buyerProfile: {
                    businessName: 'Global Exports India Ltd',
                    businessType: 'exporter',
                    gstNumber: '27AAACG0749A1Z5',
                    kycVerified: true,
                },
            },
            {
                name: 'Organic Basket',
                phone: '9988776657',
                password: hashedPassword,
                role: 'buyer',
                isVerified: true,
                location: { state: 'Karnataka', district: 'Bengaluru' },
                buyerProfile: {
                    businessName: 'Organic Basket Retail',
                    businessType: 'retailer',
                    kycVerified: false,
                },
            },
        ]);

        // ─── Crops ─────────────────────────────────────────
        const crops = await Crop.insertMany([
            {
                farmer: farmers[0]._id,
                name: 'Premium Basmati Rice',
                category: 'grains',
                variety: 'Pusa Basmati 1121',
                description: 'Premium quality long-grain basmati rice. Aged for 2 years. Aromatic and fluffy when cooked.',
                quantity: { value: 5000, unit: 'kg' },
                qualityGrade: 'A+',
                price: { expected: 85, minimum: 75, unit: 'per_kg' },
                mandiPrice: { current: 78, lastUpdated: new Date(), mandiName: 'Ludhiana Mandi' },
                aiSuggestedPrice: { price: 82, confidence: 0.88, lastUpdated: new Date() },
                harvestDate: new Date('2026-01-15'),
                availableFrom: new Date('2026-01-20'),
                location: { state: 'Punjab', district: 'Ludhiana', village: 'Mallian Kalan' },
                isOrganic: false,
                status: 'active',
                views: 245,
                inquiries: 12,
                tags: ['basmati', 'rice', 'premium', 'aged'],
            },
            {
                farmer: farmers[0]._id,
                name: 'Organic Wheat',
                category: 'grains',
                variety: 'HD 3086',
                description: 'Freshly harvested organic wheat. No chemical fertilizers used. Perfect for chapati and bread.',
                quantity: { value: 8000, unit: 'kg' },
                qualityGrade: 'A',
                price: { expected: 32, minimum: 28, unit: 'per_kg' },
                mandiPrice: { current: 30, lastUpdated: new Date(), mandiName: 'Ludhiana Mandi' },
                aiSuggestedPrice: { price: 31, confidence: 0.82, lastUpdated: new Date() },
                harvestDate: new Date('2026-02-01'),
                location: { state: 'Punjab', district: 'Ludhiana' },
                isOrganic: true,
                certifications: ['India Organic', 'FSSAI'],
                status: 'active',
                views: 189,
                inquiries: 8,
                tags: ['wheat', 'organic', 'chapati'],
            },
            {
                farmer: farmers[1]._id,
                name: 'Sona Masoori Rice',
                category: 'grains',
                variety: 'BPT 5204',
                description: 'South Indian premium rice variety. Low glycemic index. Suitable for daily cooking.',
                quantity: { value: 3000, unit: 'kg' },
                qualityGrade: 'A+',
                price: { expected: 48, minimum: 42, unit: 'per_kg' },
                mandiPrice: { current: 45, lastUpdated: new Date(), mandiName: 'Thanjavur Mandi' },
                location: { state: 'Tamil Nadu', district: 'Thanjavur' },
                isOrganic: true,
                status: 'active',
                views: 320,
                inquiries: 15,
                tags: ['sona-masoori', 'rice', 'south-indian'],
            },
            {
                farmer: farmers[1]._id,
                name: 'Nendran Banana',
                category: 'fruits',
                variety: 'Nendran',
                description: 'Kerala special Nendran banana. Perfect for chips and traditional recipes.',
                quantity: { value: 2000, unit: 'kg' },
                qualityGrade: 'A',
                price: { expected: 35, minimum: 30, unit: 'per_kg' },
                location: { state: 'Tamil Nadu', district: 'Thanjavur' },
                status: 'active',
                views: 156,
                tags: ['banana', 'nendran', 'chips'],
            },
            {
                farmer: farmers[2]._id,
                name: 'Dasheri Mango',
                category: 'fruits',
                variety: 'Dasheri',
                description: 'Famous Lucknow Dasheri mangoes. Sweet and aromatic. Best quality from Malihabad belt.',
                quantity: { value: 1500, unit: 'kg' },
                qualityGrade: 'A+',
                price: { expected: 120, minimum: 100, unit: 'per_kg' },
                harvestDate: new Date('2026-05-15'),
                availableFrom: new Date('2026-05-20'),
                availableTill: new Date('2026-07-30'),
                location: { state: 'Uttar Pradesh', district: 'Lucknow', village: 'Malihabad' },
                status: 'active',
                views: 567,
                inquiries: 28,
                tags: ['mango', 'dasheri', 'lucknow', 'premium'],
            },
            {
                farmer: farmers[3]._id,
                name: 'Nashik Grapes',
                category: 'fruits',
                variety: 'Thompson Seedless',
                description: 'Export quality grapes from Nashik vineyards. Sweet and crispy. Cold storage available.',
                quantity: { value: 4000, unit: 'kg' },
                qualityGrade: 'A+',
                price: { expected: 90, minimum: 80, unit: 'per_kg' },
                location: { state: 'Maharashtra', district: 'Nashik', village: 'Niphad' },
                isOrganic: true,
                certifications: ['GlobalGAP'],
                status: 'active',
                views: 423,
                inquiries: 22,
                tags: ['grapes', 'nashik', 'export-quality', 'seedless'],
            },
            {
                farmer: farmers[3]._id,
                name: 'Red Onion',
                category: 'vegetables',
                variety: 'Nasik Red',
                description: 'Fresh red onions from Nashik farms. Medium size, perfect for cooking.',
                quantity: { value: 10000, unit: 'kg' },
                qualityGrade: 'A',
                price: { expected: 25, minimum: 18, unit: 'per_kg' },
                mandiPrice: { current: 22, lastUpdated: new Date(), mandiName: 'Nashik Mandi' },
                location: { state: 'Maharashtra', district: 'Nashik' },
                status: 'active',
                views: 890,
                inquiries: 45,
                tags: ['onion', 'red-onion', 'nashik'],
            },
            {
                farmer: farmers[4]._id,
                name: 'Guntur Red Chilli',
                category: 'spices',
                variety: 'Teja S17',
                description: 'Famous Guntur red chilli. High SHU rating. Perfect for spice blends.',
                quantity: { value: 2000, unit: 'kg' },
                qualityGrade: 'A',
                price: { expected: 280, minimum: 250, unit: 'per_kg' },
                mandiPrice: { current: 260, lastUpdated: new Date(), mandiName: 'Guntur Mandi' },
                location: { state: 'Andhra Pradesh', district: 'Guntur', village: 'Tenali' },
                status: 'active',
                views: 312,
                inquiries: 18,
                tags: ['chilli', 'guntur', 'spicy', 'teja'],
            },
            {
                farmer: farmers[4]._id,
                name: 'Turmeric Powder',
                category: 'spices',
                variety: 'Salem',
                description: 'High curcumin content turmeric. Bright yellow color. Farm processed and packed.',
                quantity: { value: 500, unit: 'kg' },
                qualityGrade: 'A+',
                price: { expected: 180, minimum: 150, unit: 'per_kg' },
                location: { state: 'Andhra Pradesh', district: 'Guntur' },
                isOrganic: true,
                status: 'active',
                views: 210,
                tags: ['turmeric', 'curcumin', 'organic'],
            },
        ]);

        console.log('✅ Seed data created:');
        console.log(`   👤 ${farmers.length + buyers.length + 1} Users (${farmers.length} farmers, ${buyers.length} buyers, 1 admin)`);
        console.log(`   🌾 ${crops.length} Crops`);
        console.log('');
        console.log('📝 Login Credentials:');
        console.log('   Admin:  9999999999 / password123');
        console.log('   Farmer: 9876543210 / password123');
        console.log('   Buyer:  9988776655 / password123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed Error:', error.message);
        process.exit(1);
    }
};

seedData();
