import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from './store/store';
import './App.css';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MarketplacePage from './pages/MarketplacePage';
import CropDetailPage from './pages/CropDetailPage';
import FarmerDashboard from './pages/FarmerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AddCropPage from './pages/AddCropPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/community/CommunityPage';
import LoanPage from './pages/loans/LoanPage';
import ExportPage from './pages/export/ExportPage';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';
import SmartAssistant from './components/ai/SmartAssistant';
import QuickActionsButton from './components/common/QuickActionsButton';

function AppContent() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme || 'light');
  }, [theme]);

  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/marketplace" element={<MarketplacePage />} />
              <Route path="/crops/:id" element={<CropDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/community" element={<CommunityPage />} />

              {/* Protected Routes */}
              <Route path="/farmer/dashboard" element={
                <ProtectedRoute roles={['farmer']}>
                  <FarmerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/farmer/add-crop" element={
                <ProtectedRoute roles={['farmer']}>
                  <AddCropPage />
                </ProtectedRoute>
              } />
              <Route path="/buyer/dashboard" element={
                <ProtectedRoute roles={['buyer']}>
                  <BuyerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute roles={['farmer', 'buyer']}>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/loans" element={
                <ProtectedRoute roles={['farmer']}>
                  <LoanPage />
                </ProtectedRoute>
              } />
              <Route path="/export" element={
                <ProtectedRoute roles={['farmer', 'buyer']}>
                  <ExportPage />
                </ProtectedRoute>
              } />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthPage && <Footer />}
      {isAuthenticated && <QuickActionsButton userRole={user?.role} />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontFamily: 'Inter, sans-serif',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-xl)',
          },
          success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
      <SmartAssistant />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
