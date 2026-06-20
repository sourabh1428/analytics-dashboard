import { StrictMode, useEffect, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { DynamicSEO } from './components/SEO/DynamicSEO'
import { FullPageLoader } from './components/LoadingSpinner'
import ConsentBanner from './components/ConsentBanner'
import { initMixpanel, hasConsent, trackPageView } from './utils/mixpanel'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

// Use React.lazy for code splitting - only load components when needed
const App = lazy(() => import('./App.jsx'))

// Critical images that should be preloaded
const CRITICAL_IMAGES = [
  { url: '/logo.png', type: 'image' }
]

// Performance optimization - preload critical images
const preloadCriticalImages = (images) => {
  if (typeof window === 'undefined') return;
  images.forEach(item => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = item.type;
    link.href = item.url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

// Track route changes in SPA for GA4 + Mixpanel page_view
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('config', 'G-H54PC2W756', {
        page_path: location.pathname + location.search + location.hash,
        page_title: document.title
      });
    }
    trackPageView(location.pathname);
  }, [location.pathname, location.search, location.hash]);

  return null;
}

// Root component with error boundary
const Root = () => {
  useEffect(() => {
    // Preload critical images
    preloadCriticalImages(CRITICAL_IMAGES);

    // Remove loading indicator
    const loadingElement = document.querySelector('.loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    // Initialize Mixpanel only if consent was previously given
    if (hasConsent()) initMixpanel();
  }, []);

  return (
    <StrictMode>
      <BrowserRouter>
        <HelmetProvider>
          <DynamicSEO />
          <AnalyticsTracker />
          <Suspense fallback={<FullPageLoader />}>
            <App />
          </Suspense>
          <ConsentBanner />
          <Analytics />
          <SpeedInsights />
        </HelmetProvider>
      </BrowserRouter>
    </StrictMode>
  )
}

// Mount the application - use custom function to ensure efficient hydration
const renderApp = () => {
  const rootElement = document.getElementById('root');
  createRoot(rootElement).render(<Root />);
}

// Optimize initial render timing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
