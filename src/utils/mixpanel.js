import mixpanel from 'mixpanel-browser';

const TOKEN = '1282b0f6a2f0be1a4aeaa5bb88a6d47f';
const CONSENT_KEY = 'easibill_analytics_consent';

let initialized = false;

export const hasConsent = () =>
  typeof window !== 'undefined' && localStorage.getItem(CONSENT_KEY) === 'accepted';

export const getConsentState = () =>
  typeof window !== 'undefined' ? localStorage.getItem(CONSENT_KEY) : null;

export const initMixpanel = () => {
  if (initialized) return;
  mixpanel.init(TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: false,
    persistence: 'localStorage',
  });
  initialized = true;
};

export const acceptConsent = () => {
  localStorage.setItem(CONSENT_KEY, 'accepted');
  initMixpanel();
};

export const declineConsent = () => {
  localStorage.setItem(CONSENT_KEY, 'declined');
};

export const track = (event, properties = {}) => {
  if (!initialized) return;
  mixpanel.track(event, properties);
};

export const trackPageView = (path) => {
  if (!initialized) return;
  mixpanel.track('page_viewed', { path });
};
