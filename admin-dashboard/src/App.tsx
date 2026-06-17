import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReactGA from 'react-ga';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContentManager from './pages/ContentManager';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Header from './components/Header';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Import shared services
import { configManager } from './shared/config-manager';
import { syncService } from './shared/sync-service';
import { getFirebaseServices } from './services/firebase';
import { logger } from './services/logger';

function App() {
  // Initialize shared services on app startup
  React.useEffect(() => {
    // Initialize Google Analytics
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
    if (gaTrackingId && gaTrackingId !== 'G-XXXXXXXXXX') {
      ReactGA.initialize(gaTrackingId);
      ReactGA.pageview(window.location.pathname + window.location.search);
      logger.info('Google Analytics initialized', { trackingId: gaTrackingId });
    }

    // Initialize configuration
    try {
      const config = configManager.initialize();
      logger.info('Admin Dashboard - Configuration initialized', { environment: config.environment });

      // Validate configuration
      const validation = configManager.validateConfig();
      if (!validation.isValid) {
        logger.warn('Configuration validation warnings', { errors: validation.errors });
      }

      // Initialize Firebase services now that config is ready
      const firebaseServices = getFirebaseServices();
      logger.info('Firebase services initialized', { success: !!firebaseServices });

      // Initialize real-time sync for admin collections
      if (config.features.realTimeSync) {
        syncService.initialize(['articles', 'events', 'media', 'partners', 'content'])
          .then(() => logger.info('Real-time sync initialized for admin'))
          .catch(error => logger.error('Failed to initialize real-time sync', { error: error.message }));
      }

      // Set up error tracking
      window.addEventListener('error', (event) => {
        logger.error('Global error', { 
          message: event.error?.message,
          stack: event.error?.stack,
          filename: event.filename,
          lineno: event.lineno
        });
      });

      window.addEventListener('unhandledrejection', (event) => {
        logger.error('Unhandled promise rejection', { reason: event.reason });
      });

      // Log application startup
      logger.info('Admin Dashboard application started', {
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    } catch (error) {
      logger.error('Failed to initialize shared services', { error: error.message });
    }
  }, []);

  // Track page views on route changes
  React.useEffect(() => {
    const gaTrackingId = process.env.REACT_APP_GA_TRACKING_ID;
    if (gaTrackingId && gaTrackingId !== 'G-XXXXXXXXXX') {
      const handleLocationChange = () => {
        ReactGA.pageview(window.location.pathname + window.location.search);
      };
      window.addEventListener('popstate', handleLocationChange);
      return () => window.removeEventListener('popstate', handleLocationChange);
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // Check if user has admin role
  if (user.role !== 'admin') {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ghana-neutral-50 via-white to-ghana-neutral-100">
      <ErrorBoundary>
        <Header />
        <main className="p-4 md:p-6 lg:p-8 bg-transparent">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/content" element={<ContentManager />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </ErrorBoundary>
    </div>
  );
}

export default App;
