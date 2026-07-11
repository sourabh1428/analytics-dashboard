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
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-slate-200 bg-white/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-xl backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-600">
          We use analytics cookies to understand how visitors interact with this page. No personal data is shared.{' '}
          <a href="/privacy" className="underline hover:text-emerald-700">Privacy Policy</a>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => { declineConsent(); setDismissed(true); }}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => { acceptConsent(); setDismissed(true); }}
            className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-950"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
