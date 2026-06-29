"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { track } from '../utils/mixpanel';

const navLinks = [
  { name: 'Product', section: 'product' },
  { name: 'Features', section: 'features' },
  { name: 'Pricing', section: 'pricing' },
  { name: 'Customers', section: 'customers' },
  { name: 'Contact', path: '/contact' },
];

const DASHBOARD_LOGIN_URL = 'https://dashboard.easibill.com/';

const NavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [pathname]);

  const goTo = (path) => { router.push(path); setIsOpen(false); };

  const goToSection = (section) => {
    if (pathname !== '/') {
      router.push('/');
      window.setTimeout(() => {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    } else {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  const isActive = (link) =>
    (link.path && pathname === link.path) || (link.section === 'product' && pathname === '/');

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
      data-section="navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 transition-all duration-300 ${
            scrolled
              ? 'border border-gray-100 bg-white/90 shadow-sm backdrop-blur-md'
              : 'border border-transparent bg-transparent'
          }`}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo('/')}
            className="flex items-center gap-3 py-3 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 rounded-xl"
            aria-label="Go to Easibill home"
          >
            <img src="/logo.png" alt="Easibill Logo" className="h-9 w-9 rounded-xl" width="36" height="36" />
            <span className="text-base font-semibold tracking-tight text-slate-900">Easibill</span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 md:flex" aria-label="Primary navigation">
            {navLinks.map((link) => (
              <button
                key={link.name}
                type="button"
                onClick={() => link.section ? goToSection(link.section) : goTo(link.path)}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                  isActive(link)
                    ? 'bg-violet-50 text-violet-600'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-slate-900'
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => { track('demo_requested', { source: 'navbar', method: 'button_click' }); router.push('/contact'); }}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-slate-900"
            >
              Book demo
            </button>
            <button
              type="button"
              onClick={() => { track('trial_started', { source: 'navbar' }); window.location.assign(DASHBOARD_LOGIN_URL); }}
              className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700"
              data-conversion-button="get-started"
            >
              Start free
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-slate-900 md:hidden"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="mx-auto mt-2 max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden"
          >
            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-xl">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  type="button"
                  onClick={() => link.section ? goToSection(link.section) : goTo(link.path)}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-slate-900"
                >
                  {link.name}
                </button>
              ))}
              <div className="mt-2 grid gap-2 border-t border-gray-100 pt-3">
                <button
                  type="button"
                  onClick={() => { track('demo_requested', { source: 'navbar', method: 'button_click' }); router.push('/contact'); }}
                  className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
                >
                  Book demo
                </button>
                <button
                  type="button"
                  onClick={() => { track('trial_started', { source: 'navbar' }); window.location.assign(DASHBOARD_LOGIN_URL); }}
                  className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white"
                >
                  Start free trial
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default NavBar;
