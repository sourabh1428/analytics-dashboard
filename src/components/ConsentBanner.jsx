"use client";

import { useState, useEffect } from 'react';
import { acceptConsent, declineConsent, getConsentState } from '../utils/mixpanel';

const ConsentBanner = () => {
  // Start unmounted-looking (false) so the very first client render matches
  // the server's HTML exactly — localStorage doesn't exist on the server, so
  // reading it during the initial render (even lazily) desyncs SSR output
  // from a returning visitor's client output and breaks hydration. Checking
  // in an effect defers the read until after hydration completes.
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(getConsentState() !== null);
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-ink bg-paper px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(23,21,15,.12)] sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs leading-relaxed tracking-[0.02em] text-ink-soft">
          WE USE ANALYTICS COOKIES TO UNDERSTAND HOW VISITORS INTERACT WITH THIS PAGE. NO PERSONAL DATA IS SHARED.{' '}
          <a href="/privacy" className="text-green underline hover:text-ink">PRIVACY POLICY</a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => { declineConsent(); setDismissed(true); }}
            className="border border-ink px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-paper"
          >
            DECLINE
          </button>
          <button
            type="button"
            onClick={() => { acceptConsent(); setDismissed(true); }}
            className="bg-ink px-4 py-2.5 font-mono text-xs tracking-[0.08em] text-paper transition-colors hover:bg-green"
          >
            ACCEPT
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
