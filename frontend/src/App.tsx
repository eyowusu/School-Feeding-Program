import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactGA from 'react-ga';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Spotlight from './components/Spotlight';
import MissionVision from './components/MissionVision';
import Leadership from './components/Leadership';
import Mandates from './components/Mandates';
import LatestNews from './components/LatestNews';
import MediaCentre from './components/MediaCentre';
import Partners from './components/Partners';
import Map from './components/Map';
import EventCalendar from './components/EventCalendar';
import Programs from './components/Programs';
import Contact from './components/Contact';
import LiveChat from './components/LiveChat';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Import shared services
import { configManager } from './shared/config-manager';
import { syncService } from './shared/sync-service';
import { getFirebaseServices } from './services/firebase';

// Initialize Stripe with your publishable key
// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

function App() {
  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('UA-123456789-1'); // Replace with actual GA tracking ID
    ReactGA.pageview(window.location.pathname + window.location.search);

    // Initialize shared services for frontend
    try {
      const config = configManager.initialize();
      console.log('Frontend - Configuration initialized:', config.environment);

      // Validate configuration
      const validation = configManager.validateConfig();
      if (!validation.isValid) {
        console.warn('Configuration validation warnings:', validation.errors);
      }

      // Initialize Firebase services now that config is ready
      const firebaseServices = getFirebaseServices();
      console.log('Firebase services initialized:', firebaseServices ? 'Success' : 'Failed');

      // Initialize real-time sync for frontend collections (read-only for published content)
      if (config.features.realTimeSync) {
        syncService.initialize(['articles', 'events', 'media', 'partners'])
          .then(() => console.log('Real-time sync initialized for frontend'))
          .catch(error => console.error('Failed to initialize real-time sync:', error));
      }

      // Set up cache invalidation listener for real-time updates
      const handleCacheInvalidate = (event: CustomEvent) => {
        console.log('Cache invalidated for:', event.detail.collection);
        // Force re-fetch of updated content
        window.location.reload();
      };

      window.addEventListener('gsfp-cache-invalidate', handleCacheInvalidate as EventListener);

      return () => {
        window.removeEventListener('gsfp-cache-invalidate', handleCacheInvalidate as EventListener);
      };
    } catch (error) {
      console.error('Failed to initialize shared services:', error);
    }
  }, []);

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <ErrorBoundary>
          <div className="min-h-screen bg-white">
            <Navbar />
            <Routes>
              <Route path="/" element={
                <>
                  <Hero />
                  <Spotlight />
                  <Programs />
                  <MissionVision />
                  <Leadership />
                  <Mandates />
                  <LatestNews />
                  <MediaCentre />
                  <Partners />
                  <Map />
                  <EventCalendar />
                  <Contact />
                </>
              } />
              <Route path="/articles" element={<LatestNews />} />
              <Route path="/media" element={<MediaCentre />} />
              <Route path="/gallery" element={<MediaCentre />} />
              <Route path="/events" element={<EventCalendar />} />
              <Route path="/news" element={<LatestNews />} />
              <Route path="/about" element={<MissionVision />} />
              <Route path="/mandates" element={<Mandates />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
            <LiveChat />
          </div>
        </ErrorBoundary>
      </Elements>
    </Router>
  );
}

export default App;
